# Backend - Waifu Farm

## Descripción
Backend de Waifu Farm construido con Express.js y Oracle Database. Proporciona APIs REST para gestionar usuarios y productos.

## Estructura del Proyecto

```
back-end/
├── index.js                          # Archivo principal del servidor
├── db.js                             # Configuración de conexión a BD
├── package.json                      # Dependencias del proyecto
├── controllers/
│   ├── usuariosController.js         # Lógica para gestión de usuarios
│   └── productosController.js        # Lógica para gestión de productos
└── routes/
    ├── usuarios.js                   # Rutas CRUD de usuarios
    └── productos.js                  # Rutas CRUD de productos
```

## Instalación

1. Instala las dependencias:
```bash
npm install
```

2. Verifica que los datos de conexión a la BD en `db.js` sean correctos.

3. Inicia el servidor:
```bash
npm start
```

El servidor se ejecutará en `http://localhost:5500`

## Endpoints Disponibles

### Usuarios

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/usuarios` | Obtener todos los usuarios |
| GET | `/api/usuarios/:id` | Obtener un usuario por ID |
| POST | `/api/usuarios` | Crear un nuevo usuario |
| PUT | `/api/usuarios/:id` | Actualizar un usuario |
| DELETE | `/api/usuarios/:id` | Eliminar un usuario |

**Ejemplo de datos para POST/PUT:**
```json
{
  "nombre": "Juan Pérez",
  "email": "juan@example.com",
  "telefono": "1234567890",
  "estado": "activo"
}
```

### Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos` | Obtener todos los productos |
| GET | `/api/productos/:id` | Obtener un producto por ID |
| POST | `/api/productos` | Crear un nuevo producto |
| PUT | `/api/productos/:id` | Actualizar un producto |
| DELETE | `/api/productos/:id` | Eliminar un producto |

**Ejemplo de datos para POST/PUT:**
```json
{
  "nombre": "Figura Anime",
  "categoria": "Figuras",
  "precio": 29.99,
  "stock": 50,
  "estado": "activo"
}
```

## Estructura de Base de Datos

### Tabla: usuarios
```sql
CREATE TABLE usuarios (
    id NUMBER PRIMARY KEY,
    nombre VARCHAR2(100) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    telefono VARCHAR2(20),
    fecha_registro DATE,
    estado VARCHAR2(20) DEFAULT 'activo'
);
```

### Tabla: productos
```sql
CREATE TABLE productos (
    id NUMBER PRIMARY KEY,
    nombre VARCHAR2(100) NOT NULL,
    categoria VARCHAR2(50),
    precio NUMBER(10,2),
    stock NUMBER,
    fecha_creacion DATE,
    estado VARCHAR2(20) DEFAULT 'activo'
);
```

## Configuración de CORS

Si el frontend está en un puerto diferente (como 3000 o 8000), descomenta el middleware de CORS en `index.js`:

```javascript
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});
```

## Notas Importantes

- Los controladores manejan automáticamente el commit/rollback de transacciones
- Las conexiones a la BD se cierran después de cada operación
- Se incluyen validaciones básicas en cada endpoint
- Los errores devuelven códigos HTTP apropiados

## Próximas Mejoras

- [ ] Agregar autenticación (JWT)
- [ ] Implementar validación de datos más robusta
- [ ] Agregar paginación en listados
- [ ] Agregar logs más detallados
- [ ] Implementar caché para mejorar rendimiento
