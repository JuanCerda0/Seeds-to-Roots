# Documentación del Dashboard Admin - Seeds to Roots

## 📋 Índice
1. [Arquitectura General](#arquitectura-general)
2. [Mock Data (JSON)](#mock-data-json)
3. [API Client (api.js)](#api-client-apijs)
4. [Dashboard Controller (dashboard.js)](#dashboard-controller-dashboardjs)
5. [Products Controller (products.js)](#products-controller-productsjs)
6. [Product Form Controller (product-form.js)](#product-form-controller-product-formjs)
7. [Users Controller (users.js)](#users-controller-usersjs)
8. [User Form Controller (user-form.js)](#user-form-controller-user-formjs)
9. [Estructura de Carpetas](#estructura-de-carpetas)
10. [Flujo de Datos](#flujo-de-datos)
11. [Cómo Extender](#cómo-extender)

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

## 🛍️ Products Controller (products.js)

### ¿Qué es?
Es una **clase que controla la página de listado de productos** (products.html). Maneja búsqueda, filtros, paginación y operaciones CRUD (crear, editar, eliminar).

### Ubicación
```
frontend/
  └─ admin/
      └─ js/
          └─ products.js
```

### Propiedades principales

```javascript
class ProductsController {
  this.api = new APIClient();           // Conexión a API
  this.currentPage = 1;                 // Página actual de paginación
  this.itemsPerPage = 10;               // 10 productos por página
  this.allProducts = [];                // Array con TODOS los productos
  this.filteredProducts = [];           // Array con productos tras filtros
}
```

### Ciclo de vida

```
1. HTML carga → DOMContentLoaded
       ↓
2. new ProductsController()
       ↓
3. init()
       ↓
4. cargarProductos()
       ├─ api.getProductos()
       ├─ almacena en allProducts
       ├─ almacena en filteredProducts
       └─ mostrarProductos()
       ↓
5. setupEventListeners()
       ├─ Botón "Crear Producto"
       ├─ Botones "Anterior/Siguiente"
       └─ Buttons Editar/Eliminar
       ↓
6. setupFilterListeners()
       ├─ Input de búsqueda
       ├─ Dropdown de categoría
       ├─ Dropdown de estado de stock
       └─ Todos lanzan aplicarFiltros()
       ↓
7. ✅ Lista de productos lista
```

### Método: cargarProductos()

```javascript
async cargarProductos() {
  const response = await this.api.getProductos({ limit: 1000 });
  
  if (!response.success) {
    throw new Error('No se pudieron cargar los productos');
  }

  this.allProducts = response.data;              // Guarda todos
  this.filteredProducts = [...this.allProducts]; // Copia para filtrar
  this.currentPage = 1;                         // Reinicia a página 1
  this.mostrarProductos();
  this.actualizarContador();
}
```

**Paso a paso:**
1. Llama API para obtener todos los productos
2. Si hay error, lanza excepción
3. Guarda los productos en `allProducts` (nunca cambian)
4. Copia a `filteredProducts` (estos SÍ cambian con filtros)
5. Reinicia a página 1
6. Renderiza la tabla
7. Actualiza el contador de total

**¿Por qué dos arrays?**
- `allProducts`: Original intacto, sirve para reaplicar filtros
- `filteredProducts`: Resultado tras buscar/filtrar, sirve para paginar

### Método: mostrarProductos()

```javascript
mostrarProductos() {
  const tbody = document.getElementById('productos-tbody');
  tbody.innerHTML = '';

  if (this.filteredProducts.length === 0) {
    tbody.innerHTML = '<tr><td colspan="8">No hay productos</td></tr>';
    return;
  }

  // Calcula qué rango de productos mostrar
  const inicio = (this.currentPage - 1) * this.itemsPerPage;
  const fin = inicio + this.itemsPerPage;
  const productosEnPagina = this.filteredProducts.slice(inicio, fin);

  // Recorre cada producto de esta página
  productosEnPagina.forEach(producto => {
    const row = document.createElement('tr');
    const statusClass = this.getStatusClass(producto.stock);
    const statusText = this.getStatusText(producto.stock);

    row.innerHTML = `
      <td>${producto.id}</td>
      <td><strong>${producto.sku}</strong></td>
      <td>${producto.nombre}</td>
      <td>${producto.categoria}</td>
      <td>$${producto.precio.toFixed(2)}</td>
      <td>${producto.stock}</td>
      <td><span class="badge ${statusClass}">${statusText}</span></td>
      <td>
        <button class="btn-edit" onclick="window.productsController.abrirFormulario(${producto.id})">
          ✏️ Editar
        </button>
        <button class="btn-delete" onclick="window.productsController.eliminarProducto(${producto.id})">
          🗑️ Eliminar
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });

  this.actualizarPaginacion();
}
```

**Lógica de paginación:**
```
Página 1: slice(0, 10)     → Productos 0-9
Página 2: slice(10, 20)    → Productos 10-19
Página 3: slice(20, 30)    → Productos 20-29
```

### Método: aplicarFiltros()

```javascript
aplicarFiltros() {
  const searchValue = document.getElementById('search-input').value.toLowerCase();
  const categoryValue = document.getElementById('category-filter').value;
  const stockValue = document.getElementById('stock-filter').value;

  this.filteredProducts = this.allProducts.filter(producto => {
    // FILTRO 1: Búsqueda (nombre o SKU)
    const matchBusqueda = 
      producto.nombre.toLowerCase().includes(searchValue) ||
      producto.sku.toLowerCase().includes(searchValue);

    if (!matchBusqueda) return false;

    // FILTRO 2: Categoría
    if (categoryValue && producto.categoria !== categoryValue) {
      return false;
    }

    // FILTRO 3: Estado de stock
    if (stockValue) {
      if (stockValue === 'en-stock' && producto.stock === 0) return false;
      if (stockValue === 'bajo-stock' && (producto.stock === 0 || producto.stock > 50)) return false;
      if (stockValue === 'sin-stock' && producto.stock !== 0) return false;
    }

    return true; // Pasó todos los filtros
  });

  this.currentPage = 1;
  this.mostrarProductos();
  this.actualizarContador();
}
```

**Tres niveles de filtro:**
1. **Búsqueda:** Usuario digita "Tomate" → busca en nombre y SKU
2. **Categoría:** Dropdown selecciona "Hortalizas" → solo esos
3. **Stock:** Dropdown selecciona "Bajo Stock" → stock entre 1-50

Todos se aplican conjuntamente (AND logic):
```
Mostrar si: (busqueda coincide) AND (categoría coincide) AND (stock coincide)
```

### Método: abrirFormulario(productId)

```javascript
abrirFormulario(productId) {
  if (productId) {
    // Editar producto
    window.location.href = `product-form.html?id=${productId}`;
  } else {
    // Crear nuevo
    window.location.href = 'product-form.html';
  }
}
```

**Dos modos:**
- Con ID: `product-form.html?id=5` → Carga producto 5 para editar
- Sin ID: `product-form.html` → Formulario vacío para crear

### Método: eliminarProducto(productId)

```javascript
async eliminarProducto(productId) {
  if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
    try {
      const response = await this.api.eliminarProducto(productId);

      if (response.success) {
        alert('Producto eliminado exitosamente');
        await this.cargarProductos(); // Recarga la lista
      }
    } catch (error) {
      alert('Error al eliminar el producto');
    }
  }
}
```

**Paso a paso:**
1. Pide confirmación al usuario
2. Si acepta, llama API para eliminar
3. Si éxito, muestra mensaje y recarga lista
4. Si error, muestra alerta

### Métodos helper: getStatusClass() y getStatusText()

```javascript
getStatusClass(stock) {
  if (stock === 0) return 'badge-danger';    // Rojo
  if (stock <= 50) return 'badge-warning';   // Amarillo
  return 'badge-success';                    // Verde
}

getStatusText(stock) {
  if (stock === 0) return 'Sin Stock';
  if (stock <= 50) return 'Bajo Stock';
  return 'En Stock';
}
```

**Tabla de conversión:**
| Stock | Clase | Texto |
|-------|-------|-------|
| 0 | badge-danger | Sin Stock |
| 1-50 | badge-warning | Bajo Stock |
| 51+ | badge-success | En Stock |

### Métodos de paginación

```javascript
actualizarPaginacion() {
  const totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  const btnPrev = document.getElementById('btn-prev');
  const btnNext = document.getElementById('btn-next');

  btnPrev.disabled = this.currentPage === 1;
  btnNext.disabled = this.currentPage === totalPages;
  
  document.getElementById('pagination-info').textContent = 
    `Página ${this.currentPage} de ${totalPages}`;
}

actualizarContador() {
  const texto = `${this.filteredProducts.length} producto${this.filteredProducts.length !== 1 ? 's' : ''}`;
  document.getElementById('product-count').textContent = texto;
}
```

### Inicializador

```javascript
document.addEventListener('DOMContentLoaded', () => {
  window.productsController = new ProductsController();
});
```

Almacena el controlador en `window` para acceso global:
```javascript
// Desde consola:
window.productsController.cargarProductos();
window.productsController.aplicarFiltros();
```

---

## 📝 Product Form Controller (product-form.js)

### ¿Qué es?
Controla el **formulario de crear/editar productos** (product-form.html). Maneja validaciones en tiempo real, carga de datos en modo edición, y envío al API.

### Ubicación
```
frontend/
  └─ admin/
      └─ js/
          └─ product-form.js
```

### Propiedades principales

```javascript
class ProductFormController {
  this.api = new APIClient();
  this.productId = null; // null para crear, número para editar
  this.validationRules = {
    sku: { required: true, minLength: 3, maxLength: 50 },
    nombre: { required: true, maxLength: 100 },
    categoria: { required: true },
    descripcion: { maxLength: 500 },
    precio: { required: true, min: 0 },
    stock: { required: true, min: 0, isInteger: true },
    stockCritico: { min: 0, isInteger: true }
  };
}
```

### Ciclo de vida

```
1. product-form.html se abre
       ↓
2. new ProductFormController()
       ↓
3. init()
       ├─ setupFormListeners()
       ├─ getProductIdFromURL()
       └─ Si hay ID:
              cargarProducto() ← Pre-llena el formulario
          Si no hay ID:
              Muestra "Nuevo Producto"
       ↓
4. Usuario rellena campos
       ├─ blur → validarCampo()
       └─ input → limpiarError()
       ↓
5. Usuario hace submit
       ├─ validarFormulario() ← Valida TODOS
       └─ handleSubmit()
              ├─ Captura datos
              ├─ api.crearProducto() o api.actualizarProducto()
              └─ window.location = 'products.html'
```

### Método: getProductIdFromURL()

```javascript
getProductIdFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') ? parseInt(params.get('id')) : null;
}
```

**Ejemplos:**
- `product-form.html?id=5` → retorna `5`
- `product-form.html` → retorna `null`

### Método: cargarProducto()

```javascript
async cargarProducto() {
  const response = await this.api.getProductoById(this.productId);
  const producto = response.data;

  // Pre-llena el formulario
  document.getElementById('sku').value = producto.sku;
  document.getElementById('nombre').value = producto.nombre;
  document.getElementById('categoria').value = producto.categoria;
  document.getElementById('descripcion').value = producto.descripcion;
  document.getElementById('precio').value = producto.precio;
  document.getElementById('stock').value = producto.stock;
  document.getElementById('stockCritico').value = producto.stockCritico;
  document.getElementById('imagen').value = producto.imagen;
  document.getElementById('activo').checked = producto.activo;

  // Cambia el botón a "Actualizar"
  document.getElementById('btn-submit').textContent = 'Actualizar Producto';
}
```

**¿Qué hace?**
1. Obtiene el producto del API
2. Llena cada campo del formulario con sus valores actuales
3. Cambia el botón de "Crear" a "Actualizar"

### Método: validarCampo(fieldName)

```javascript
validarCampo(fieldName) {
  const field = document.getElementById(fieldName);
  const rules = this.validationRules[fieldName];
  const value = field.value.trim();

  // 1. Requerido
  if (rules.required && !value) {
    this.mostrarError(fieldName, 'Este campo es requerido');
    return false;
  }

  // 2. Longitud mínima
  if (rules.minLength && value.length < rules.minLength) {
    this.mostrarError(fieldName, `Mínimo ${rules.minLength} caracteres`);
    return false;
  }

  // 3. Longitud máxima
  if (rules.maxLength && value.length > rules.maxLength) {
    this.mostrarError(fieldName, `Máximo ${rules.maxLength} caracteres`);
    return false;
  }

  // 4. Rango numérico
  if (rules.min !== undefined && parseFloat(value) < rules.min) {
    this.mostrarError(fieldName, `Debe ser mayor o igual a ${rules.min}`);
    return false;
  }

  // 5. Debe ser entero
  if (rules.isInteger && !Number.isInteger(parseFloat(value))) {
    this.mostrarError(fieldName, 'Debe ser un número entero');
    return false;
  }

  this.limpiarError(fieldName);
  return true;
}
```

**Orden de validaciones:**
1. ¿Es requerido y está vacío? ❌
2. ¿Es muy corto? ❌
3. ¿Es muy largo? ❌
4. ¿Es número negativo? ❌
5. ¿Debe ser entero pero tiene decimales? ❌
6. ✅ Pasó todas las validaciones

### Métodos helper: mostrarError() y limpiarError()

```javascript
mostrarError(fieldName, mensaje) {
  const field = document.getElementById(fieldName);
  field.parentElement.classList.add('error'); // Añade clase CSS

  const errorElement = document.getElementById(`error-${fieldName}`);
  errorElement.textContent = mensaje;
  errorElement.classList.add('show');
}

limpiarError(fieldName) {
  const field = document.getElementById(fieldName);
  field.parentElement.classList.remove('error');

  const errorElement = document.getElementById(`error-${fieldName}`);
  errorElement.textContent = '';
  errorElement.classList.remove('show');
}
```

**HTML esperado:**
```html
<div class="form-group">
  <label for="sku">Código:</label>
  <input type="text" id="sku" name="sku">
  <div class="error-message" id="error-sku"></div>
</div>
```

**CSS:**
```css
.form-group.error input {
  border-color: red;
  background-color: #ffe0e0;
}

.error-message {
  display: none;
  color: red;
  font-size: 0.9em;
  margin-top: 5px;
}

.error-message.show {
  display: block;
}
```

### Método: handleSubmit(e)

```javascript
async handleSubmit(e) {
  e.preventDefault();

  if (!this.validarFormulario()) {
    alert('Por favor corrige los errores en el formulario');
    return;
  }

  const formData = {
    sku: document.getElementById('sku').value,
    nombre: document.getElementById('nombre').value,
    categoria: document.getElementById('categoria').value,
    descripcion: document.getElementById('descripcion').value,
    precio: parseFloat(document.getElementById('precio').value),
    stock: parseInt(document.getElementById('stock').value),
    stockCritico: parseInt(document.getElementById('stock-critico').value) || 0,
    imagen: document.getElementById('imagen').value,
    activo: document.getElementById('activo').checked
  };

  try {
    let response;

    if (this.productId) {
      // ACTUALIZAR
      response = await this.api.actualizarProducto(this.productId, formData);
    } else {
      // CREAR
      response = await this.api.crearProducto(formData);
    }

    if (response.success) {
      alert('Producto guardado exitosamente');
      window.location.href = 'products.html';
    }
  } catch (error) {
    alert('Error al guardar el producto');
  }
}
```

**Paso a paso:**
1. Previene comportamiento por defecto del formulario
2. Valida TODOS los campos
3. Captura valores, convierte tipos (parseFloat, parseInt)
4. Si hay ID → llama `actualizarProducto()`
5. Si no hay ID → llama `crearProducto()`
6. Si éxito → redirige a products.html
7. Si error → muestra alerta

---

## 👥 Users Controller (users.js)

### ¿Qué es?
Controla la **página de listado de usuarios** (users.html). Muy similar a ProductsController pero con filtros específicos para usuarios (rol, estado).

### Ubicación
```
frontend/
  └─ admin/
      └─ js/
          └─ users.js
```

### Propiedades principales

```javascript
class UsersController {
  this.api = new APIClient();
  this.currentPage = 1;
  this.itemsPerPage = 10;
  this.allUsers = [];           // Todos los usuarios
  this.filteredUsers = [];      // Usuarios filtrados
}
```

### Método: cargarUsuarios()

```javascript
async cargarUsuarios() {
  const response = await this.api.getUsuarios({ limit: 1000 });
  
  this.allUsers = response.data;
  this.filteredUsers = [...this.allUsers];
  this.currentPage = 1;
  this.mostrarUsuarios();
  this.actualizarContador();
}
```

Idéntico a ProductsController.

### Método: mostrarUsuarios()

```javascript
mostrarUsuarios() {
  const tbody = document.getElementById('usuarios-tbody');
  const inicio = (this.currentPage - 1) * this.itemsPerPage;
  const fin = inicio + this.itemsPerPage;
  const usuariosEnPagina = this.filteredUsers.slice(inicio, fin);

  usuariosEnPagina.forEach(usuario => {
    const row = document.createElement('tr');
    const rolClass = this.getRolClass(usuario.rol);
    const statusClass = usuario.estado === 'activo' ? 'badge-success' : 'badge-warning';
    const nombreCompleto = `${usuario.nombre} ${usuario.apellidos}`;

    row.innerHTML = `
      <td>${usuario.id}</td>
      <td><strong>${usuario.run}</strong></td>
      <td>${nombreCompleto}</td>
      <td>${usuario.email}</td>
      <td><span class="role-badge ${rolClass}">${this.getDisplayRol(usuario.rol)}</span></td>
      <td><span class="badge ${statusClass}">${usuario.estado}</span></td>
      <td>${usuario.region}</td>
      <td>
        <button class="btn-edit" onclick="window.usersController.abrirFormulario(${usuario.id})">
          ✏️ Editar
        </button>
        <button class="btn-delete" onclick="window.usersController.eliminarUsuario(${usuario.id})">
          🗑️ Eliminar
        </button>
      </td>
    `;
    tbody.appendChild(row);
  });

  this.actualizarPaginacion();
}
```

**Diferencias vs Products:**
- Muestra nombre completo (nombre + apellidos)
- Muestra RUN en lugar de SKU
- Usa `role-badge` en lugar de state badge para el rol

### Método: aplicarFiltros()

```javascript
aplicarFiltros() {
  const searchValue = document.getElementById('search-input').value.toLowerCase();
  const rolValue = document.getElementById('rol-filter').value;
  const statusValue = document.getElementById('status-filter').value;

  this.filteredUsers = this.allUsers.filter(usuario => {
    // FILTRO 1: Búsqueda (nombre completo, email, RUN)
    const nombreCompleto = `${usuario.nombre} ${usuario.apellidos}`.toLowerCase();
    const matchBusqueda = 
      nombreCompleto.includes(searchValue) ||
      usuario.email.toLowerCase().includes(searchValue) ||
      usuario.run.includes(searchValue);

    if (!matchBusqueda) return false;

    // FILTRO 2: Rol
    if (rolValue && usuario.rol !== rolValue) {
      return false;
    }

    // FILTRO 3: Estado
    if (statusValue && usuario.estado !== statusValue) {
      return false;
    }

    return true;
  });

  this.currentPage = 1;
  this.mostrarUsuarios();
  this.actualizarContador();
}
```

**Filtros específicos:**
- Búsqueda en 3 campos: nombre + apellidos, email, RUN
- Rol: admin / vendedor / cliente
- Estado: activo / inactivo

### Métodos helper: getRolClass() y getDisplayRol()

```javascript
getRolClass(rol) {
  switch (rol) {
    case 'admin':
      return 'role-admin';      // Morado
    case 'vendedor':
      return 'role-vendedor';   // Amarillo
    case 'cliente':
      return 'role-cliente';    // Azul
  }
}

getDisplayRol(rol) {
  switch (rol) {
    case 'admin':
      return 'Administrador';
    case 'vendedor':
      return 'Vendedor';
    case 'cliente':
      return 'Cliente';
  }
}
```

**Tabla de colores:**
| Rol | Clase CSS | Color | Texto mostrado |
|-----|-----------|-------|----------------|
| admin | role-admin | Morado | Administrador |
| vendedor | role-vendedor | Amarillo | Vendedor |
| cliente | role-cliente | Azul | Cliente |

### Métodos: abrirFormulario() y eliminarUsuario()

Idénticos a ProductsController, pero para usuarios.

---

## 👤 User Form Controller (user-form.js)

### ¿Qué es?
Controla el **formulario de crear/editar usuarios** (user-form.html). Similar a ProductFormController pero con validaciones más complejas (RUN, email whitelist).

### Ubicación
```
frontend/
  └─ admin/
      └─ js/
          └─ user-form.js
```

### Propiedades principales

```javascript
class UserFormController {
  this.api = new APIClient();
  this.userId = null;
  this.validationRules = {
    run: {
      required: true,
      minLength: 7,
      maxLength: 9,
      regex: /^\d{7,9}$/,
      message: 'El RUN debe tener 7 a 9 dígitos sin puntos ni guion'
    },
    email: {
      required: true,
      maxLength: 100,
      regex: /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i,
      message: 'Email inválido. Dominios permitidos: @duoc.cl, @profesor.duoc.cl, @gmail.com'
    },
    nombre: { required: true, maxLength: 50 },
    apellidos: { required: true, maxLength: 100 },
    telefono: { optional: true },
    fechaNacimiento: { optional: true },
    region: { required: true },
    comuna: { required: true, maxLength: 50 },
    direccion: { required: true, maxLength: 300 },
    rol: { required: true }
  };
}
```

### Ciclo de vida

Idéntico a ProductFormController:
1. Lee URL para detectar crear o editar
2. Si hay ID, carga usuario y pre-llena
3. Configura validación en tiempo real
4. Al submit, valida y envía

### Método: validarCampo(fieldName)

```javascript
validarCampo(fieldName) {
  const field = document.getElementById(fieldName);
  const rules = this.validationRules[fieldName];
  const value = field.value.trim();

  // Requerido
  if (rules.required && !value) {
    this.mostrarError(fieldName, 'Este campo es requerido');
    return false;
  }

  if (!value && !rules.required) {
    // Campo opcional y vacío → válido
    this.limpiarError(fieldName);
    return true;
  }

  // Longitud mínima y máxima
  if (rules.minLength && value.length < rules.minLength) {
    this.mostrarError(fieldName, `Mínimo ${rules.minLength} caracteres`);
    return false;
  }

  if (rules.maxLength && value.length > rules.maxLength) {
    this.mostrarError(fieldName, `Máximo ${rules.maxLength} caracteres`);
    return false;
  }

  // REGEX (para RUN y email)
  if (rules.regex && value && !rules.regex.test(value)) {
    this.mostrarError(fieldName, rules.message);
    return false;
  }

  this.limpiarError(fieldName);
  return true;
}
```

**Validaciones especiales con REGEX:**

**RUN:**
```javascript
/^\d{7,9}$/

// Valida:
✅ 12345678    (8 dígitos)
✅ 123456789   (9 dígitos)
❌ 1234567     (7 dígitos OK pero continuamos)
❌ 12.345.678  (tiene puntos)
❌ 12-345-678  (tiene guiones)
```

**Email:**
```javascript
/^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i

// Valida:
✅ juan.perez@duoc.cl
✅ profesor.juan@profesor.duoc.cl
✅ usuario@gmail.com
❌ juan.perez@yahoo.com        (dominio no permitido)
❌ juan.perez@duoc.com         (no es .cl)
```

### Método: updateDireccionCount()

```javascript
updateDireccionCount() {
  const direccion = document.getElementById('direccion');
  const counter = document.getElementById('direccion-count');
  
  counter.textContent = `${direccion.value.length}/300`;
}
```

**HTML esperado:**
```html
<textarea id="direccion" maxlength="300" placeholder="..."></textarea>
<span id="direccion-count">0/300</span>
```

Muestra el contador en tiempo real: "45/300", "120/300", etc.

### Método: handleSubmit(e)

```javascript
async handleSubmit(e) {
  e.preventDefault();

  if (!this.validarFormulario()) {
    alert('Por favor corrige los errores en el formulario');
    return;
  }

  const formData = {
    run: document.getElementById('run').value,
    nombre: document.getElementById('nombre').value,
    apellidos: document.getElementById('apellidos').value,
    email: document.getElementById('email').value,
    telefono: document.getElementById('telefono').value,
    fechaNacimiento: document.getElementById('fechaNacimiento').value,
    region: document.getElementById('region').value,
    comuna: document.getElementById('comuna').value,
    direccion: document.getElementById('direccion').value,
    rol: document.getElementById('rol').value,
    activo: document.getElementById('activo').checked,
    estado: document.getElementById('activo').checked ? 'activo' : 'inactivo'
  };

  try {
    let response;

    if (this.userId) {
      response = await this.api.actualizarUsuario(this.userId, formData);
    } else {
      response = await this.api.crearUsuario(formData);
    }

    if (response.success) {
      alert('Usuario guardado exitosamente');
      window.location.href = 'users.html';
    }
  } catch (error) {
    alert('Error al guardar el usuario');
  }
}
```

**Nota especial:**
Captura `activo` (checkbox) y lo convierte a `estado` (string):
```javascript
estado: document.getElementById('activo').checked ? 'activo' : 'inactivo'
```

---

## 📁 Estructura de Carpetas

```
frontend/
├── admin/                          # Panel de administración
│   ├── components/                 # Componentes reutilizables (futuro)
│   ├── css/
│   │   ├── dashboard.css           # Estilos del dashboard
│   │   ├── sidebar.css             # Estilos de la navegación
│   │   ├── products.css            # Estilos de página de productos
│   │   ├── users.css               # Estilos de página de usuarios
│   │   ├── product-form.css        # Estilos del formulario de productos
│   │   └── user-form.css           # Estilos del formulario de usuarios
│   ├── js/
│   │   ├── dashboard.js            # Controlador del dashboard
│   │   ├── products.js             # Controlador de listado de productos
│   │   ├── product-form.js         # Controlador del formulario de productos
│   │   ├── users.js                # Controlador de listado de usuarios
│   │   └── user-form.js            # Controlador del formulario de usuarios
│   ├── pages/
│   │   ├── dashboard.html          # Página principal del admin
│   │   ├── products.html           # Página de listado de productos
│   │   ├── product-form.html       # Formulario de crear/editar producto
│   │   ├── users.html              # Página de listado de usuarios
│   │   └── user-form.html          # Formulario de crear/editar usuario
│   ├── DOCUMENTACION.md            # Este archivo
│   └── index.html                  # Redirección a dashboard
│
├── api/                            # API Mock
│   ├── api.js                      # Clase APIClient
│   └── mockData/
│       ├── productos.json          # Datos mockeados de productos
│       └── usuarios.json           # Datos mockeados de usuarios
│
├── client/                         # Sitio público (no admin)
│   ├── pages/
│   ├── css/
│   └── js/
│
└── README.md                       # Documentación general
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

1. ✅ **Crear páginas de Productos y Usuarios completas** con listados totales
2. ✅ **Agregar búsqueda y filtros** en las tablas
3. ✅ **Crear formularios** para crear/editar productos y usuarios
4. ⏳ **Agregar autenticación** para el panel admin
5. ⏳ **Agregar validación en backend** cuando se implemente la API real
6. ⏳ **Conectar a un backend real** (reemplazar JSON con API real)
7. ⏳ **Crear reportes y estadísticas** más avanzadas
8. ⏳ **Agregar carga de imágenes** en formularios

---

## 🎯 Resumen de Funcionalidades Implementadas

### ✅ Dashboard (dashboard.html + dashboard.js)
- Muestra estadísticas: total de productos, usuarios, pedidos
- Tabla de últimos 5 productos con estado de stock
- Tabla de últimos 5 usuarios con rol y estado
- Auto-refresco cada 30 segundos
- Botones "Ver todos" que redirigen a páginas completas

### ✅ Gestión de Productos (products.html + product-form.html)
**Listado (products.js):**
- Tabla completa con 10 productos por página
- Búsqueda en tiempo real (nombre o SKU)
- Filtro por categoría
- Filtro por estado de stock (En Stock / Bajo Stock / Sin Stock)
- Paginación con botones Anterior/Siguiente
- Botones Editar/Eliminar en cada fila
- Contador de total de productos filtrados

**Formulario (product-form.js):**
- Modo crear (formulario vacío) y modo editar (pre-llena datos)
- Campos: código, nombre, categoría, descripción, precio, stock, stock crítico, imagen, activo
- Validaciones en tiempo real:
  - Código: 3-50 caracteres requerido
  - Nombre: máximo 100 caracteres requerido
  - Precio: número positivo requerido
  - Stock: número entero positivo requerido
- Contador de caracteres en descripción (0/500)
- Mensajes de error debajo de cada campo
- Redirección a lista tras guardar

### ✅ Gestión de Usuarios (users.html + user-form.html)
**Listado (users.js):**
- Tabla completa con 10 usuarios por página
- Búsqueda en 3 campos: nombre completo, email, RUN
- Filtro por rol (Administrador / Vendedor / Cliente) con colores distintivos
- Filtro por estado (Activo / Inactivo)
- Paginación completa
- Botones Editar/Eliminar
- Contador de total de usuarios

**Formulario (user-form.js):**
- Modo crear y modo editar
- Campos organizados en secciones:
  - Información Personal: RUN, nombre, apellidos, fecha de nacimiento
  - Contacto: email, teléfono
  - Ubicación: región, comuna, dirección
  - Rol: dropdown para asignar tipo de usuario
  - Estado: checkbox para activo/inactivo
- Validaciones complejas:
  - **RUN**: Regex `/^\d{7,9}$/` (solo dígitos, 7-9 caracteres)
  - **Email**: Whitelist de dominios permitidos (duoc.cl, profesor.duoc.cl, gmail.com)
  - **Longitudes** máximas en todos los campos
  - **Requeridos**: Los campos que deben completarse
- Contador de caracteres en dirección (0/300)
- Validación en tiempo real con feedback visual

### ✅ API Mock (api.js)
- 12 métodos para gestionar productos y usuarios
- Simulación de latencia (500ms)
- Método especial getEstadisticas() que calcula totales
- Detección automática de rutas según ubicación del archivo
- Estructura lista para migración a backend real

### ✅ Datos Mock (JSON)
- 10 productos con campos realistas
- 10 usuarios con todos los campos incluyendo RUN, región, comuna
- Estructura de respuesta API estándar (success, data, total, timestamp)

---

## 🔗 Conexión entre archivos

```
dashboard.html
  └─ dashboard.js (DashboardController)
      └─ api.js (APIClient)
          └─ mockData/productos.json
          └─ mockData/usuarios.json

products.html
  └─ products.js (ProductsController)
      └─ api.js (APIClient)
          └─ mockData/productos.json

product-form.html
  └─ product-form.js (ProductFormController)
      └─ api.js (APIClient)
          └─ mockData/productos.json

users.html
  └─ users.js (UsersController)
      └─ api.js (APIClient)
          └─ mockData/usuarios.json

user-form.html
  └─ user-form.js (UserFormController)
      └─ api.js (APIClient)
          └─ mockData/usuarios.json
```

---

## 🔧 Troubleshooting

### "Productos no carga" o "Usuarios no carga"
**Problema:** Los datos no aparecen en la tabla
**Solución:**
1. Abre DevTools (F12)
2. Ve a Console
3. Busca errores de red (CORS, 404)
4. Verifica que los archivos JSON existan en `/api/mockData/`

### "El formulario no valida campos"
**Problema:** No aparecen los mensajes de error
**Solución:**
1. Verifica que existan elementos con ID `error-{fieldName}`
2. Comprueba la consola para ver si hay errores de JavaScript
3. Asegúrate de que el campo tenga el atributo `id` correcto

### "Error al crear/editar"
**Problema:** El API retorna error
**Solución:**
1. Abre consola y ve el objeto de respuesta
2. Verifica que el formData tenga todos los campos requeridos
3. Comprueba que los tipos de datos sean correctos (números, booleans)

### "RUN no valida correctamente"
**Problema:** La validación de RUN falla
**Solución:**
1. Asegúrate de que sea solo números: `12345678` ✅ no `12.345.678` ❌
2. Que tenga 7-9 dígitos
3. Abre consola y prueba: `/^\d{7,9}$/.test('12345678')` → debe ser true

### "Email rechaza dominios válidos"
**Problema:** No acepta emails que deberían ser válidos
**Solución:**
1. Verifica que el dominio esté en la lista: `duoc.cl`, `profesor.duoc.cl`, `gmail.com`
2. Los dominios son case-insensitive (la i en el regex)
3. Prueba en consola: `/^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i.test('usuario@duoc.cl')`


