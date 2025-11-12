# Frontend - Waifu Farm

## Descripción
Frontend de Waifu Farm construido con HTML, CSS y JavaScript vanilla. Incluye un panel de administración para gestionar usuarios y productos.

## Estructura del Proyecto

```
front-end/
├── Administrador/
│   ├── index.html (punto de entrada)
│   ├── css/
│   │   ├── HomeAdmin.css       # Estilos del dashboard
│   │   └── formularioUsuario.css # Estilos de formularios
│   ├── js/
│   │   ├── HomeAdmin.js        # Lógica del dashboard
│   │   └── formularioUsuario.js # Lógica de formularios
│   └── pages/
│       ├── HomeAdmin.html      # Dashboard principal
│       ├── crearUsuario.html   # Crear nuevo usuario
│       └── editarUsuario.html  # Editar usuario existente
├── css/
│   ├── style.css              # Estilos principales
│   ├── login.css              # Estilos de login
│   ├── productos.css          # Estilos de productos
│   ├── blog.css               # Estilos de blog
│   ├── contacto.css           # Estilos de contacto
│   ├── nosotros.css           # Estilos de nosotros
│   └── signin.css             # Estilos de registro
├── js/
│   ├── main.js                # Scripts principales
│   ├── login.js               # Lógica de login
│   ├── signin.js              # Lógica de registro
│   ├── blog.js                # Lógica de blog
│   └── test.js                # Scripts de prueba
├── img/                        # Imágenes del sitio
└── pages/
    ├── login.html             # Página de login
    ├── signin.html            # Página de registro
    ├── productos.html         # Catálogo de productos
    ├── blog.html              # Blog
    ├── contacto.html          # Contacto
    ├── nosotros.html          # Acerca de nosotros
    └── test.html              # Página de prueba
```

## Panel de Administración

### Ubicación
`/Administrador/pages/`

### Páginas Disponibles

#### 1. **HomeAdmin.html** - Dashboard Principal
- **Ruta**: `pages/HomeAdmin.html`
- **Descripción**: Panel principal de administración
- **Contenido**:
  - Tabla de usuarios con opción de editar/eliminar
  - Tabla de productos con opción de editar/eliminar
  - Botón para agregar nuevos usuarios y productos

**Campos de la Tabla de Usuarios:**
- ID
- Nombre
- Email
- Teléfono
- Fecha de Registro
- Estado (Activo/Inactivo)
- Acciones (Editar/Eliminar)

**Campos de la Tabla de Productos:**
- ID
- Nombre
- Categoría
- Precio
- Stock
- Fecha de Creación
- Estado (Activo/Inactivo)
- Acciones (Editar/Eliminar)

#### 2. **crearUsuario.html** - Crear Nuevo Usuario
- **Ruta**: `pages/crearUsuario.html`
- **Descripción**: Formulario para crear un nuevo usuario
- **Campos**:
  - Nombre * (requerido)
  - Email * (requerido)
  - Teléfono (opcional)
  - Estado * (requerido) - Activo/Inactivo
- **Validaciones**:
  - Nombre: mínimo 3 caracteres
  - Email: formato válido
  - Teléfono: mínimo 7 dígitos (si se proporciona)
  - Estado: obligatorio
- **Acciones**:
  - Crear Usuario
  - Cancelar (vuelve al Dashboard)

#### 3. **editarUsuario.html** - Editar Usuario Existente
- **Ruta**: `pages/editarUsuario.html?id={id}`
- **Descripción**: Formulario para editar un usuario existente
- **Campos**: Idénticos a crear usuario
- **Funcionalidades**:
  - Carga automática de datos del usuario
  - Actualizar información
  - Eliminar usuario con confirmación modal
  - Cancelar (vuelve al Dashboard)

## Archivos CSS

### HomeAdmin.css
Estilos para el dashboard principal:
- Sidebar con navegación
- Tabla de datos responsive
- Badges de estado
- Botones de acción
- Responsive design para móviles

**Clases principales:**
- `.sidebar` - Barra lateral de navegación
- `.main-content` - Contenido principal
- `.data-table` - Tablas de datos
- `.status-badge` - Badges de estado
- `.action-buttons` - Botones de acción

