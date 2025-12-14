import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import Header from '../../components/admin/Header';
import productoService from '../../services/productoService';
import '../../components/admin/Dashboard.css';
import '../../components/admin/admin-global.css';
import '../../components/admin/forms.css';

const ProductForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    sku: '',
    nombre: '',
    categoria: '',
    descripcion: '',
    precio: '',
    stock: '',
    stockCritico: '',
    imagen: '',
    activo: true
  });

  const [errors, setErrors] = useState({});
  const [pageTitle, setPageTitle] = useState('Nuevo Producto');
  const [submitButtonText, setSubmitButtonText] = useState('Guardar Producto');
  const [productId, setProductId] = useState(null);
  const [descripcionCount, setDescripcionCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const validationRules = {
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

  // Obtener ID del producto desde la URL
  useEffect(() => {
    const idParam = searchParams.get('id');
    const id = idParam ? parseInt(idParam, 10) : null;
    setProductId(id);

    if (id) {
      cargarProducto(id);
    }
  }, [searchParams]);

  // Cargar producto para edición
  const cargarProducto = async (id) => {
    try {
      setIsLoading(true);
      const producto = await productoService.getById(id);

      if (!producto) {
        alert('Producto no encontrado');
        navigate('/admin/products');
        return;
      }

      setPageTitle(`Editar: ${producto.nombre}`);
      setSubmitButtonText('Actualizar Producto');
      setFormData({
        sku: producto.sku,
        nombre: producto.nombre,
        categoria: producto.categoria,
        descripcion: producto.descripcion || '',
        precio: producto.precio,
        stock: producto.stock,
        stockCritico: producto.stockCritico || '',
        imagen: producto.imagen || '',
        activo: producto.activo
      });
      setDescripcionCount(producto.descripcion ? producto.descripcion.length : 0);
    } catch (error) {
      console.error('Error al cargar producto:', error);
      alert('Error al cargar el producto');
      navigate('/admin/products');
    } finally {
      setIsLoading(false);
    }
  };

  // Manejar cambios en los inputs
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));

    // Limpiar error si existe
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Actualizar contador de descripción
    if (name === 'descripcion') {
      setDescripcionCount(value.length);
    }
  };

  // Validar un campo específico
  const validarCampo = (fieldName, value) => {
    const rules = validationRules[fieldName];

    if (!rules) return true;

    // Requerido
    if (rules.required && !value.toString().trim()) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: 'Este campo es requerido'
      }));
      return false;
    }

    // Longitud mínima
    if (rules.minLength && value.toString().trim().length < rules.minLength) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: `Mínimo ${rules.minLength} caracteres`
      }));
      return false;
    }

    // Longitud máxima
    if (rules.maxLength && value.toString().length > rules.maxLength) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: `Máximo ${rules.maxLength} caracteres`
      }));
      return false;
    }

    // Número mínimo
    if (rules.min !== undefined && parseFloat(value) < rules.min) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: `Debe ser mayor o igual a ${rules.min}`
      }));
      return false;
    }

    // Es entero
    if (rules.isInteger && value && !Number.isInteger(parseFloat(value))) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: 'Debe ser un número entero'
      }));
      return false;
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: ''
    }));
    return true;
  };

  // Validar todo el formulario
  const validarFormulario = () => {
    let isValid = true;
    const newErrors = {};

    Object.keys(validationRules).forEach(fieldName => {
      const value = formData[fieldName];
      const rules = validationRules[fieldName];

      if (!rules) return;

      // Requerido
      if (rules.required && !value.toString().trim()) {
        newErrors[fieldName] = 'Este campo es requerido';
        isValid = false;
        return;
      }

      // Longitud mínima
      if (rules.minLength && value.toString().trim().length < rules.minLength) {
        newErrors[fieldName] = `Mínimo ${rules.minLength} caracteres`;
        isValid = false;
        return;
      }

      // Longitud máxima
      if (rules.maxLength && value.toString().length > rules.maxLength) {
        newErrors[fieldName] = `Máximo ${rules.maxLength} caracteres`;
        isValid = false;
        return;
      }

      // Número mínimo
      if (rules.min !== undefined && parseFloat(value) < rules.min) {
        newErrors[fieldName] = `Debe ser mayor o igual a ${rules.min}`;
        isValid = false;
        return;
      }

      // Es entero
      if (rules.isInteger && value && !Number.isInteger(parseFloat(value))) {
        newErrors[fieldName] = 'Debe ser un número entero';
        isValid = false;
        return;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      alert('Por favor corrige los errores en el formulario');
      return;
    }

    const dataToSubmit = {
      sku: formData.sku,
      nombre: formData.nombre,
      categoria: formData.categoria,
      descripcion: formData.descripcion,
      precio: parseFloat(formData.precio),
      stock: parseInt(formData.stock),
      stockCritico: formData.stockCritico ? parseInt(formData.stockCritico) : 0,
      imagen: formData.imagen,
      activo: formData.activo
    };

    try {
      setIsLoading(true);

      if (productId) {
        await productoService.update(productId, dataToSubmit);
        alert('Producto actualizado exitosamente');
      } else {
        await productoService.create(dataToSubmit);
        alert('Producto guardado exitosamente');
      }

      navigate('/admin/products');
    } catch (error) {
      console.error('Error:', error);
      const errorMsg = error.response?.data?.message || 'Error al guardar el producto';
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <Header title={pageTitle}>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate('/admin/products')}
        >
          {'<'} Volver
        </button>
      </Header>

      <section className="content">
        <div className="section-card form-container">
          <form onSubmit={handleSubmit} className="admin-form">
            {/* Fila 1: Código y Nombre */}
            <div className="form-row">
              <div className={`form-group ${errors.sku ? 'error' : ''}`}>
                <label htmlFor="sku">
                  Código (SKU) <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="sku"
                  name="sku"
                  placeholder="ej: TCH-001"
                  value={formData.sku}
                  onChange={handleInputChange}
                  onBlur={() => validarCampo('sku', formData.sku)}
                  minLength="3"
                  maxLength="50"
                  required
                />
                {errors.sku && <div className="error-message show">{errors.sku}</div>}
              </div>

              <div className={`form-group ${errors.nombre ? 'error' : ''}`}>
                <label htmlFor="nombre">
                  Nombre <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  placeholder="ej: Tomate Cherry"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  onBlur={() => validarCampo('nombre', formData.nombre)}
                  maxLength="100"
                  required
                />
                {errors.nombre && <div className="error-message show">{errors.nombre}</div>}
              </div>
            </div>

            {/* Fila 2: Categoría */}
            <div className={`form-group full-width ${errors.categoria ? 'error' : ''}`}>
              <label htmlFor="categoria">
                Categoría <span className="required">*</span>
              </label>
              <select
                id="categoria"
                name="categoria"
                value={formData.categoria}
                onChange={handleInputChange}
                onBlur={() => validarCampo('categoria', formData.categoria)}
                required
              >
                <option value="">-- Selecciona una categoría --</option>
                <option value="Hortalizas">Hortalizas</option>
                <option value="Verduras">Verduras</option>
                <option value="Condimentos">Condimentos</option>
                <option value="Frutas">Frutas</option>
              </select>
              {errors.categoria && <div className="error-message show">{errors.categoria}</div>}
            </div>

            {/* Fila 3: Descripción */}
            <div className={`form-group full-width ${errors.descripcion ? 'error' : ''}`}>
              <label htmlFor="descripcion">
                Descripción (opcional)
              </label>
              <textarea
                id="descripcion"
                name="descripcion"
                placeholder="Describe el producto..."
                value={formData.descripcion}
                onChange={handleInputChange}
                onBlur={() => validarCampo('descripcion', formData.descripcion)}
                maxLength="500"
              ></textarea>
              <small>{descripcionCount}/500</small>
              {errors.descripcion && <div className="error-message show">{errors.descripcion}</div>}
            </div>

            {/* Fila 4: Precio y Stock */}
            <div className="form-row">
              <div className={`form-group ${errors.precio ? 'error' : ''}`}>
                <label htmlFor="precio">
                  Precio (USD) <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="precio"
                  name="precio"
                  placeholder="0.00"
                  value={formData.precio}
                  onChange={handleInputChange}
                  onBlur={() => validarCampo('precio', formData.precio)}
                  step="0.01"
                  min="0"
                  required
                />
                {errors.precio && <div className="error-message show">{errors.precio}</div>}
              </div>

              <div className={`form-group ${errors.stock ? 'error' : ''}`}>
                <label htmlFor="stock">
                  Stock <span className="required">*</span>
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  placeholder="0"
                  value={formData.stock}
                  onChange={handleInputChange}
                  onBlur={() => validarCampo('stock', formData.stock)}
                  min="0"
                  step="1"
                  required
                />
                {errors.stock && <div className="error-message show">{errors.stock}</div>}
              </div>
            </div>

            {/* Fila 5: Stock Crítico e Imagen */}
            <div className="form-row">
              <div className={`form-group ${errors.stockCritico ? 'error' : ''}`}>
                <label htmlFor="stockCritico">
                  Stock Crítico (opcional)
                </label>
                <input
                  type="number"
                  id="stockCritico"
                  name="stockCritico"
                  placeholder="50"
                  value={formData.stockCritico}
                  onChange={handleInputChange}
                  onBlur={() => validarCampo('stockCritico', formData.stockCritico)}
                  min="0"
                  step="1"
                />
                <small>Alerta cuando el stock sea menor a este valor</small>
                {errors.stockCritico && <div className="error-message show">{errors.stockCritico}</div>}
              </div>

              <div className={`form-group ${errors.imagen ? 'error' : ''}`}>
                <label htmlFor="imagen">
                  Imagen (opcional)
                </label>
                <input
                  type="text"
                  id="imagen"
                  name="imagen"
                  placeholder="nombre-imagen.jpg"
                  value={formData.imagen}
                  onChange={handleInputChange}
                  onBlur={() => validarCampo('imagen', formData.imagen)}
                  maxLength="100"
                />
                <small>Solo el nombre del archivo</small>
                {errors.imagen && <div className="error-message show">{errors.imagen}</div>}
              </div>
            </div>

            {/* Fila 6: Activo */}
            <div className="form-group full-width">
              <label htmlFor="activo">
                <input
                  type="checkbox"
                  id="activo"
                  name="activo"
                  checked={formData.activo}
                  onChange={handleInputChange}
                />
                Producto activo
              </label>
            </div>

            {/* Botones */}
            <div className="form-footer">
              <button
                type="button"
                className="btn btn-cancel"
                onClick={() => navigate('/admin/products')}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-submit"
                disabled={isLoading}
              >
                {isLoading ? 'Guardando...' : submitButtonText}
              </button>
            </div>
          </form>
        </div>
      </section>
    </AdminLayout>
  );
};

export default ProductForm;
