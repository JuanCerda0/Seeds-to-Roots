# Documentación del Dashboard Admin - Seeds to Roots

## 📋 Índice
1. [Arquitectura General](#arquitectura-general)
2. [Mock Data (JSON)](#mock-data-json)
3. [API Client (api.js)](#api-client-apijs)
4. [Dashboard Controller (dashboard.js)](#dashboard-controller-dashboardjs)
5. [Estructura de Carpetas](#estructura-de-carpetas)
6. [Flujo de Datos](#flujo-de-datos)
7. [Cómo Extender](#cómo-extender)

---

## 🏗️ Arquitectura General

El dashboard está construido con una **arquitectura en capas** que separa responsabilidades:

```
┌─────────────────────────────────────────┐
│        FRONTEND (HTML/CSS/JS)           │
│    ↓ dashboard.html (interfaz)          │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│   LÓGICA (JavaScript)                   │
│ ↓ dashboard.js (controla el flujo)      │
│ ↓ api.js (simula peticiones HTTP)       │
└────────────┬────────────────────────────┘
             │
┌────────────▼────────────────────────────┐
│   DATOS (JSON Mock)                     │
│ ↓ productos.json                        │
│ ↓ usuarios.json                         │
└─────────────────────────────────────────┘
```

### Ventajas de esta arquitectura:
- **Separación de responsabilidades**: Cada archivo tiene una función clara
- **Fácil de mantener**: Los cambios en datos no afectan la lógica
- **Escalable**: Cuando conectes a un backend real, solo cambias `api.js`
- **Testeable**: Cada componente se puede probar independientemente

---

## 📦 Mock Data (JSON)

### ¿Qué es?
Son archivos JSON que **simulan una base de datos real**. Contienen datos de ejemplo que se cargan como si vinieran de un servidor backend.

### Ubicación
```
frontend/
  └─ api/
      └─ mockData/
          ├─ productos.json
          └─ usuarios.json
```

### Estructura de `productos.json`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Tomate Cherry",
      "descripcion": "Tomates cherry frescos de cultivo orgánico",
      "categoria": "Hortalizas",
      "precio": 5.99,
      "stock": 150,
      "sku": "TCH-001",
      "imagen": "tomate-cherry.jpg",
      "activo": true,
      "fechaCreacion": "2024-08-15",
      "fechaActualizacion": "2024-11-20"
    },
    // ... más productos
  ],
  "total": 10,
  "timestamp": "2024-11-24T10:30:00Z"
}
```

**Campos importantes:**
| Campo             | Tipo      | Descripción                               |
|-------------------|-----------|-------------------------------------------|
| `id`              | number    | Identificador único del producto          |
| `nombre`          | string    | Nombre del producto                       |
| `precio`          | number    | Precio en dólares                         |
| `stock`           | number    | Cantidad disponible                       |
| `categoria`       | string    | Categoría (Hortalizas, Verduras, etc.)    |
| `activo`          | boolean   | Si el producto está disponible            |
| `fechaCreacion`   | string    | Cuándo se agregó                          |
| `fechaActualizacion` | string | Última modificación                       |

### Estructura de `usuarios.json`

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "nombre": "Juan Pérez",
      "email": "juan.perez@email.com",
      "telefono": "+34 612 345 678",
      "direccion": "Calle Principal 123, Barcelona",
      "ciudad": "Barcelona",
      "estado": "activo",
      "rol": "cliente",
      "activo": true,
      "fechaRegistro": "2024-10-15",
      "fechaActualizacion": "2024-11-20",
      "ultimoLogin": "2024-11-23"
    },
    // ... más usuarios
  ],
  "total": 10,
  "timestamp": "2024-11-24T10:30:00Z"
}
```

**Campos importantes:**
| Campo             | Tipo      | Descripción                       |
|-------------------|-----------|-----------------------------------|
| `id`              | number    | Identificador único               |
| `nombre`          | string    | Nombre del usuario                |
| `email`           | string    | Correo electrónico                |
| `estado`          | string    | "activo" o "inactivo"             |
| `rol`             | string    | Tipo de usuario (cliente, admin)  |
| `fechaRegistro`   | string    | Cuándo se registró                |
| `ultimoLogin`     | string    | Último acceso                     |

### Por qué es importante
- Define la **estructura de datos** que usará la API
- Te permite trabajar sin necesidad de un backend real
- Es fácil de modificar para pruebas
- Cuando conectes el backend, tendrá la misma estructura

---

## 🔌 API Client (api.js)

### ¿Qué es?
Es una **clase que simula un servidor backend**. Actúa como intermediaria entre el frontend y los datos JSON, permitiendo hacer "peticiones HTTP" como si fuera un servidor real.

### Ubicación
```
frontend/
  └─ api/
      └─ api.js
```

### Inicialización

```javascript
const api = new APIClient();
```

El constructor detecta automáticamente la ruta correcta de los JSON según dónde se ejecute:
- Desde `/admin/pages/` → usa `../../api/mockData`
- Desde `/admin/` → usa `../api/mockData`
- Desde raíz → usa `./api/mockData`

### Métodos principales para PRODUCTOS

#### 1. **getProductos(options)**
Obtiene todos los productos con filtrado opcional.

```javascript
// Sin filtros
const response = await api.getProductos();

// Con filtros
const response = await api.getProductos({
  categoria: 'Hortalizas',      // Filtrar por categoría
  soloConStock: true,            // Solo productos disponibles
  limit: 10,                      // Máximo de resultados
  page: 1                         // Número de página
});

// Respuesta
{
  success: true,
  data: [...productos...],
  total: 10,
  timestamp: "2024-11-24T..."
}
```

#### 2. **getProductoById(id)**
Obtiene un producto específico.

```javascript
const response = await api.getProductoById(1);
// Retorna el producto con id=1
```

#### 3. **getProductosRecientes(limit)**
Obtiene los últimos productos modificados.

```javascript
const response = await api.getProductosRecientes(5);
// Retorna los últimos 5 productos ordenados por fecha
```

#### 4. **crearProducto(producto)**
Simula la creación de un producto.

```javascript
const response = await api.crearProducto({
  nombre: "Tomate",
  precio: 5.99,
  stock: 100
});
// Retorna el producto creado con ID generado
```

#### 5. **actualizarProducto(id, updates)**
Simula la actualización de un producto.

```javascript
const response = await api.actualizarProducto(1, {
  precio: 6.99,
  stock: 85
});
```

#### 6. **eliminarProducto(id)**
Simula la eliminación de un producto.

```javascript
const response = await api.eliminarProducto(1);
```

### Métodos principales para USUARIOS

Son idénticos a los de productos:
- `getUsuarios(options)`
- `getUsuarioById(id)`
- `getUsuariosRecientes(limit)`
- `crearUsuario(usuario)`
- `actualizarUsuario(id, updates)`
- `eliminarUsuario(id)`

### Método especial: getEstadisticas()

Calcula **números automáticamente** a partir de los datos:

```javascript
const response = await api.getEstadisticas();

// Retorna
{
  success: true,
  data: {
    totalProductos: 10,              // Cantidad de productos
    totalUsuarios: 10,               // Cantidad de usuarios
    productosActivos: 10,            // Productos activos
    usuariosActivos: 8,              // Usuarios activos
    stockTotal: 1845,                // Stock total en almacén
    precioPromedio: "3.75",          // Precio promedio
    productosConBajoStock: 1,        // Productos con stock ≤ 50
    usuariosPendientes: 2            // Usuarios inactivos
  }
}
```

### Características técnicas

**Simulación de latencia:**
```javascript
this.timeout = 500; // Simula 500ms de retraso
```
Esto hace que parezca una petición real a un servidor.

**Manejo de errores:**
```javascript
try {
  const response = await api.getProductos();
  if (!response.success) {
    throw new Error(response.error);
  }
} catch (error) {
  console.error('Error:', error);
}
```

### Transición a Backend Real

Cuando tengas un backend real, solo necesitas reemplazar los métodos de `api.js`:

```javascript
// DE ESTO:
async getProductos(options = {}) {
  const data = await this._fetchData(`${this.baseUrl}/productos.json`);
}

// A ESTO:
async getProductos(options = {}) {
  const response = await fetch('https://tu-api.com/api/productos', {
    method: 'GET',
    headers: { 'Authorization': 'Bearer token' }
  });
  return response.json();
}
```

---

## 🎮 Dashboard Controller (dashboard.js)

### ¿Qué es?
Es una **clase que controla toda la lógica del dashboard**. Coordina entre la interfaz HTML y la API, manejando la carga de datos y actualización de la UI.

### Ubicación
```
frontend/
  └─ admin/
      └─ js/
          └─ dashboard.js
```

### Ciclo de vida

```
1. HTML carga → DOMContentLoaded
       ↓
2. Se crea instancia de Dashboard()
       ↓
3. Se ejecuta init()
       ↓
4. Se cargan datos (stats, productos, usuarios)
       ↓
5. Se configuran event listeners
       ↓
6. Dashboard listo para interacción
```

### Método: Constructor

```javascript
constructor() {
  this.api = new APIClient();    // Crea conexión a la API
  this.init();                   // Inicia el dashboard
}
```

### Método: init()

```javascript
async init() {
  try {
    await this.cargarEstadisticas();
    await this.cargarProductos();
    await this.cargarUsuarios();
    this.setupEventListeners();
    console.log('Dashboard cargado exitosamente');
  } catch (error) {
    console.error('Error al inicializar:', error);
  }
}
```

**¿Qué hace?**
1. **Espera** a que se carguen las estadísticas
2. **Espera** a que se carguen los productos
3. **Espera** a que se carguen los usuarios
4. **Configura** los botones y eventos
5. **Muestra** mensajes en la consola para debug

El `async/await` asegura que cada carga termine antes de pasar a la siguiente.

### Método: cargarEstadisticas()

```javascript
async cargarEstadisticas() {
  const response = await this.api.getEstadisticas();
  
  if (!response.success) {
    throw new Error('No se pudieron cargar las estadísticas');
  }

  const stats = response.data;

  // Busca elementos HTML por ID y les coloca valores
  document.getElementById('stat-productos').textContent = stats.totalProductos;
  document.getElementById('stat-usuarios').textContent = stats.totalUsuarios;
  document.getElementById('stat-pedidos').textContent = (stats.totalProductos * 2);
}
```

**Paso a paso:**
1. Llama a `api.getEstadisticas()`
2. Verifica que no haya error
3. Obtiene los datos del objeto stats
4. Busca elementos HTML con `getElementById()`
5. Les asigna valores con `.textContent`

**Elementos HTML esperados:**
```html
<p class="stat-number" id="stat-productos">0</p>
<p class="stat-number" id="stat-usuarios">0</p>
<p class="stat-number" id="stat-pedidos">0</p>
```

### Método: cargarProductos()

```javascript
async cargarProductos() {
  const response = await this.api.getProductosRecientes(5);
  
  const productos = response.data;
  const tbody = document.getElementById('productos-tbody');
  tbody.innerHTML = ''; // Limpia la tabla

  if (productos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="5">No hay productos</td></tr>';
    return;
  }

  productos.forEach(producto => {
    const row = document.createElement('tr');
    const statusClass = this.getStatusClass(producto.stock);
    const statusText = this.getStatusText(producto.stock);

    row.innerHTML = `
      <td>${producto.id}</td>
      <td>${producto.nombre}</td>
      <td>${producto.categoria}</td>
      <td>$${producto.precio.toFixed(2)}</td>
      <td><span class="badge ${statusClass}">${statusText}</span></td>
    `;

    tbody.appendChild(row);
  });
}
```

**Paso a paso:**
1. Obtiene últimos 5 productos
2. Encuentra la tabla en el HTML (`tbody`)
3. Limpia la tabla (borra filas anteriores)
4. Si no hay productos, muestra mensaje
5. **Para cada producto:**
   - Crea una fila (`<tr>`)
   - Determina el color del badge según stock
   - Llena la fila con datos
   - Agrega la fila a la tabla

**Visualización:**
```
Producto en API → Fila en tabla HTML
{
  id: 1,
  nombre: "Tomate",
  precio: 5.99,
  stock: 150
}
↓
<tr>
  <td>1</td>
  <td>Tomate</td>
  <td>Hortalizas</td>
  <td>$5.99</td>
  <td><span class="badge badge-success">En Stock</span></td>
</tr>
```

### Método: cargarUsuarios()

Idéntico a `cargarProductos()` pero para usuarios.

### Método: getStatusClass(stock)

```javascript
getStatusClass(stock) {
  if (stock === 0) return 'badge-danger';      // Rojo
  if (stock <= 50) return 'badge-warning';     // Amarillo
  return 'badge-success';                      // Verde
}
```

**Lógica:**
| Stock | Clase CSS | Color |
|-------|-----------|-------|
| 0 | `badge-danger` | 🔴 Rojo |
| 1-50 | `badge-warning` | 🟡 Amarillo |
| 51+ | `badge-success` | 🟢 Verde |

### Método: getStatusText(stock)

```javascript
getStatusText(stock) {
  if (stock === 0) return 'Sin Stock';
  if (stock <= 50) return 'Bajo Stock';
  return 'En Stock';
}
```

### Método: setupEventListeners()

```javascript
setupEventListeners() {
  // Recarga automática cada 30 segundos
  setInterval(() => {
    this.cargarEstadisticas();
    this.cargarProductos();
    this.cargarUsuarios();
  }, 30000);

  // Botones "Ver todos"
  const btnVerProductos = document.getElementById('btn-ver-productos');
  const btnVerUsuarios = document.getElementById('btn-ver-usuarios');

  if (btnVerProductos) {
    btnVerProductos.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'products.html';
    });
  }

  if (btnVerUsuarios) {
    btnVerUsuarios.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'users.html';
    });
  }
}
```

**¿Qué hace?**
1. **setInterval**: Recarga todos los datos cada 30 segundos (30000 ms)
2. **addEventListener**: Agrega listeners a los botones
3. **preventDefault**: Evita que el link haga su acción por defecto
4. **window.location.href**: Redirige a otra página

### Método: recargar()

```javascript
async recargar() {
  console.log('Recargando dashboard...');
  await this.cargarEstadisticas();
  await this.cargarProductos();
  await this.cargarUsuarios();
}
```

Permite recargar los datos manualmente. Se puede llamar desde la consola:
```javascript
window.dashboard.recargar();
```

### Inicializador Global

```javascript
document.addEventListener('DOMContentLoaded', () => {
  window.dashboard = new Dashboard();
});
```

**¿Qué hace?**
1. Espera a que el HTML cargue completamente
2. Crea una instancia de Dashboard
3. La guarda en `window.dashboard` para acceso global
4. Esto permite debuggear desde consola

---

## 📁 Estructura de Carpetas

```
frontend/
├── admin/                          # Panel de administración
│   ├── components/                 # Componentes reutilizables (futuro)
│   ├── css/
│   │   ├── dashboard.css           # Estilos del dashboard
│   │   └── sidebar.css             # Estilos de la navegación
│   ├── js/
│   │   └── dashboard.js            # Lógica del dashboard
│   └── pages/
│       ├── dashboard.html          # Página principal
│       ├── products.html           # Página de productos (próxima)
│       └── users.html              # Página de usuarios (próxima)
│
├── api/                            # API Mock
│   ├── api.js                      # Clase APIClient
│   └── mockData/
│       ├── productos.json          # Datos de productos
│       └── usuarios.json           # Datos de usuarios
│
├── client/                         # Sitio público
│   ├── pages/
│   ├── css/
│   └── js/
│
└── README.md                       # Este archivo
```

---

## 🔄 Flujo de Datos

### 1. Carga inicial del dashboard

```
1. dashboard.html se abre en navegador
   ↓
2. Se ejecuta el código JavaScript
   ↓
3. DOMContentLoaded → new Dashboard()
   ↓
4. Constructor crea APIClient
   ↓
5. init() se ejecuta automáticamente
   ↓
6. cargarEstadisticas()
   ├─ api.getEstadisticas()
   ├─ fetch productos.json + usuarios.json
   ├─ calcula números
   └─ actualiza HTML
   ↓
7. cargarProductos()
   ├─ api.getProductosRecientes(5)
   ├─ fetch productos.json
   ├─ crea filas <tr>
   └─ agrega a tabla
   ↓
8. cargarUsuarios()
   ├─ api.getUsuariosRecientes(5)
   ├─ fetch usuarios.json
   ├─ crea filas <tr>
   └─ agrega a tabla
   ↓
9. setupEventListeners()
   ├─ Configura recargas cada 30s
   └─ Configura botones
   ↓
10. ✅ Dashboard listo
```

### 2. Cuando haces click en "Ver todos"

```
Usuario hace click en "Ver todos Productos"
   ↓
addEventListener detecta el click
   ↓
preventDefault() evita comportamiento por defecto
   ↓
window.location.href = 'products.html'
   ↓
Navega a página de productos
```

### 3. Recargas automáticas cada 30 segundos

```
setInterval ejecuta cada 30000ms
   ↓
Llama cargarEstadisticas()
Llama cargarProductos()
Llama cargarUsuarios()
   ↓
Datos actualizados en la UI
```

---

## 🚀 Cómo Extender

### Agregar un nuevo campo a Productos

**1. Actualiza el JSON:**
```json
{
  "id": 1,
  "nombre": "Tomate",
  "nuevoCampo": "nuevo valor"  // ← Agregado
}
```

**2. Actualiza el HTML de la tabla:**
```html
<th>Nuevo Campo</th>
```

**3. Actualiza dashboard.js:**
```javascript
row.innerHTML = `
  ...
  <td>${producto.nuevoCampo}</td>
`;
```

### Crear un nuevo método en APIClient

```javascript
async getProductosPorCategoria(categoria) {
  const data = await this._fetchData(`${this.baseUrl}/productos.json`);
  const productos = data.data.filter(p => p.categoria === categoria);
  return {
    success: true,
    data: productos,
    timestamp: new Date().toISOString()
  };
}
```

### Usar el nuevo método en Dashboard

```javascript
async cargarProductosPorCategoria(categoria) {
  const response = await this.api.getProductosPorCategoria('Hortalizas');
  // ... mostrar en tabla
}
```

### Conectar a un Backend Real

Reemplaza los métodos de APIClient:

```javascript
async getProductos(options = {}) {
  const queryString = new URLSearchParams(options).toString();
  const response = await fetch(`http://tu-api.com/productos?${queryString}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
  return response.json();
}
```

---

## 🐛 Debugging

### Ver datos en consola

```javascript
// Ver todos los productos
const prods = await window.dashboard.api.getProductos();
console.log(prods);

// Ver estadísticas
const stats = await window.dashboard.api.getEstadisticas();
console.log(stats);

// Recargar dashboard manualmente
window.dashboard.recargar();
```

### Ver rutas correctas

```javascript
console.log(window.dashboard.api.baseUrl);
```

### Ver errores en la consola del navegador
- Abre DevTools (F12)
- Ve a la pestaña "Console"
- Ahí verás `console.log()` y `console.error()`

---

## ✅ Checklist para verificar que todo funciona

- [ ] El dashboard carga sin errores (F12 → Console)
- [ ] Las tarjetas muestran números correctos
- [ ] La tabla de productos se llena con datos
- [ ] La tabla de usuarios se llena con datos
- [ ] Los botones "Ver todos" funcionan (aunque aún no hayan páginas)
- [ ] Los datos se recargan cada 30 segundos
- [ ] Los colores de stock son: 🟢Verde (En Stock), 🟡Amarillo (Bajo Stock), 🔴Rojo (Sin Stock)

---

## 📚 Próximos pasos

1. **Crear páginas de Productos y Usuarios completas** con listados totales
2. **Agregar búsqueda y filtros** en las tablas
3. **Crear formularios** para crear/editar productos y usuarios
4. **Agregar autenticación** para el panel admin
5. **Conectar a un backend real** (reemplazar JSON con API real)

