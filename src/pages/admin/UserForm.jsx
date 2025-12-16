import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import Header from '../../components/admin/Header';
import userService from '../../services/userService';
import '../../components/admin/Dashboard.css';
import '../../components/admin/admin-global.css';
import '../../components/admin/forms.css';

const UserForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const userIdParam = searchParams.get('id');
  const userId = userIdParam ? parseInt(userIdParam, 10) : null;

  const [pageTitle, setPageTitle] = useState('Nuevo Usuario');
  const [submitButtonText, setSubmitButtonText] = useState('Guardar Usuario');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [direccionCount, setDireccionCount] = useState(0);

  const [formData, setFormData] = useState({
    run: '',
    nombre: '',
    apellidos: '',
    email: '',
    password: '',
    telefono: '',
    fechaNacimiento: '',
    region: '',
    comuna: '',
    ciudad: '',
    direccion: '',
    rol: 'CLIENTE',
    activo: true
  });

  const validationRules = {
    password: {
      required: true,
      minLength: 6,
      message: 'La contraseña es requerida y debe tener al menos 6 caracteres'
    },
    run: {
      required: true,
      regex: /^\d{7,8}-[0-9kK]$/,
      message: 'El RUN debe tener formato 12345678-9'
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
    ciudad: {
      required: true,
      maxLength: 100,
      message: 'La ciudad es requerida'
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

  // Cargar usuario si estamos en modo edición
  useEffect(() => {
    if (userId) {
      cargarUsuario();
    }
  }, [userId]);

  /**
   * Carga el usuario para edición
   */
  const cargarUsuario = async () => {
    try {
      setLoading(true);
      const usuario = await userService.getById(userId);

      if (!usuario) {
        alert('Usuario no encontrado');
        navigate('/admin/users');
        return;
      }

      setPageTitle(`Editar: ${usuario.nombre} ${usuario.apellidos}`);
      setSubmitButtonText('Actualizar Usuario');
      setFormData({
        run: usuario.run,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        email: usuario.email,
        password: usuario.password || '',
        telefono: usuario.telefono || '',
        fechaNacimiento: usuario.fechaNacimiento || '',
        region: usuario.region,
        comuna: usuario.comuna,
        ciudad: usuario.ciudad || '',
        direccion: usuario.direccion,
        rol: usuario.rol,
        activo: usuario.activo
      });
      setDireccionCount(usuario.direccion ? usuario.direccion.length : 0);
    } catch (error) {
      console.error('Error al cargar usuario:', error);
      alert('Error al cargar el usuario');
      navigate('/admin/users');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Maneja los cambios en los inputs
   */
  const handleChange = (e) => {
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

    // Actualizar contador de dirección
    if (name === 'direccion') {
      setDireccionCount(value.length);
    }
  };

  /**
   * Valida un campo específico
   */
  const validarCampo = (fieldName) => {
    const value = formData[fieldName]?.toString().trim() || '';
    const rules = validationRules[fieldName];

    if (!rules) return true;

    // Requerido
    if (rules.required && !value) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: 'Este campo es requerido'
      }));
      return false;
    }

    if (!value && !rules.required) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: ''
      }));
      return true;
    }

    // Longitud mínima
    if (rules.minLength && value.length < rules.minLength) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: `Mínimo ${rules.minLength} caracteres`
      }));
      return false;
    }

    // Longitud máxima
    if (rules.maxLength && value.length > rules.maxLength) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: `Máximo ${rules.maxLength} caracteres`
      }));
      return false;
    }

    // Regex
    if (rules.regex && !rules.regex.test(value)) {
      setErrors(prev => ({
        ...prev,
        [fieldName]: rules.message
      }));
      return false;
    }

    setErrors(prev => ({
      ...prev,
      [fieldName]: ''
    }));
    return true;
  };

  /**
   * Valida todo el formulario
   */
  const validarFormulario = () => {
    let isValid = true;
    const newErrors = {};

    Object.keys(validationRules).forEach(fieldName => {
      const value = formData[fieldName]?.toString().trim() || '';
      const rules = validationRules[fieldName];

      if (!rules) return;

      // Requerido
      if (rules.required && !value) {
        newErrors[fieldName] = 'Este campo es requerido';
        isValid = false;
        return;
      }

      if (!value && !rules.required) {
        return;
      }

      // Longitud mínima
      if (rules.minLength && value.length < rules.minLength) {
        newErrors[fieldName] = `Mínimo ${rules.minLength} caracteres`;
        isValid = false;
        return;
      }

      // Longitud máxima
      if (rules.maxLength && value.length > rules.maxLength) {
        newErrors[fieldName] = `Máximo ${rules.maxLength} caracteres`;
        isValid = false;
        return;
      }

      // Regex
      if (rules.regex && !rules.regex.test(value)) {
        newErrors[fieldName] = rules.message;
        isValid = false;
        return;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      alert('Por favor corrige los errores en el formulario');
      return;
    }

    const dataToSubmit = {
      run: formData.run,
      nombre: formData.nombre,
      apellidos: formData.apellidos,
      email: formData.email,
      password: formData.password,
      telefono: formData.telefono,
      fechaNacimiento: formData.fechaNacimiento,
      region: formData.region,
      comuna: formData.comuna,
      ciudad: formData.ciudad,
      direccion: formData.direccion,
      rol: formData.rol?.toUpperCase(),
      activo: formData.activo
    };

    try {
      setLoading(true);

      if (userId) {
        await userService.update(userId, dataToSubmit);
        alert('Usuario actualizado exitosamente');
      } else {
        await userService.create(dataToSubmit);
        alert('Usuario guardado exitosamente');
      }

      navigate('/admin/users');
    } catch (error) {
      console.error('Error:', error);
      const backendMessage = error.response?.data?.message;
      const errorMsg = backendMessage || (error.response?.status === 400
        ? 'Datos invalidos o duplicados.'
        : 'Error al guardar el usuario');
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading && userId) {
    return (
      <AdminLayout>
        <Header title="Cargando usuario..." />
        <section className="content">
          <div className="section-card">
            <div className="loading">Cargando usuario...</div>
          </div>
        </section>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Header title={pageTitle}>
        <button
          type="button"
          onClick={() => navigate('/admin/users')}
          className="btn btn-secondary"
        >
          {'<'} Volver
        </button>
      </Header>

      {/* Page Content */}
      <section className="content">
        <div className="section-card form-container">
          <form onSubmit={handleSubmit} className="user-form">
              {/* Sección: Información Personal */}
              <fieldset className="form-fieldset">
                <legend>Información Personal</legend>

                {/* RUN */}
                <div className={`form-group full-width ${errors.run ? 'error' : ''}`}>
                  <label htmlFor="run">
                    RUN <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="run"
                    name="run"
                    placeholder="ej: 12345678-9"
                    maxLength="10"
                    value={formData.run}
                    onChange={handleChange}
                    onBlur={() => validarCampo('run')}
                    required
                  />
                  <small>Incluye guion y digito verificador (12345678-9)</small>
                  {errors.run && <div className="error-message show">{errors.run}</div>}
                </div>

                {/* Nombre y Apellidos */}
                <div className="form-row">
                  <div className={`form-group ${errors.nombre ? 'error' : ''}`}>
                    <label htmlFor="nombre">
                      Nombre <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      placeholder="ej: Juan"
                      maxLength="50"
                      value={formData.nombre}
                      onChange={handleChange}
                      onBlur={() => validarCampo('nombre')}
                      required
                    />
                    {errors.nombre && <div className="error-message show">{errors.nombre}</div>}
                  </div>

                  <div className={`form-group ${errors.apellidos ? 'error' : ''}`}>
                    <label htmlFor="apellidos">
                      Apellidos <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="apellidos"
                      name="apellidos"
                      placeholder="ej: Pérez García"
                      maxLength="100"
                      value={formData.apellidos}
                      onChange={handleChange}
                      onBlur={() => validarCampo('apellidos')}
                      required
                    />
                    {errors.apellidos && <div className="error-message show">{errors.apellidos}</div>}
                  </div>
                </div>

                {/* Fecha de Nacimiento */}
                <div className={`form-group full-width ${errors.fechaNacimiento ? 'error' : ''}`}>
                  <label htmlFor="fechaNacimiento">
                    Fecha de Nacimiento (opcional)
                  </label>
                  <input
                    type="date"
                    id="fechaNacimiento"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento}
                    onChange={handleChange}
                    onBlur={() => validarCampo('fechaNacimiento')}
                  />
                  {errors.fechaNacimiento && <div className="error-message show">{errors.fechaNacimiento}</div>}
                </div>
              </fieldset>

              {/* Sección: Información de Contacto */}
              <fieldset className="form-fieldset">
                <legend>Información de Contacto</legend>

                {/* Email */}
                <div className={`form-group full-width ${errors.email ? 'error' : ''}`}>
                  <label htmlFor="email">
                    Correo Electrónico <span className="required">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="ej: usuario@duoc.cl"
                    maxLength="100"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={() => validarCampo('email')}
                    required
                  />
                  <small>Dominios permitidos: @duoc.cl, @profesor.duoc.cl, @gmail.com</small>
                  {errors.email && <div className="error-message show">{errors.email}</div>}
                </div>

                {/* Contraseña */}
                <div className={`form-group full-width ${errors.password ? 'error' : ''}`}>
                  <label htmlFor="password">
                    Contraseña <span className="required">*</span>
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Mínimo 6 caracteres"
                    minLength="6"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={() => validarCampo('password')}
                    required
                  />
                  {errors.password && <div className="error-message show">{errors.password}</div>}
                </div>

                {/* Teléfono */}
                <div className={`form-group full-width ${errors.telefono ? 'error' : ''}`}>
                  <label htmlFor="telefono">
                    Teléfono (opcional)
                  </label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    placeholder="ej: +56912345678"
                    value={formData.telefono}
                    onChange={handleChange}
                    onBlur={() => validarCampo('telefono')}
                  />
                  {errors.telefono && <div className="error-message show">{errors.telefono}</div>}
                </div>
              </fieldset>

              {/* Sección: Ubicación */}
              <fieldset className="form-fieldset">
                <legend>Ubicación</legend>

                {/* Región y Comuna */}
                <div className="form-row">
                  <div className={`form-group ${errors.region ? 'error' : ''}`}>
                    <label htmlFor="region">
                      Región <span className="required">*</span>
                    </label>
                    <select
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      onBlur={() => validarCampo('region')}
                      required
                    >
                      <option value="">-- Selecciona región --</option>
                      <option value="Región Metropolitana">Región Metropolitana</option>
                      <option value="Región de Valparaíso">Región de Valparaíso</option>
                      <option value="Región del Libertador General Bernardo O'Higgins">Región O'Higgins</option>
                      <option value="Región del Bío Bío">Región del Bío Bío</option>
                      <option value="Región de Los Lagos">Región de Los Lagos</option>
                      <option value="Región de Antofagasta">Región de Antofagasta</option>
                      <option value="Región de Atacama">Región de Atacama</option>
                      <option value="Región de Coquimbo">Región de Coquimbo</option>
                    </select>
                    {errors.region && <div className="error-message show">{errors.region}</div>}
                  </div>

                  <div className={`form-group ${errors.comuna ? 'error' : ''}`}>
                    <label htmlFor="comuna">
                      Comuna <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      id="comuna"
                      name="comuna"
                      placeholder="ej: Santiago"
                      maxLength="50"
                      value={formData.comuna}
                      onChange={handleChange}
                      onBlur={() => validarCampo('comuna')}
                      required
                    />
                    {errors.comuna && <div className="error-message show">{errors.comuna}</div>}
                  </div>
                </div>

                <div className={`form-group full-width ${errors.ciudad ? 'error' : ''}`}>
                  <label htmlFor="ciudad">
                    Ciudad <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="ciudad"
                    name="ciudad"
                    placeholder="ej: Santiago"
                    maxLength="100"
                    value={formData.ciudad}
                    onChange={handleChange}
                    onBlur={() => validarCampo('ciudad')}
                    required
                  />
                  {errors.ciudad && <div className="error-message show">{errors.ciudad}</div>}
                </div>
                {/* Dirección */}
                <div className={`form-group full-width ${errors.direccion ? 'error' : ''}`}>
                  <label htmlFor="direccion">
                    Dirección <span className="required">*</span>
                  </label>
                  <textarea
                    id="direccion"
                    name="direccion"
                    placeholder="ej: Calle Principal 123, Departamento 4B"
                    maxLength="300"
                    value={formData.direccion}
                    onChange={handleChange}
                    onBlur={() => validarCampo('direccion')}
                    required
                  ></textarea>
                  <small>{direccionCount}/300</small>
                  {errors.direccion && <div className="error-message show">{errors.direccion}</div>}
                </div>
              </fieldset>

              {/* Sección: Rol y Permisos */}
              <fieldset className="form-fieldset">
                <legend>Rol y Permisos</legend>

                {/* Tipo de Usuario */}
                <div className={`form-group full-width ${errors.rol ? 'error' : ''}`}>
                  <label htmlFor="rol">
                    Tipo de Usuario <span className="required">*</span>
                  </label>
                  <select
                    id="rol"
                    name="rol"
                    value={formData.rol}
                    onChange={handleChange}
                    onBlur={() => validarCampo('rol')}
                    required
                  >
                    <option value="">-- Selecciona tipo --</option>
                    <option value="ADMIN">Administrador</option>
                    <option value="CLIENTE">Cliente</option>
                  </select>
                  {errors.rol && <div className="error-message show">{errors.rol}</div>}
                </div>

                {/* Activo */}
                <div className="form-group full-width">
                  <label htmlFor="activo">
                    <input
                      type="checkbox"
                      id="activo"
                      name="activo"
                      checked={formData.activo}
                      onChange={handleChange}
                    />
                    Usuario Activo
                  </label>
                </div>
              </fieldset>

              {/* Botones */}
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => navigate('/admin/users')}
                  className="btn btn-cancel"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-submit"
                  disabled={loading}
                >
                  {loading ? 'Guardando...' : submitButtonText}
                </button>
              </div>
            </form>
          </div>
        </section>
    </AdminLayout>
  );
};

export default UserForm;
