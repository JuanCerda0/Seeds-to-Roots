/**
 * Product Form Controller
 * Controla la lógica del formulario de productos
 */

class ProductFormController {
  constructor() {
    this.api = new APIClient();
    this.productId = this.getProductIdFromURL();
    this.validationRules = {
      sku: {
        required: true,
        minLength: 3,
        maxLength: 50,
        message: 'El código debe tener entre 3 y 50 caracteres'
      },
      nombre: {
        required: true,
        maxLength: 100,
        message: 'El nombre es requerido y máximo 100 caracteres'
      },
      categoria: {
        required: true,
        message: 'La categoría es requerida'
      },
      descripcion: {
        required: false,
        maxLength: 500,
        message: 'La descripción máximo 500 caracteres'
      },
      precio: {
        required: true,
        min: 0,
        message: 'El precio debe ser mayor o igual a 0'
      },
      stock: {
        required: true,
        min: 0,
        isInteger: true,
        message: 'El stock debe ser un número entero mayor o igual a 0'
      },
      stockCritico: {
        required: false,
        min: 0,
        isInteger: true,
        message: 'El stock crítico debe ser un número entero mayor o igual a 0'
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

      if (this.productId) {
        // Modo editar
        await this.cargarProducto();
      } else {
        // Modo crear
        document.getElementById('page-title').textContent = 'Nuevo Producto';
      }

      console.log('Product Form Controller cargado');
    } catch (error) {
      console.error('Error al inicializar Product Form:', error);
    }
  }

  /**
   * Obtiene el ID del producto desde la URL
   */
  getProductIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') ? parseInt(params.get('id')) : null;
  }

  /**
   * Carga el producto para edición
   */
  async cargarProducto() {
    try {
      const response = await this.api.getProductoById(this.productId);

      if (!response.success || !response.data) {
        alert('Producto no encontrado');
        window.location.href = 'products.html';
        return;
      }

      const producto = response.data;
      document.getElementById('page-title').textContent = `Editar: ${producto.nombre}`;

      // Llenar formulario
      document.getElementById('sku').value = producto.sku;
      document.getElementById('nombre').value = producto.nombre;
      document.getElementById('categoria').value = producto.categoria;
      document.getElementById('descripcion').value = producto.descripcion || '';
      document.getElementById('precio').value = producto.precio;
      document.getElementById('stock').value = producto.stock;
      document.getElementById('stock-critico').value = producto.stockCritico || '';
      document.getElementById('imagen').value = producto.imagen || '';
      document.getElementById('activo').checked = producto.activo;

      // Actualizar botón
      document.getElementById('btn-submit').textContent = 'Actualizar Producto';

      // Actualizar contador de descripción
      this.updateDescripcionCount();
    } catch (error) {
      console.error('Error al cargar producto:', error);
      alert('Error al cargar el producto');
      window.location.href = 'products.html';
    }
  }

  /**
   * Configura los event listeners del formulario
   */
  setupFormListeners() {
    const form = document.getElementById('product-form');
    const descripcion = document.getElementById('descripcion');

    if (form) {
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    if (descripcion) {
      descripcion.addEventListener('input', () => this.updateDescripcionCount());
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
   * Actualiza el contador de caracteres de descripción
   */
  updateDescripcionCount() {
    const descripcion = document.getElementById('descripcion');
    const counter = document.getElementById('descripcion-count');
    if (counter) {
      counter.textContent = `${descripcion.value.length}/500`;
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

    // Número mínimo
    if (rules.min !== undefined && parseFloat(value) < rules.min) {
      this.mostrarError(fieldName, `Debe ser mayor o igual a ${rules.min}`);
      return false;
    }

    // Es entero
    if (rules.isInteger && value && !Number.isInteger(parseFloat(value))) {
      this.mostrarError(fieldName, 'Debe ser un número entero');
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
      sku: document.getElementById('sku').value,
      nombre: document.getElementById('nombre').value,
      categoria: document.getElementById('categoria').value,
      descripcion: document.getElementById('descripcion').value,
      precio: parseFloat(document.getElementById('precio').value),
      stock: parseInt(document.getElementById('stock').value),
      stockCritico: document.getElementById('stock-critico').value ? parseInt(document.getElementById('stock-critico').value) : 0,
      imagen: document.getElementById('imagen').value,
      activo: document.getElementById('activo').checked
    };

    try {
      let response;

      if (this.productId) {
        // Actualizar
        response = await this.api.actualizarProducto(this.productId, formData);
      } else {
        // Crear
        response = await this.api.crearProducto(formData);
      }

      if (response.success) {
        alert(response.message || 'Producto guardado exitosamente');
        window.location.href = 'products.html';
      } else {
        alert('Error al guardar el producto');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al guardar el producto');
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  window.productFormController = new ProductFormController();
});
