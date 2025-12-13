/**
 * Users Controller
 * Controla la lógica de la página de usuarios
 */

class UsersController {
  constructor() {
    // Asegurar que APIClient esté disponible
    if (typeof APIClient === 'undefined') {
      console.error('APIClient no está cargado. Incluye APIClient.js antes de este script.');
      return;
    }
    
    this.api = new APIClient();
    this.currentPage = 1;
    this.itemsPerPage = 10;
    this.allUsers = [];
    this.filteredUsers = [];
    this.editingUserId = null;
    this.init();
  }

  /**
   * Inicializa el controlador
   */
  async init() {
    try {
      await this.cargarUsuarios();
      this.setupEventListeners();
      this.setupFilterListeners();
      console.log('Users Controller cargado exitosamente');
    } catch (error) {
      console.error('Error al inicializar Users Controller:', error);
    }
  }

  /**
   * Carga todos los usuarios
   */
  async cargarUsuarios() {
    try {
      const response = await this.api.getUsuarios({ limit: 1000 });

      if (!response.success) {
        throw new Error(response.error || 'No se pudieron cargar los usuarios');
      }

      // Normalizar respuesta - puede venir como array directo o en response.data
      this.allUsers = Array.isArray(response.data) ? response.data : (response.data.data || []);
      this.filteredUsers = [...this.allUsers];
      this.currentPage = 1;
      this.mostrarUsuarios();
      this.actualizarContador();
      console.log('Usuarios cargados:', this.allUsers);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      alert('Error al cargar los usuarios');
    }
  }

  /**
   * Muestra los usuarios en la tabla con paginación
   */
  mostrarUsuarios() {
    const tbody = document.getElementById('usuarios-tbody');
    tbody.innerHTML = '';

    if (this.filteredUsers.length === 0) {
      tbody.innerHTML = '<tr><td colspan="8" class="text-center">No hay usuarios</td></tr>';
      this.actualizarPaginacion();
      return;
    }

    const inicio = (this.currentPage - 1) * this.itemsPerPage;
    const fin = inicio + this.itemsPerPage;
    const usuariosEnPagina = this.filteredUsers.slice(inicio, fin);

    usuariosEnPagina.forEach(usuario => {
      const row = document.createElement('tr');
      const rolClass = this.getRolClass(usuario.rol);
      const statusClass = usuario.estado === 'activo' ? 'badge-success' : 'badge-warning';
      const statusText = usuario.estado.charAt(0).toUpperCase() + usuario.estado.slice(1);
      const nombreCompleto = `${usuario.nombre} ${usuario.apellidos}`;

      row.innerHTML = `
        <td>${usuario.id}</td>
        <td><strong>${usuario.run}</strong></td>
        <td>${nombreCompleto}</td>
        <td>${usuario.email}</td>
        <td><span class="role-badge ${rolClass}">${this.getDisplayRol(usuario.rol)}</span></td>
        <td><span class="badge ${statusClass}">${statusText}</span></td>
        <td>${usuario.region}</td>
        <td>
          <div class="user-actions">
            <button class="btn-edit btn-small" data-id="${usuario.id}" onclick="window.usersController.abrirFormulario(${usuario.id})">
              ✏️ Editar
            </button>
            <button class="btn-delete btn-small" data-id="${usuario.id}" onclick="window.usersController.eliminarUsuario(${usuario.id})">
              🗑️ Eliminar
            </button>
          </div>
        </td>
      `;
      tbody.appendChild(row);
    });

    this.actualizarPaginacion();
  }

  /**
   * Actualiza el contador de usuarios
   */
  actualizarContador() {
    const contador = document.getElementById('user-count');
    if (contador) {
      contador.textContent = `${this.filteredUsers.length} usuario${this.filteredUsers.length !== 1 ? 's' : ''}`;
    }
  }

