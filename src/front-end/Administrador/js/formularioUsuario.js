// Configuración de la API
const API_BASE_URL = 'http://localhost:5500/api';

// Variables globales
let usuarioId = null;
let esEdicion = false;

// Función para obtener parámetros de la URL
function obtenerParametroURL(nombre) {
    const params = new URLSearchParams(window.location.search);
    return params.get(nombre);
}

// Detectar si estamos en modo edición
document.addEventListener('DOMContentLoaded', function() {
    // Obtener ID de la URL
    const idDeURL = obtenerParametroURL('id');
    
    if (idDeURL) {
        esEdicion = true;
        usuarioId = idDeURL;
        cargarDatosUsuario();
    }

    // Configurar evento del formulario
    const formulario = document.getElementById('formularioUsuario');
    formulario.addEventListener('submit', manejarEnvioFormulario);

    // Toggle del menú en dispositivos móviles
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
});

// Función para cargar datos del usuario en modo edición
async function cargarDatosUsuario() {
    try {
        const response = await fetch(`${API_BASE_URL}/usuarios/${usuarioId}`);
        
        if (!response.ok) {
            throw new Error('Error al cargar el usuario');
        }

        const usuario = await response.json();
        
        // Llenar el formulario con los datos
        document.getElementById('nombre').value = usuario.nombre || '';
        document.getElementById('email').value = usuario.email || '';
        document.getElementById('telefono').value = usuario.telefono || '';
        document.getElementById('estado').value = usuario.estado || 'activo';

    } catch (error) {
        console.error('Error al cargar usuario:', error);
        mostrarError('Error al cargar los datos del usuario. Intenta de nuevo.');
    }
}

// Función para manejar el envío del formulario
async function manejarEnvioFormulario(event) {
    event.preventDefault();

    // Limpiar mensajes previos
    limpiarMensajes();

    // Validar formulario
    if (!validarFormulario()) {
        return;
    }

    // Obtener datos del formulario
    const datos = {
        nombre: document.getElementById('nombre').value.trim(),
        email: document.getElementById('email').value.trim(),
        telefono: document.getElementById('telefono').value.trim() || null,
        estado: document.getElementById('estado').value
    };

    try {
        let response;
        let mensaje;

        if (esEdicion) {
            // Actualizar usuario existente
            response = await fetch(`${API_BASE_URL}/usuarios/${usuarioId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });
            mensaje = 'Usuario actualizado exitosamente';
        } else {
            // Crear nuevo usuario
            response = await fetch(`${API_BASE_URL}/usuarios`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(datos)
            });
            mensaje = 'Usuario creado exitosamente';
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error en la operación');
        }

        // Mostrar mensaje de éxito
        mostrarExito(mensaje);

        // Redirigir después de 2 segundos
        setTimeout(() => {
            window.location.href = 'HomeAdmin.html';
        }, 2000);

    } catch (error) {
        console.error('Error:', error);
        mostrarError(error.message || 'Ocurrió un error. Intenta de nuevo.');
    }
}

// Función para validar el formulario
function validarFormulario() {
    let esValido = true;
    limpiarErrores();

    // Validar nombre
    const nombre = document.getElementById('nombre');
    if (!nombre.value.trim()) {
        mostrarErrorCampo('nombre', 'El nombre es requerido');
        esValido = false;
    } else if (nombre.value.trim().length < 3) {
        mostrarErrorCampo('nombre', 'El nombre debe tener al menos 3 caracteres');
        esValido = false;
    }

    // Validar email
    const email = document.getElementById('email');
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.value.trim()) {
        mostrarErrorCampo('email', 'El email es requerido');
        esValido = false;
    } else if (!regexEmail.test(email.value.trim())) {
        mostrarErrorCampo('email', 'El email no es válido');
        esValido = false;
    }

    // Validar teléfono (si se proporciona)
    const telefono = document.getElementById('telefono');
    if (telefono.value.trim() && telefono.value.trim().length < 7) {
        mostrarErrorCampo('telefono', 'El teléfono debe tener al menos 7 dígitos');
        esValido = false;
    }

    // Validar estado
    const estado = document.getElementById('estado');
    if (!estado.value) {
        mostrarErrorCampo('estado', 'Debes seleccionar un estado');
        esValido = false;
    }

    return esValido;
}

// Función para mostrar error en un campo específico
function mostrarErrorCampo(campo, mensaje) {
    const errorElement = document.getElementById(`error-${campo}`);
    if (errorElement) {
        errorElement.textContent = mensaje;
        errorElement.classList.add('show');
    }
}

// Función para limpiar errores de campos
function limpiarErrores() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(element => {
        element.textContent = '';
        element.classList.remove('show');
    });
}

// Función para mostrar mensaje de éxito
function mostrarExito(mensaje) {
    const div = document.getElementById('mensaje-exito');
    div.textContent = mensaje;
    div.classList.add('show');
}

// Función para mostrar mensaje de error
function mostrarError(mensaje) {
    const div = document.getElementById('mensaje-error');
    div.textContent = mensaje;
    div.classList.add('show');
}

// Función para limpiar mensajes
function limpiarMensajes() {
    document.getElementById('mensaje-exito').classList.remove('show');
    document.getElementById('mensaje-error').classList.remove('show');
}

// ===== Funciones para eliminación =====

// Mostrar modal de confirmación
function mostrarConfirmacionEliminar() {
    document.getElementById('modalEliminar').classList.add('show');
}

// Cerrar modal de confirmación
function cerrarModalEliminar() {
    document.getElementById('modalEliminar').classList.remove('show');
}

// Confirmar eliminación
async function confirmarEliminar() {
    try {
        cerrarModalEliminar();
        
        const response = await fetch(`${API_BASE_URL}/usuarios/${usuarioId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Error al eliminar el usuario');
        }

        mostrarExito('Usuario eliminado exitosamente');

        setTimeout(() => {
            window.location.href = 'HomeAdmin.html';
        }, 2000);

    } catch (error) {
        console.error('Error:', error);
        mostrarError(error.message || 'Ocurrió un error al eliminar el usuario');
    }
}

// Cerrar modal al hacer clic fuera de él
window.addEventListener('click', function(event) {
    const modal = document.getElementById('modalEliminar');
    if (modal && event.target === modal) {
        cerrarModalEliminar();
    }
});
