/**
 * User Form Controller
 * Controla la lógica del formulario de usuarios
 */

class UserFormController {
  constructor() {
    this.api = new APIClient();
    this.userId = this.getUserIdFromURL();
    this.validationRules = {
      run: {
        required: true,
        minLength: 7,
        maxLength: 9,
        regex: /^\d{7,9}$/,
        message: 'El RUN debe tener 7 a 9 dígitos sin puntos ni guion'
      },
      nombre: {
        required: true,
        maxLength: 50,
        message: 'El nombre es requerido y máximo 50 caracteres'
      },
      apellidos: {
        required: true,
        maxLength: 100,
        message: 'Los apellidos son requeridos y máximo 100 caracteres'
      },
      email: {
        required: true,
        maxLength: 100,
        regex: /^[^\s@]+@(duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i,
        message: 'Email inválido. Dominios permitidos: @duoc.cl, @profesor.duoc.cl, @gmail.com'
      },
      telefono: {
        required: false,
        message: 'Formato de teléfono inválido'
      },
      fechaNacimiento: {
        required: false,
        message: 'Fecha de nacimiento inválida'
      },
      region: {
        required: true,
        message: 'La región es requerida'
      },
      comuna: {
        required: true,
        maxLength: 50,
        message: 'La comuna es requerida'
      },
      direccion: {
        required: true,
        maxLength: 300,
        message: 'La dirección es requerida y máximo 300 caracteres'
      },
      rol: {
        required: true,
        message: 'El tipo de usuario es requerido'
      }
    };
    this.init();
  }

  /**
   * Inicializa el controlador
   */
  async init() {
    try {
      this.setupFormListeners();

      if (this.userId) {
        // Modo editar
        await this.cargarUsuario();
      } else {
        // Modo crear
        document.getElementById('page-title').textContent = 'Nuevo Usuario';
      }

      console.log('User Form Controller cargado');
    } catch (error) {
      console.error('Error al inicializar User Form:', error);
    }
  }

  /**
   * Obtiene el ID del usuario desde la URL
   */
  getUserIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') ? parseInt(params.get('id')) : null;
  }

  /**
   * Carga el usuario para edición
   */
  async cargarUsuario() {
    try {
      const response = await this.api.getUsuarioById(this.userId);

      if (!response.success || !response.data) {
        alert('Usuario no encontrado');
        window.location.href = 'users.html';
        return;
      }

      const usuario = response.data;
      document.getElementById('page-title').textContent = `Editar: ${usuario.nombre} ${usuario.apellidos}`;

      // Llenar formulario
      document.getElementById('run').value = usuario.run;
      document.getElementById('nombre').value = usuario.nombre;
      document.getElementById('apellidos').value = usuario.apellidos;
      document.getElementById('email').value = usuario.email;
      document.getElementById('telefono').value = usuario.telefono || '';
      document.getElementById('fechaNacimiento').value = usuario.fechaNacimiento || '';
      document.getElementById('region').value = usuario.region;
      document.getElementById('comuna').value = usuario.comuna;
      document.getElementById('direccion').value = usuario.direccion;
      document.getElementById('rol').value = usuario.rol;
      document.getElementById('activo').checked = usuario.activo;

      // Actualizar botón
      document.getElementById('btn-submit').textContent = 'Actualizar Usuario';

      // Actualizar contador de dirección
      this.updateDireccionCount();
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      alert('Error al cargar el usuario');
      window.location.href = 'users.html';
    }
  }

  /**
   * Configura los event listeners del formulario
   */
  setupFormListeners() {
    const form = document.getElementById('user-form');
    const direccion = document.getElementById('direccion');

    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    if (direccion) {
      direccion.addEventListener('input', () => this.updateDireccionCount());
    }

    // Validación en tiempo real
    Object.keys(this.validationRules).forEach(fieldName => {
      const field = document.getElementById(fieldName);
      if (field) {
        field.addEventListener('blur', () => this.validarCampo(fieldName));
        field.addEventListener('input', () => this.limpiarError(fieldName));
      }
    });
  }

  /**
   * Actualiza el contador de caracteres de dirección
   */
  updateDireccionCount() {
    const direccion = document.getElementById('direccion');
    const counter = document.getElementById('direccion-count');
    if (counter) {
      counter.textContent = `${direccion.value.length}/300`;
    }
  }

  /**
   * Valida un campo específico
   */
  validarCampo(fieldName) {
    const field = document.getElementById(fieldName);
    const rules = this.validationRules[fieldName];

    if (!field || !rules) return true;

    const value = field.value.trim();
    const errorElement = document.getElementById(`error-${fieldName}`);

    // Requerido
    if (rules.required && !value) {
      this.mostrarError(fieldName, 'Este campo es requerido');
      return false;
    }

    if (!value && !rules.required) {
      this.limpiarError(fieldName);
      return true;
    }

    // Longitud mínima
    if (rules.minLength && value.length < rules.minLength) {
      this.mostrarError(fieldName, `Mínimo ${rules.minLength} caracteres`);
      return false;
    }

    // Longitud máxima
    if (rules.maxLength && value.length > rules.maxLength) {
      this.mostrarError(fieldName, `Máximo ${rules.maxLength} caracteres`);
      return false;
    }

    // Regex
    if (rules.regex && !rules.regex.test(value)) {
      this.mostrarError(fieldName, rules.message);
      return false;
    }

    this.limpiarError(fieldName);
    return true;
  }

  /**
   * Valida todo el formulario
   */
  validarFormulario() {
    let isValid = true;

    Object.keys(this.validationRules).forEach(fieldName => {
      if (!this.validarCampo(fieldName)) {
        isValid = false;
      }
    });

    return isValid;
  }

  /**
   * Muestra un error en un campo
   */
  mostrarError(fieldName, mensaje) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`error-${fieldName}`);

    if (field) {
      field.parentElement.classList.add('error');
    }

    if (errorElement) {
      errorElement.textContent = mensaje;
      errorElement.classList.add('show');
    }
  }

  /**
   * Limpia el error de un campo
   */
  limpiarError(fieldName) {
    const field = document.getElementById(fieldName);
    const errorElement = document.getElementById(`error-${fieldName}`);

    if (field) {
      field.parentElement.classList.remove('error');
    }

    if (errorElement) {
      errorElement.textContent = '';
      errorElement.classList.remove('show');
    }
  }

  /**
   * Maneja el envío del formulario
   */
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
        // Actualizar
        response = await this.api.actualizarUsuario(this.userId, formData);
      } else {
        // Crear
        response = await this.api.crearUsuario(formData);
      }

      if (response.success) {
        alert(response.message || 'Usuario guardado exitosamente');
        window.location.href = 'users.html';
      } else {
        alert('Error al guardar el usuario');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el usuario');
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.userFormController = new UserFormController();
});
