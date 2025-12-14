# Seeds to Roots

Aplicación web para Seeds to Roots, plataforma que conecta a clientes finales con agricultores locales. El repositorio contiene el frontend completo (React + Vite) y consume un backend en Spring Boot a través de una API REST (`/api/**`). El objetivo de este README es documentar la arquitectura y los flujos técnicos más relevantes para la presentación y el traspaso del proyecto.

## Arquitectura

- **Framework:** React 18 con Vite.
- **Estado global:** Context API (`CartContext`, `useCart`). El carrito se sincroniza con el backend utilizando endpoints autenticados.
- **Routing:** React Router DOM. Las rutas de administración están protegidas con `ProtectedRoute` y verifican autenticación + rol.
- **Estilos:** CSS Modules para páginas específicas y estilos globales reutilizables (`src/components/css/global.css`). Los componentes de administración tienen su propio set en `src/components/admin`.
- **Servicios HTTP:** `src/services/*.js` centraliza llamadas REST sobre un wrapper de Axios (`src/services/api.js`) que agrega el token JWT desde `localStorage`.
- **Autenticación:** `authService` maneja login/registro, persiste `{ token, user }` en `localStorage` y expone utilidades para conocer el usuario corriente y su rol.

## Estructura de carpetas (frontend)

```
seeds-to-roots-client/
├─ public/                # assets estáticos (favicons, etc.)
├─ src/
│  ├─ components/         # NavBar, layout admin, sidebar, estilos globales
│  ├─ context/            # CartContext + hook useCart
│  ├─ pages/
│  │  ├─ Home.jsx         # landing y secciones informativas
│  │  ├─ Productos.jsx    # catálogo público + filtros/botón carrito
│  │  ├─ Blog.jsx         # posts estáticos
│  │  ├─ Carrito.jsx      # checkout y gestión de cupón
│  │  └─ admin/           # Dashboard, ProductsAdmin, Users, formularios
│  ├─ services/           # auth, productos, usuarios, carrito, api wrapper
│  ├─ App.jsx             # definición de rutas
│  └─ main.jsx            # bootstrap
└─ package.json
```

## Configuración y ejecución

1. **Pre-requisitos**
   - Node.js ≥ 18
   - npm ≥ 9
   - Backend Spring Boot corriendo y accesible (por defecto `http://localhost:8080`).

2. **Variables de entorno**
   - Crear un archivo `seeds-to-roots-client/.env` (o editar el existente) con:
     ```bash
     VITE_API_URL=http://localhost:8080
     ```
     Ajustar la URL según el entorno donde se ejecute el backend.

3. **Instalación y scripts**
   ```bash
   cd seeds-to-roots-client
   npm install          # instala dependencias
   npm run dev          # arranca Vite en modo desarrollo (http://localhost:5173)
   npm run build        # genera artefactos para producción en /dist
   npm run preview      # sirve la versión build para QA local
   ```

## Flujos clave

- **Autenticación**
  - `authService.login`/`register` consumen `/auth/**` y guardan `token` + `user` en `localStorage`.
  - `ProtectedRoute` bloquea rutas privadas (admin) si no existe token o si `user.rol` ≠ `ADMIN`.
  - `NavBar` escucha eventos `auth-change`/`storage` para actualizar la UI (mostrar correo y dropdown con “Cerrar sesión”).

- **Carrito persistente**
  - `CartContext` consulta `carritoService.get(usuarioId)` al montar (si hay usuario).
  - Cada operación (`addToCart`, `updateQuantity`, `removeFromCart`, `clearCart`) intenta sincronizar con el backend (`/api/carrito/{usuarioId}`) y, si falla, cae en un fallback local para evitar perder la operación en el frontend.
  - `useCart` expone `cartItems`, `cartCount`, `calculateTotals` y banderas (`isPersisted`, `syncing`). Las páginas `Productos` y `Carrito` consumen ese hook.

- **Administración**
  - `AdminLayout` + `Sidebar` arman el shell del panel.
  - `ProductsAdmin` y `Users` listan entidades paginadas con filtros y abren formularios dedicados (`ProductForm`, `UserForm`).
  - Los formularios usan `useSearchParams` para manejar modo edición (`?id=...`) y validan campos antes de enviar.
  - `productoService`, `userService` y `carritoService` centralizan las llamadas al backend, manteniendo separados los concerns de UI y datos.

## Buenas prácticas y notas

- **Navegación SPA**: todos los botones/enlaces usan `useNavigate` o `<Link>` para evitar recargas completas y preservar el estado global.
- **Estilos reutilizables**: la cabecera pública (NavBar) sirve tanto para el home como para las páginas internas, garantizando coherencia visual.
- **Eventos de autenticación**: `authService` emite un evento `auth-change` al iniciar/cerrar sesión; cualquier componente que necesite reaccionar puede suscribirse a ese evento.
- **Protección de rutas**: se recomienda mantener cualquier vista sensible detrás de `ProtectedRoute` y validar igualmente en el backend.

## Deploy

1. Ejecutar `npm run build` dentro de `seeds-to-roots-client`.
2. El build final queda en `seeds-to-roots-client/dist/` (HTML + JS + CSS minificado). Subirlo al servidor estático de preferencia (Nginx, S3, Vercel, etc.).
3. Asegurar que `VITE_API_URL` apunte al backend desplegado y que los encabezados CORS del backend permitan el dominio del front.

## Próximos pasos sugeridos

- Internacionalizar los textos (actualmente están codificados en español y contienen caracteres corrompidos heredados de la codificación original).
- Unificar estilos del módulo administrador mediante un tema global (hay CSS independientes por componente).
- Añadir pruebas unitarias/integración para componentes críticos (NavBar, CartContext, formularios admin).

---
Para dudas adicionales, revisar los servicios dentro de `src/services/` y los contextos en `src/context/`, donde reside la mayor parte de la lógica compartida.