### formularioUsuario.css
Estilos para formularios:
- Diseño responsive
- Inputs con focus states
- Validación visual
- Modal de confirmación
- Mensajes de éxito/error
- Sidebar compartido con dashboard

**Clases principales:**
- `.form-section` - Contenedor del formulario
- `.form-group` - Grupo de campos
- `.error-message` - Mensajes de error
- `.modal` - Modal de confirmación
- `.mensaje` - Mensajes de éxito/error globales

## Archivos JavaScript

### HomeAdmin.js
Gestión del dashboard principal:

**Variables globales:**
- `usuariosData` - Array de usuarios
- `productosData` - Array de productos
- `API_BASE_URL` - URL base de la API

**Funciones principales:**
- `cargarUsuarios()` - GET /api/usuarios
- `cargarProductos()` - GET /api/productos
- `mostrarUsuarios()` - Renderiza tabla de usuarios
- `mostrarProductos()` - Renderiza tabla de productos
- `editarUsuario(id)` - Redirige a editarUsuario.html?id={id}
- `eliminarUsuario(id)` - Confirma y redirige a edición
- `formatearFecha(fecha)` - Formatea fechas a es-ES
- `formatearPrecio(precio)` - Formatea precios con 2 decimales
- `mostrarErrorUsuarios(mensaje)` - Muestra error en tabla usuarios
- `mostrarErrorProductos(mensaje)` - Muestra error en tabla productos

**Eventos:**
- Carga automática de datos al inicializar
- Toggle del menú en dispositivos móviles
- Cierre del sidebar al hacer clic en enlaces

### formularioUsuario.js
Gestión de formularios de usuarios:

**Variables globales:**
- `usuarioId` - ID del usuario en edición
- `esEdicion` - Booleano para detectar modo edición
- `API_BASE_URL` - URL base de la API

**Funciones principales:**
- `obtenerParametroURL(nombre)` - Extrae parámetros de la URL
- `cargarDatosUsuario()` - GET /api/usuarios/{id}
- `manejarEnvioFormulario(event)` - Valida y envía el formulario
- `validarFormulario()` - Valida todos los campos
- `mostrarErrorCampo(campo, mensaje)` - Muestra error en campo específico
- `mostrarExito(mensaje)` - Muestra mensaje de éxito
- `mostrarError(mensaje)` - Muestra mensaje de error
- `mostrarConfirmacionEliminar()` - Abre modal de confirmación
- `confirmarEliminar()` - DELETE /api/usuarios/{id}
- `cerrarModalEliminar()` - Cierra modal de confirmación

**Eventos:**
- Detección automática de modo (crear/editar) desde URL
- Validación en tiempo real de campos
- Toggle del menú en dispositivos móviles

## Integración con Backend

### API Base URL
```javascript
const API_BASE_URL = 'http://localhost:5500/api';
```

### Endpoints Utilizados

**Usuarios:**
```
GET    /api/usuarios           # Obtener todos
GET    /api/usuarios/:id       # Obtener uno
POST   /api/usuarios           # Crear
PUT    /api/usuarios/:id       # Actualizar
DELETE /api/usuarios/:id       # Eliminar
```

**Productos:**
```
GET    /api/productos          # Obtener todos
GET    /api/productos/:id      # Obtener uno
POST   /api/productos          # Crear
PUT    /api/productos/:id      # Actualizar
DELETE /api/productos/:id      # Eliminar
```

### Estructura de Datos - Usuarios
```javascript
{
    id: número,
    nombre: string,
    email: string,
    telefono: string,
    fecha_registro: date,
    estado: 'activo' | 'inactivo'
}
```

### Estructura de Datos - Productos
```javascript
{
    id: número,
    nombre: string,
    categoria: string,
    precio: number,
    stock: number,
    fecha_creacion: date,
    estado: 'activo' | 'inactivo'
}
```

## Validaciones en Cliente

### Nombre
- ✓ Requerido
- ✓ Mínimo 3 caracteres
- ✓ Máximo 100 caracteres

