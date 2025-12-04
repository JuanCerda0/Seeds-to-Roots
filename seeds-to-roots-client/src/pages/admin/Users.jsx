import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import userService from '../../services/userService';

const Users = () => {
  const navigate = useNavigate();
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtros
  const [searchInput, setSearchInput] = useState('');
  const [rolFilter, setRolFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const itemsPerPage = 10;

  // Cargar usuarios al montar el componente
  useEffect(() => {
    cargarUsuarios();
  }, []);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    aplicarFiltros();
  }, [searchInput, rolFilter, statusFilter, allUsers]);

  /**
   * Carga todos los usuarios
   */
  const cargarUsuarios = async () => {
    try {
      setLoading(true);
      setError('');
      const usuarios = await userService.getAll();
      setAllUsers(Array.isArray(usuarios) ? usuarios : []);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error al cargar usuarios:', err);
      setError('Error al cargar los usuarios');
      setAllUsers([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Aplica todos los filtros
   */
  const aplicarFiltros = () => {
    let filtered = allUsers;

    // Filtro de búsqueda
    if (searchInput.trim()) {
      const searchLower = searchInput.toLowerCase();
      filtered = filtered.filter(usuario => {
        const nombreCompleto = `${usuario.nombre} ${usuario.apellidos}`.toLowerCase();
        return (
          nombreCompleto.includes(searchLower) ||
          usuario.email.toLowerCase().includes(searchLower) ||
          usuario.run.includes(searchInput)
        );
      });
    }

    // Filtro de rol
    if (rolFilter) {
      filtered = filtered.filter(usuario => usuario.rol === rolFilter);
    }

    // Filtro de estado
    if (statusFilter) {
      filtered = filtered.filter(usuario => {
        const estado = usuario.estado || (usuario.activo ? 'activo' : 'inactivo');
        return estado === statusFilter;
      });
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  /**
   * Abre el formulario para crear o editar
   */
  const abrirFormulario = (usuarioId) => {
    if (usuarioId) {
      navigate(`/admin/user-form?id=${usuarioId}`);
    } else {
      navigate('/admin/user-form');
    }
  };

  /**
   * Elimina un usuario
   */
  const eliminarUsuario = async (usuarioId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
      try {
        await userService.delete(usuarioId);
        alert('Usuario eliminado exitosamente');
        await cargarUsuarios();
      } catch (err) {
        console.error('Error:', err);
        alert('Error al eliminar el usuario');
      }
    }
  };

  /**
   * Obtiene la clase CSS según el rol
   */
  const getRolClass = (rol) => {
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
  };

  /**
   * Obtiene el texto a mostrar del rol
   */
  const getDisplayRol = (rol) => {
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
  };

  /**
   * Obtiene el estado del usuario
   */
  const getEstado = (usuario) => {
    return usuario.estado || (usuario.activo ? 'activo' : 'inactivo');
  };

  /**
   * Obtiene la clase CSS del estado
   */
  const getStatusClass = (usuario) => {
    const estado = getEstado(usuario);
    return estado === 'activo' ? 'badge-success' : 'badge-warning';
  };

  /**
   * Obtiene el texto del estado
   */
  const getStatusText = (usuario) => {
    const estado = getEstado(usuario);
    return estado.charAt(0).toUpperCase() + estado.slice(1);
  };

  // Paginación
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const inicio = (currentPage - 1) * itemsPerPage;
  const fin = inicio + itemsPerPage;
  const usuariosEnPagina = filteredUsers.slice(inicio, fin);

  return (
    <AdminLayout>
      {/* Main Content */}
      <main className="main-content">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <h1>Usuarios</h1>
            <div className="header-actions">
              <button
                className="btn btn-primary"
                onClick={() => abrirFormulario(null)}
              >
                + Nuevo Usuario
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <section className="content">
          {error && (
            <div className="alert alert-error">
              {error}
              <button onClick={cargarUsuarios} className="btn btn-small">
                Reintentar
              </button>
            </div>
          )}

          {/* Filtros y búsqueda */}
          <div className="filters-container">
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar por nombre, email o RUN..."
                className="search-input"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <select
                className="filter-select"
                value={rolFilter}
                onChange={(e) => setRolFilter(e.target.value)}
              >
                <option value="">Todos los roles</option>
                <option value="admin">Administrador</option>
                <option value="vendedor">Vendedor</option>
                <option value="cliente">Cliente</option>
              </select>
            </div>
            <div className="filter-group">
              <select
                className="filter-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Tabla de Usuarios */}
          <div className="section-card">
            <div className="section-header">
              <h2>Listado de Usuarios</h2>
              <span className="user-count">
                {filteredUsers.length} usuario{filteredUsers.length !== 1 ? 's' : ''}
              </span>
            </div>

            {loading ? (
              <div className="loading">Cargando usuarios...</div>
            ) : filteredUsers.length === 0 ? (
              <table className="table table-users">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>RUN</th>
                    <th>Nombre Completo</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Región</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="8" className="text-center">
                      No hay usuarios
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <table className="table table-users">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>RUN</th>
                    <th>Nombre Completo</th>
                    <th>Email</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Región</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {usuariosEnPagina.map(usuario => (
                    <tr key={usuario.id}>
                      <td>{usuario.id}</td>
                      <td>
                        <strong>{usuario.run}</strong>
                      </td>
                      <td>{usuario.nombre} {usuario.apellidos}</td>
                      <td>{usuario.email}</td>
                      <td>
                        <span className={`role-badge ${getRolClass(usuario.rol)}`}>
                          {getDisplayRol(usuario.rol)}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${getStatusClass(usuario)}`}>
                          {getStatusText(usuario)}
                        </span>
                      </td>
                      <td>{usuario.region}</td>
                      <td>
                        <div className="user-actions">
                          <button
                            className="btn-edit btn-small"
                            onClick={() => abrirFormulario(usuario.id)}
                            title="Editar"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            className="btn-delete btn-small"
                            onClick={() => eliminarUsuario(usuario.id)}
                            title="Eliminar"
                          >
                            🗑️ Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Paginación */}
          {filteredUsers.length > 0 && (
            <div className="pagination-container">
              <button
                className="btn-pagination"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                ← Anterior
              </button>
              <span className="pagination-info">
                Página {currentPage} de {totalPages}
              </span>
              <button
                className="btn-pagination"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Siguiente →
              </button>
            </div>
          )}
        </section>
      </main>
    </AdminLayout>
  );
};

export default Users;