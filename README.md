<<<<<<< HEAD
# 🎌 Waifu-Farm

**Una plataforma completa de ecommerce para comercializar productos de anime y manga.**

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)
![Status](https://img.shields.io/badge/status-en%20desarrollo-yellow)

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Características](#características)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Uso](#uso)
- [Arquitectura](#arquitectura)
- [Documentación](#documentación)
- [Tecnologías](#tecnologías)
- [Próximas Mejoras](#próximas-mejoras)
- [Contribuciones](#contribuciones)

## 📝 Descripción General

**Waifu-Farm** es una aplicación web de ecommerce desarrollada con un arquitectura moderna separada en frontend y backend. Permite a los administradores gestionar usuarios y productos, mientras ofrece una plataforma para comprar artículos relacionados con anime y manga.

### Objetivos
- ✅ Gestión completa de usuarios (CRUD)
- ✅ Gestión completa de productos (CRUD)
- ✅ Panel de administración intuitivo
- ✅ API REST escalable
- ✅ Experiencia responsive
- 🚀 Integración de pagos (Próximo)
- 🚀 Sistema de carrito de compras (Próximo)
- 🚀 Autenticación y autorización (Próximo)

## ✨ Características

### Panel de Administración
- 📊 **Dashboard** - Vista general del sistema
- 👥 **Gestión de Usuarios** - Crear, editar, eliminar usuarios
- 📦 **Gestión de Productos** - Crear, editar, eliminar productos
- 📱 **Diseño Responsive** - Funciona en todas las plataformas

### Frontend
- 🎨 Interfaz moderna y limpia
- 📱 Diseño completamente responsive
- ⚡ JavaScript vanilla (sin dependencias)
- 🎯 Validaciones en cliente
- 💬 Mensajes de error/éxito intuitivos

### Backend
- 🔌 API REST completa
- 🗄️ Integración con Oracle Database
- ✅ Validaciones en servidor
- 🔄 Manejo de transacciones
- 📝 Documentación completa

## 📁 Estructura del Proyecto

```
Waifu-Farm/
├── README.md                    # Este archivo
├── src/
│   ├── backend/
│   │   ├── db.js               # Configuración de BD
│   │   ├── index.js            # Punto de entrada del servidor
│   │   ├── package.json        # Dependencias
│   │   ├── README.md           # Documentación del backend
│   │   ├── controllers/
│   │   │   ├── usuariosController.js
│   │   │   └── productosController.js
│   │   └── routes/
│   │       ├── usuarios.js
│   │       └── productos.js
│   │
│   └── frontend/
│       ├── index.html          # Página principal
│       ├── README.md           # Documentación del frontend
│       ├── Administrador/
│       │   ├── css/
│       │   │   ├── HomeAdmin.css
│       │   │   └── formularioUsuario.css
│       │   ├── js/
│       │   │   ├── HomeAdmin.js
│       │   │   └── formularioUsuario.js
│       │   └── pages/
│       │       ├── HomeAdmin.html
│       │       ├── crearUsuario.html
│       │       └── editarUsuario.html
│       ├── css/
│       │   ├── style.css       # Estilos principales
│       │   ├── login.css
│       │   ├── productos.css
│       │   ├── blog.css
│       │   ├── contacto.css
│       │   ├── nosotros.css
│       │   └── signin.css
│       ├── js/
│       │   ├── main.js
│       │   ├── login.js
│       │   ├── signin.js
│       │   ├── blog.js
│       │   └── test.js
│       ├── img/                # Imágenes del sitio
│       └── pages/
│           ├── login.html
│           ├── signin.html
│           ├── productos.html
│           ├── blog.html
│           ├── contacto.html
│           ├── nosotros.html
│           └── test.html
│
└── .gitignore                  # Configuración de Git
```

## 🔧 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (v14 o superior)
- **npm** (v6 o superior)
- **Oracle Database** (v12c o superior)
- Un navegador moderno (Chrome, Firefox, Safari, Edge)

### Verificar Instalaciones

```bash
# Verificar Node.js
node --version

# Verificar npm
npm --version

# Verificar Oracle (opcional, necesario para desarrollo)
sqlplus -version
```

## 📥 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/JuanCerda0/Waifu-Farm.git
cd Waifu-Farm
```

### 2. Configurar el Backend

```bash
# Navegar a la carpeta del backend
cd src/back-end

# Instalar dependencias
npm install

# Verificar que se instalaron correctamente
npm list
```

**Dependencias del Backend:**
- `express` - Framework web
- `oracledb` - Cliente de Oracle Database

### 3. Configurar la Base de Datos

Edita el archivo `src/back-end/db.js` con tus credenciales:

```javascript
const connection = await oracledb.getConnection({
    user: "TU_USUARIO",
    password: "TU_PASSWORD",
    connectString: "TU_HOST:1521/TU_SID"
});
```

### 4. Crear las Tablas en la BD

Ejecuta en SQL*Plus:

```sql
-- Tabla de Usuarios
CREATE TABLE usuarios (
    id NUMBER PRIMARY KEY,
    nombre VARCHAR2(100) NOT NULL,
    email VARCHAR2(100) UNIQUE NOT NULL,
    telefono VARCHAR2(20),
    fecha_registro DATE,
    estado VARCHAR2(20) DEFAULT 'activo'
);

-- Tabla de Productos
CREATE TABLE productos (
    id NUMBER PRIMARY KEY,
    nombre VARCHAR2(100) NOT NULL,
    categoria VARCHAR2(50),
    precio NUMBER(10,2),
    stock NUMBER,
    fecha_creacion DATE,
    estado VARCHAR2(20) DEFAULT 'activo'
);

-- Crear secuencias para auto-increment
CREATE SEQUENCE usuarios_seq START WITH 1 INCREMENT BY 1;
CREATE SEQUENCE productos_seq START WITH 1 INCREMENT BY 1;
```

### 5. Configurar el Frontend

El frontend no requiere instalación de dependencias. Solo sirve los archivos estáticamente.

## 🚀 Uso

### Iniciar el Backend

```bash
cd src/back-end

# Iniciar el servidor
npm start

# El servidor escuchará en http://localhost:5500
```

Verás un mensaje como:
```
Servidor escuchando en el puerto 5500
Documentación disponible en http://localhost:5500/
```

### Acceder al Frontend

```
# Página principal
http://localhost:PUERTO/

# Panel de administración
http://localhost:PUERTO/Administrador/pages/HomeAdmin.html
```

### Endpoints de la API

#### Usuarios
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/usuarios` | Obtener todos los usuarios |
| GET | `/api/usuarios/:id` | Obtener un usuario por ID |
| POST | `/api/usuarios` | Crear un nuevo usuario |
| PUT | `/api/usuarios/:id` | Actualizar un usuario |
| DELETE | `/api/usuarios/:id` | Eliminar un usuario |

#### Productos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/productos` | Obtener todos los productos |
| GET | `/api/productos/:id` | Obtener un producto por ID |
| POST | `/api/productos` | Crear un nuevo producto |
| PUT | `/api/productos/:id` | Actualizar un producto |
| DELETE | `/api/productos/:id` | Eliminar un producto |

### Ejemplos de Uso

#### Crear Usuario

```bash
curl -X POST http://localhost:5500/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Pérez",
    "email": "juan@example.com",
    "telefono": "1234567890",
    "estado": "activo"
  }'
```

#### Obtener Usuarios

```bash
curl http://localhost:5500/api/usuarios
```

#### Actualizar Usuario

```bash
curl -X PUT http://localhost:5500/api/usuarios/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Carlos Pérez",
    "email": "juancarlos@example.com",
    "telefono": "9876543210",
    "estado": "activo"
  }'
```

#### Eliminar Usuario

```bash
curl -X DELETE http://localhost:5500/api/usuarios/1
```

## 🏗️ Arquitectura

### Arquitectura General

```
┌─────────────────────────────────────────────────────┐
│                   NAVEGADOR WEB                      │
│  (Frontend HTML/CSS/JS - Port 3000 o similar)      │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ HTTP/FETCH API
                   ↓
┌─────────────────────────────────────────────────────┐
│              SERVIDOR EXPRESS.JS                     │
│           (Backend - Port 5500)                      │
│  ┌──────────────────────────────────────────────┐  │
│  │  Routes (/api/usuarios, /api/productos)     │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │  Controllers (Lógica de negocio)            │  │
│  └──────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────┐  │
│  │  Database Adapter (db.js - OracleDB)        │  │
│  └──────────────────────────────────────────────┘  │
└──────────────────┬──────────────────────────────────┘
                   │
                   │ SQL
                   ↓
┌─────────────────────────────────────────────────────┐
│          ORACLE DATABASE (XEPDB1)                    │
│     (usuarios, productos tables)                    │
└─────────────────────────────────────────────────────┘
```

### Flujo de Datos

```
1. Usuario interactúa con Frontend
   ↓
2. Frontend hace fetch a la API
   ↓
3. Express.js recibe la petición en Routes
   ↓
4. Routes envía a Controller
   ↓
5. Controller hace lógica y llama a db.js
   ↓
6. db.js ejecuta SQL en Oracle
   ↓
7. Oracle devuelve datos
   ↓
8. Controller formatea respuesta
   ↓
9. Express devuelve JSON al Frontend
   ↓
10. Frontend actualiza la interfaz
```

### Patrón MVC

El proyecto sigue el patrón **Model-View-Controller**:

- **Views**: HTML/CSS/JS del frontend
- **Controllers**: `usuariosController.js`, `productosController.js`
- **Models**: Tablas en Oracle Database
- **Routes**: Mapeo de endpoints a controladores

## 📚 Documentación

### Documentación por Componente

#### 1. Backend
Ver: [`src/back-end/README.md`](src/back-end/README.md)

Incluye:
- Endpoints disponibles
- Estructura de base de datos
- Ejemplos de solicitudes
- Configuración de CORS

#### 2. Frontend
Ver: [`src/front-end/README.md`](src/front-end/README.md)

Incluye:
- Panel de administración
- Estructura de archivos
- Funciones JavaScript
- Validaciones
- Diseño responsive

### Documentación de Código

Cada archivo tiene comentarios explicativos:

```javascript
// Controllers - Incluyen:
// - Descripción de la función
// - Parámetros esperados
// - Manejo de errores
// - Respuestas

// JS Frontend - Incluye:
// - Variables globales documentadas
// - Funciones con propósito claro
// - Validaciones explicadas
```

## 💻 Tecnologías

### Frontend
- **HTML5** - Estructura
- **CSS3** - Estilos (Grid, Flexbox, Media Queries)
- **JavaScript ES6+** - Interactividad
- **Fetch API** - Comunicación con servidor

**Navegadores Soportados:**
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Backend
- **Node.js** - Runtime de JavaScript
- **Express.js 5.1.0** - Framework web
- **Oracle Database** - Base de datos
- **oracledb 6.9.0** - Driver de Oracle

### Herramientas
- **Git** - Control de versiones
- **npm** - Gestor de paquetes
- **SQL*Plus** - Cliente de Oracle

## 📊 Estado Actual

### ✅ Completado
- [x] Estructura base del proyecto
- [x] API REST para usuarios
- [x] API REST para productos
- [x] Panel de administración
- [x] Gestión de usuarios (CRUD)
- [x] Validaciones en cliente y servidor
- [x] Diseño responsive
- [x] Documentación completa

### 🚀 En Desarrollo
- [ ] Gestión de productos (CRUD)
- [ ] Página de productos para clientes
- [ ] Carrito de compras
- [ ] Sistema de pagos

### 📋 Próximas Mejoras

#### Corto Plazo
- [ ] Crear página de gestión de productos
- [ ] Implementar búsqueda y filtrado
- [ ] Agregar paginación a tablas
- [ ] Mejorar validaciones con librerías
- [ ] Agregar notificaciones toast

#### Mediano Plazo
- [ ] Implementar autenticación JWT
- [ ] Sistema de permisos y roles
- [ ] Agregar soporte para imágenes
- [ ] Exportación de datos (CSV/PDF)
- [ ] Tema oscuro/claro

#### Largo Plazo
- [ ] Carrito de compras funcional
- [ ] Integración de pagos (Stripe/PayPal)
- [ ] Sistema de reviews y ratings
- [ ] Recomendaciones de productos
- [ ] Chat en vivo
- [ ] Análisis y reportes

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para contribuir:

1. **Fork** el repositorio
2. **Crea** una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. **Push** a la rama (`git push origin feature/AmazingFeature`)
5. **Abre** un Pull Request

### Guía de Estilo

- Usa camelCase para variables y funciones
- Usa PascalCase para clases
- Agrega comentarios en código complejo
- Documenta funciones nuevas
- Sigue la estructura existente

## 📄 Licencia

Este proyecto está bajo la licencia **ISC**. Ver el archivo LICENSE para más detalles.

## 👤 Autor

**Juan Cerda**
- GitHub: [@JuanCerda0](https://github.com/JuanCerda0)

## 📞 Soporte

Si tienes preguntas o encuentras problemas:

1. Revisa la documentación en `README.md` de cada carpeta
2. Abre un **Issue** en GitHub
3. Revisa los comentarios en el código

## 🙏 Agradecimientos

- Gracias a Express.js por el framework
- Gracias a Oracle Database por la BD
- Gracias a la comunidad de JavaScript

---

**Última actualización:** Noviembre 12, 2025  
**Versión:** 1.0.0  
**Estado:** 🟡 En Desarrollo
=======
# HELLO WORLD!
>>>>>>> deployment