### Email
- ✓ Requerido
- ✓ Formato de email válido (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- ✓ Máximo 100 caracteres

### Teléfono
- ✓ Opcional
- ✓ Mínimo 7 dígitos (si se proporciona)
- ✓ Máximo 20 caracteres

### Estado
- ✓ Requerido
- ✓ Valores: 'activo' | 'inactivo'

## Diseño Responsivo

### Breakpoints
- **Desktop**: >= 1024px
- **Tablet**: 769px - 1023px
- **Mobile**: <= 768px
- **Small Mobile**: <= 480px

### Características Responsive
- Sidebar se convierte en modal en tablets
- Tablas con scroll horizontal en móviles
- Formularios full-width en móviles
- Botones apilados verticalmente en móviles
- Menú toggle en dispositivos pequeños

## Navegación

### Flujo de Usuario Admin

```
HomeAdmin.html
    ↓
    ├─→ [+ Agregar Usuario] → crearUsuario.html
    │                              ↓
    │                        [Crear Usuario] → POST /api/usuarios
    │                              ↓
    │                        HomeAdmin.html (actualizado)
    │
    └─→ [Editar] en tabla → editarUsuario.html?id={id}
                                 ↓
                          GET /api/usuarios/{id}
                                 ↓
                          [Actualizar Usuario] → PUT /api/usuarios/{id}
                                 ↓
                          HomeAdmin.html (actualizado)
                                 ↓
                          [Eliminar Usuario] → DELETE /api/usuarios/{id}
                                 ↓
                          HomeAdmin.html
```

## Requisitos del Navegador

- ✓ ES6+ JavaScript
- ✓ Fetch API
- ✓ CSS Grid y Flexbox
- ✓ LocalStorage (opcional)

**Navegadores Soportados:**
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Cómo Usar

### 1. Acceder al Panel de Administración
```
http://localhost:puerto/Administrador/pages/HomeAdmin.html
```

### 2. Ver Usuarios y Productos
Los datos se cargan automáticamente desde la API al abrir el dashboard.

### 3. Crear Nuevo Usuario
1. Haz clic en "+ Agregar Usuario"
2. Completa el formulario
3. Haz clic en "Crear Usuario"
4. Recibirás una confirmación y serás redirigido al dashboard

### 4. Editar Usuario
1. Haz clic en "Editar" en la tabla de usuarios
2. Modifica los datos
3. Haz clic en "Actualizar Usuario"
4. Serás redirigido al dashboard

### 5. Eliminar Usuario
1. Ve a editar un usuario
2. Haz clic en "Eliminar Usuario"
3. Confirma en el modal
4. Usuario eliminado y redirigido al dashboard

## Manejo de Errores

### En Cargas de Datos
- Si no hay conexión a la API, se muestra: "Error al cargar usuarios/productos. Intenta más tarde."
- Las tablas mostrarán un mensaje de error en rojo

### En Formularios
- Validaciones en cliente previo al envío
- Mensajes de error específicos por campo
- Mensajes de error global si la API falla

### En Eliminación
- Modal de confirmación antes de eliminar
- Confirmación visual de eliminación exitosa
- Manejo de errores de API

## Notas Importantes

1. **CORS**: Si el backend está en otro puerto, asegúrate de tener CORS habilitado
2. **API_BASE_URL**: Actualiza esta constante si cambias la URL del backend
3. **Validaciones**: Las validaciones en cliente son complementarias a las del servidor
4. **Fechas**: Se formatean según la localidad es-ES
5. **Precios**: Se muestran con 2 decimales y separadores de miles

## Próximas Mejoras

- [ ] Crear página de gestión de productos
- [ ] Agregar formulario para crear/editar productos
- [ ] Implementar búsqueda y filtrado
- [ ] Agregar paginación
- [ ] Implementar autenticación
- [ ] Agregar notificaciones (toast)
- [ ] Mejorar UX con animaciones
- [ ] Agregar temas oscuro/claro
- [ ] Agregar exportación de datos (CSV/PDF)
- [ ] Mejorar validaciones con librería