  /**
   * Actualiza los botones de paginación
   */
  actualizarPaginacion() {
    const totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');
    const paginationInfo = document.getElementById('pagination-info');

    if (totalPages === 0) {
      btnPrev.disabled = true;
      btnNext.disabled = true;
      paginationInfo.textContent = 'Sin datos';
      return;
    }

    btnPrev.disabled = this.currentPage === 1;
    btnNext.disabled = this.currentPage === totalPages;
    paginationInfo.textContent = `Página ${this.currentPage} de ${totalPages}`;
  }

  /**
   * Configura los event listeners
   */
  setupEventListeners() {
    const btnCrearUsuario = document.getElementById('btn-crear-usuario');
    const btnPrev = document.getElementById('btn-prev');
    const btnNext = document.getElementById('btn-next');

    if (btnCrearUsuario) {
      btnCrearUsuario.addEventListener('click', () => {
        this.abrirFormulario(null);
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (this.currentPage > 1) {
          this.currentPage--;
          this.mostrarUsuarios();
        }
      });
    }

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        const totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
        if (this.currentPage < totalPages) {
          this.currentPage++;
          this.mostrarUsuarios();
        }
      });
    }
  }

  /**
   * Configura los filtros
   */
  setupFilterListeners() {
    const searchInput = document.getElementById('search-input');
    const rolFilter = document.getElementById('rol-filter');
    const statusFilter = document.getElementById('status-filter');

    if (searchInput) {
      searchInput.addEventListener('input', () => this.aplicarFiltros());
    }

    if (rolFilter) {
      rolFilter.addEventListener('change', () => this.aplicarFiltros());
    }

    if (statusFilter) {
      statusFilter.addEventListener('change', () => this.aplicarFiltros());
    }
  }

  /**
   * Aplica todos los filtros
   */
  aplicarFiltros() {
    const searchValue = document.getElementById('search-input').value.toLowerCase();
    const rolValue = document.getElementById('rol-filter').value;
    const statusValue = document.getElementById('status-filter').value;

    this.filteredUsers = this.allUsers.filter(usuario => {
      // Filtro de búsqueda
      const nombreCompleto = `${usuario.nombre} ${usuario.apellidos}`.toLowerCase();
      const matchBusqueda = 
        nombreCompleto.includes(searchValue) ||
        usuario.email.toLowerCase().includes(searchValue) ||
        usuario.run.includes(searchValue);

      if (!matchBusqueda) return false;

      // Filtro de rol
      if (rolValue && usuario.rol !== rolValue) {
        return false;
      }

      // Filtro de estado
      if (statusValue && usuario.estado !== statusValue) {
        return false;
      }

      return true;
    });

    this.currentPage = 1;
    this.mostrarUsuarios();
    this.actualizarContador();
  }

  /**
   * Abre el formulario para crear o editar
   */
  abrirFormulario(usuarioId) {
    this.editingUserId = usuarioId;

    if (usuarioId) {
      // Editar usuario
      const usuario = this.allUsers.find(u => u.id === usuarioId);
      if (usuario) {
        window.location.href = `user-form.html?id=${usuarioId}`;
      }
    } else {
      // Crear nuevo
      window.location.href = 'user-form.html';
    }
  /**
   * Elimina un usuario
   */
  async eliminarUsuario(usuarioId) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        const response = await this.api.eliminarUsuario(usuarioId);

        if (response.success) {
          alert('Usuario eliminado exitosamente');
          await this.cargarUsuarios();
        } else {
          alert(response.error || 'Error al eliminar el usuario');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error al eliminar el usuario');
      }
    }
  }   }
    }
  }

  /**
   * Obtiene la clase CSS según el rol
   */
  getRolClass(rol) {
    switch (rol) {
      case 'admin':
        return 'role-admin';
      case 'vendedor':
        return 'role-vendedor';
      case 'cliente':
        return 'role-cliente';
      default:
        return '';
    }
  }

  /**
   * Obtiene el texto a mostrar del rol
   */
  getDisplayRol(rol) {
    switch (rol) {
      case 'admin':
        return 'Administrador';
      case 'vendedor':
        return 'Vendedor';
      case 'cliente':
        return 'Cliente';
      default:
        return rol;
    }
  }
}

// Inicializar controlador cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.usersController = new UsersController();
});
