# Seeds to Roots - Frontend

Aplicacion web construida con React + Vite para la plataforma Seeds to Roots. Entrega catalogo, blog y flujo de compra para clientes, ademas de un panel administrativo para gestionar productos y usuarios.

## Stack principal
- React 19 con React Router para el enrutamiento publico y del panel admin.
- Vite como bundler y dev server.
- Axios para consumir la API Spring Boot (`VITE_API_URL`).
- Context API para manejar el carrito sincronizado contra el backend.
- CSS modularizado (global + componentes admin) para estilos.

## Requisitos previos
- Node.js >= 18 (Railway usa 18 o 20 LTS).
- npm >= 9.
- Acceso al backend desplegado (`https://seeds-to-roots-backend-deployment.up.railway.app` o equivalente).

## Instalacion y ejecucion local
```bash
npm install
npm run dev           # entorno local en http://localhost:5173
npm run build         # genera artefactos productivos en /dist
npm run preview       # sirve el build en un puerto temporal
```

La raiz del repo contiene el `package.json`, `start.sh` y `vite.config.js` ya que Railway requiere que el proyecto exista en el directorio raiz. No hay que entrar a carpetas adicionales para levantar el frontend.

## Scripts para despliegue (Railway u otro PaaS)
- `start.sh` instala dependencias, ejecuta `npm run build` y lanza `npm run preview -- --host 0.0.0.0 --port $PORT`. Configura el Start Command del servicio como `bash start.sh`.
- Define la variable de entorno `PORT` si el proveedor no la inyecta.
- Mantener el repo raiz como el directorio de despliegue. Si Railway indica que faltan archivos es probable que la ruta raiz apunte a otra carpeta.

## Variables de entorno
Crear un archivo `.env` (no se versiona) con:
```
VITE_API_URL=https://seeds-to-roots-backend-deployment.up.railway.app
```
Usa `.env.example` (si corresponde) para documentar valores por defecto o agrega esta referencia manualmente cuando compartas el proyecto. Cada vez que cambie el host/puerto del backend actualiza `VITE_API_URL`.

> Nota CORS: El backend lee `cors.allowed-origins`. Al probar en local mantente en `http://localhost:5173` (o agrega tu URL a la configuracion del backend). Para entornos productivos indica al equipo backend el dominio final del frontend.

## Arquitectura de carpetas
```
src/
 |- assets/                  # imagenes y recursos estaticos
 |- components/              # componentes reutilizables (navbar, layout admin, etc.)
 |- context/CartContext.jsx  # logica global del carrito
 |- pages/                   # paginas publicas y admin (Home, Blog, Carrito, Admin/*)
 |- services/                # clientes axios (api.js, carritoService, userService, authService)
 |- App.jsx / main.jsx       # definicion de rutas y bootstrap
public/                      # favicon y estaticos servidos por Vite
docs/                        # material de apoyo para la presentacion
start.sh                     # script usado por Railway
```

## Autenticacion y seguridad en el frontend
- El login y registro guardan el JWT en `localStorage` (`token`) y un objeto `user` con email/rol/id.
- `authService` decodifica el JWT (sin librerias externas) para exponer `getUserIdFromToken`, `getCurrentUser`, `isAdmin` e `isAuthenticated`. Tambien emite el evento `auth-change` para que otros componentes reaccionen a cambios de sesion.
- `ProtectedRoute` usa `authService` para restringir accesos al dashboard admin.
- El `CartContext` ya no confia en IDs provenientes del estado global: decodifica el `usuarioId` desde el JWT y lo utiliza para todas las llamadas (`get`, `add`, `update`, `remove`, `clear`). Si no hay token, funciona en modo local sin persistencia.
- Todos los requests pasan por `src/services/api.js`. Alli se configura Axios con `baseURL = VITE_API_URL` y se adjunta el encabezado `Authorization: Bearer <token>` automaticamente.

## Integraciones backend relevantes
- **Productos**: CRUD completo en `/api/productos`. Las paginas publicas usan `productos.getAll()` para renderizar el catalogo y se integran con el contexto del carrito para agregar items.
- **Carrito**: `carritoService` expone helpers `get`, `add`, `update`, `remove` y `clear`. Cada metodo recibe el `usuarioId` derivado del token para cumplir con la nueva validacion del backend. Los errores (p. ej. token invalido o 403) se registran en consola y el contexto se mantiene en modo offline.
- **Usuarios (admin)**: `userService.create` consume el nuevo endpoint `POST /api/usuarios` para dar de alta clientes o administradores. El formulario `src/pages/admin/UserForm.jsx` incluye seleccion de rol (`ADMIN`/`CLIENTE`), flag de estado `activo`, validaciones por campo y manejo de errores 400 para mostrar mensajes claros ("Datos invalidos o duplicados").
- **Sesion**: `authService.login` y `authService.register` usan `/auth/login` y `/auth/register`. Tras autenticar, el navbar muestra el usuario logeado con menu desplegable y permite cerrar sesion llamando a `authService.logout()`.

## Flujo administrativo destacado
1. Ingresar al dashboard via `/login` con un usuario de rol `ADMIN`.
2. Desde `Usuarios` se puede crear o editar registros. El formulario incluye datos personales, contacto, ubicacion, rol y estado activo. Toda la data se envia en el payload requerido por el backend:
```json
{
  "run": "12345678-9",
  "nombre": "Nombre",
  "apellidos": "Apellidos",
  "email": "correo@duoc.cl",
  "telefono": "+56912345678",
  "direccion": "Calle 123",
  "region": "Region Metropolitana",
  "comuna": "Santiago",
  "ciudad": "Santiago",
  "fechaNacimiento": "1990-01-01",
  "password": "ClaveTemporal",
  "rol": "ADMIN",
  "activo": true
}
```
3. Ante respuestas 400 se muestra el mensaje entregado por el backend o un fallback legible para el administrador.

## Buenas practicas para colaboradores
- No subir `.env`; documenta nuevos valores en el README o en un `.env.example` dedicado.
- Ejecutar `npm run lint` antes de abrir PRs.
- Usar ASCII simple en strings para evitar problemas de encoding (los textos visibles pueden estilizarse via CSS si necesitan acentos).
- Mantener sincronizado el `CartContext` con los cambios que se realicen en los endpoints del backend, ya que el ID del usuario ahora es validado contra el JWT.

## Troubleshooting comun
- **403/401 al consumir la API**: verifica que el token exista en `localStorage`, que no haya expirado y que el backend reconozca el dominio del frontend (CORS).
- **Carrito vacio tras refrescar**: asegurate de iniciar sesion; sin token el contexto funciona solo en memoria. Comprueba que el payload del JWT incluya `id`, `userId` o `sub` numerico.
- **Railway con error "Start command failed"**: valida que `bash start.sh` tenga permisos de ejecucion y que `PORT` este definido.
- **Assets faltantes**: confirma que la carpeta `public/` tenga los recursos esperados y que las rutas relativas se mantengan tras el build.

## Recursos adicionales
- `/docs`: material para la presentacion (mockups, textos, etc.).
- Backend: repositorio independiente en Spring Boot. Coordina con el equipo backend para nuevos cambios en contratos de API o configuracion de CORS.

Para cualquier modificacion futura, actualiza este README incluyendo dependencias, endpoints o pasos de despliegue que cambien el flujo descrito arriba.
