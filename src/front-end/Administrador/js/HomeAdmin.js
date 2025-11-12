// Variables para almacenar datos de la BD
let usuariosData = [];
let productosData = [];

// Configuración base de la API
const API_BASE_URL = 'http://localhost:5500/api';

// Función para cargar usuarios desde la BD
async function cargarUsuarios() {
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        usuariosData = await response.json();
        mostrarUsuarios();
    } catch (error) {
        console.error('Error al cargar usuarios:', error);
        mostrarErrorUsuarios('Error al cargar usuarios. Intenta más tarde.');
    }
}

// Función para cargar productos desde la BD
async function cargarProductos() {
    try {
        const response = await fetch(`${API_BASE_URL}/productos`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        productosData = await response.json();
        mostrarProductos();
    } catch (error) {
        console.error('Error al cargar productos:', error);
        mostrarErrorProductos('Error al cargar productos. Intenta más tarde.');
    }
}

// Función para mostrar usuarios en la tabla
function mostrarUsuarios() {
    const tbody = document.getElementById('usuarios-tbody');
    
    if (usuariosData.length === 0) {
        tbody.innerHTML = '<tr class="placeholder"><td colspan="7" class="text-center">No hay usuarios registrados</td></tr>';
        return;
    }
    
    tbody.innerHTML = usuariosData.map(usuario => `
        <tr>
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.email}</td>
            <td>${usuario.telefono || 'N/A'}</td>
            <td>${formatearFecha(usuario.fecha_registro)}</td>
            <td>
                <span class="status-badge status-${usuario.estado}">
                    ${usuario.estado === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-secondary btn-small" onclick="editarUsuario(${usuario.id})">Editar</button>
                    <button class="btn btn-danger btn-small" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Función para mostrar productos en la tabla
function mostrarProductos() {
    const tbody = document.getElementById('productos-tbody');
    
    if (productosData.length === 0) {
        tbody.innerHTML = '<tr class="placeholder"><td colspan="8" class="text-center">No hay productos registrados</td></tr>';
        return;
    }
    
    tbody.innerHTML = productosData.map(producto => `
        <tr>
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.categoria}</td>
            <td>$${formatearPrecio(producto.precio)}</td>
            <td>${producto.stock}</td>
            <td>${formatearFecha(producto.fecha_creacion)}</td>
            <td>
                <span class="status-badge status-${producto.estado}">
                    ${producto.estado === 'activo' ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-secondary btn-small" onclick="editarProducto(${producto.id})">Editar</button>
                    <button class="btn btn-danger btn-small" onclick="eliminarProducto(${producto.id})">Eliminar</button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Función auxiliar para formatear fechas
function formatearFecha(fecha) {
    if (!fecha) return 'N/A';
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES');
}

// Función auxiliar para formatear precios
function formatearPrecio(precio) {
    return precio.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Función para mostrar error en tabla de usuarios
function mostrarErrorUsuarios(mensaje) {
    const tbody = document.getElementById('usuarios-tbody');
    tbody.innerHTML = `<tr class="placeholder"><td colspan="7" class="text-center" style="color: #e74c3c;">${mensaje}</td></tr>`;
}

// Función para mostrar error en tabla de productos
function mostrarErrorProductos(mensaje) {
    const tbody = document.getElementById('productos-tbody');
    tbody.innerHTML = `<tr class="placeholder"><td colspan="8" class="text-center" style="color: #e74c3c;">${mensaje}</td></tr>`;
}

// Funciones de edición y eliminación
function editarUsuario(id) {
    window.location.href = `pages/editarUsuario.html?id=${id}`;
}

function eliminarUsuario(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        // Redirigir a la página de edición para que se muestre el modal de confirmación
        window.location.href = `pages/editarUsuario.html?id=${id}&eliminar=true`;
    }
}

function editarProducto(id) {
    console.log('Editar producto:', id);
    // TODO: Implementar página de edición de productos
}

function eliminarProducto(id) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        console.log('Eliminar producto:', id);
        // TODO: Implementar lógica de eliminación de productos
    }
}

// Toggle del menú en dispositivos móviles
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Cerrar sidebar al hacer clic en un enlace
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            sidebar.classList.remove('active');
        });
    });
    
    // Cargar datos al iniciar
    cargarUsuarios();
    cargarProductos();
});