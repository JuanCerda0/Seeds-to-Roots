# 🌱 Seed to Roots

## Descripción

**Seed to Roots** es una plataforma de e-commerce especializada en la venta de productos orgánicos frescos y de alta calidad. La aplicación permite a los usuarios explorar un catálogo de productos orgánicos, gestionar un carrito de compras, y a los administradores gestionar inventario y usuarios a través de un panel administrativo completo.

## 🚀 Características Principales

### Para Usuarios
- 🛒 **Carrito de Compras**: Sistema completo de gestión de carrito con persistencia
- 🥬 **Catálogo de Productos**: Navegación intuitiva por productos orgánicos
- 👤 **Autenticación**: Sistema de registro e inicio de sesión de usuarios
- 📱 **Diseño Responsive**: Interfaz adaptable a todos los dispositivos
- 📝 **Blog**: Sección informativa sobre productos y agricultura orgánica

### Para Administradores
- 📊 **Dashboard**: Panel de control con estadísticas y métricas
- 🎯 **Gestión de Productos**: CRUD completo de productos
- 👥 **Gestión de Usuarios**: Administración de cuentas de usuario
- 📈 **Estadísticas**: Visualización de ventas y métricas del negocio

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18.3.1** - Biblioteca de JavaScript para interfaces de usuario
- **React Router DOM 7.1.3** - Navegación y enrutamiento
- **Vite 6.0.5** - Bundler y herramienta de desarrollo

### Backend
- **Spring Boot** - Framework de Java para el backend

### Herramientas de Desarrollo
- **ESLint 9.17.0** - Linter para mantener calidad de código
- **PostCSS 8.4.49** - Procesamiento de CSS
- **Axios 1.7.9** - Cliente HTTP para peticiones API

### Validación
- **Zod 3.24.1** - Validación de esquemas TypeScript-first

## 📋 Prerequisitos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js** (versión 14 o superior)
- **npm** o **yarn**
- **Java JDK** (para el backend con Spring)
- **Git**

## 🔧 Instalación

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd seed-to-roots
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=Seed to Roots
```

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

## 📁 Estructura del Proyecto

```
seed-to-roots/
├── public/                  # Archivos públicos estáticos
├── src/
│   ├── assets/             # Recursos (imágenes, iconos)
│   │   └── img/           # Imágenes de productos
│   ├── components/         # Componentes reutilizables
│   │   ├── admin/         # Componentes del panel admin
│   │   └── css/           # Estilos de componentes
│   ├── context/           # Context API de React
│   │   ├── CartContext.jsx
│   │   └── useCart.js
│   ├── pages/             # Páginas principales
│   │   ├── admin/         # Páginas de administración
│   │   ├── Blog.jsx
│   │   ├── Carrito.jsx
│   │   ├── Home.jsx
│   │   ├── Log-in.jsx
│   │   ├── Productos.jsx
│   │   └── Sign-in.jsx
│   └── services/          # Servicios de API
│       ├── api.js
│       ├── authService.js
│       ├── carritoService.js
│       ├── productoService.js
│       └── userService.js
├── .env.local             # Variables de entorno
├── index.html             # HTML principal
├── package.json           # Dependencias y scripts
└── vite.config.js         # Configuración de Vite
```

## 🎯 Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Inicia servidor de desarrollo

# Producción
npm run build           # Construye la aplicación para producción
npm run preview         # Previsualiza la build de producción

# Calidad de código
npm run lint            # Ejecuta ESLint
```

## 🔐 Autenticación y Rutas Protegidas

La aplicación implementa un sistema de autenticación con rutas protegidas:

- **Rutas Públicas**: Home, Productos, Blog, Login, Sign-in
- **Rutas Protegidas**: Carrito (requiere autenticación)
- **Rutas Admin**: Dashboard, Gestión de Productos, Gestión de Usuarios (requiere rol admin)

## 🛡️ Componente ProtectedRoute

```jsx
// Ejemplo de uso
<Route 
  path="/carrito" 
  element={
    <ProtectedRoute>
      <Carrito />
    </ProtectedRoute>
  } 
/>
```

## 🎨 Estilos y Diseño

El proyecto utiliza:
- **CSS Modules** para estilos encapsulados
- **CSS Global** para estilos compartidos
- Paleta de colores personalizada definida en `paletaFuentes.css`
- Diseño responsive con media queries

## 📦 Productos Disponibles

El catálogo incluye productos orgánicos como:
1. Tomate Cherry
2. Lechuga Romana
3. Brócoli Orgánico
4. Zanahoria
5. Espinaca Fresca
6. Pimiento Rojo
7. Cebolla Blanca
8. Ajo Fresco
9. Rúcula
10. Pepino Inglés

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add: nueva característica'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Convenciones de Código

- Utilizar **camelCase** para variables y funciones
- Utilizar **PascalCase** para componentes React
- Seguir las reglas de ESLint configuradas
- Comentar código complejo
- Mantener componentes pequeños y reutilizables

## 🐛 Reporte de Bugs

Si encuentras un bug, por favor abre un issue incluyendo:
- Descripción del problema
- Pasos para reproducirlo
- Comportamiento esperado vs actual
- Screenshots si es posible
- Información del navegador/entorno

## 📄 Licencia

Este proyecto está bajo la licencia [MIT](LICENSE)

## 👥 Autores

- **Tu Nombre** - *Desarrollo inicial*

## 🙏 Agradecimientos

- Equipo de React por la excelente documentación
- Comunidad de código abierto
- Contributors del proyecto

---

⭐ **¡Si te gusta el proyecto, dale una estrella!** ⭐

💚 **Seed to Roots - De la semilla a las raíces, productos orgánicos de calidad** 💚
