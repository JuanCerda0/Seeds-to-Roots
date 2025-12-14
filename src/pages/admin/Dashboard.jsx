import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import Header from '../../components/admin/Header';
import StatsCard from '../../components/admin/StatsCard';
import { estadisticas, productos, usuarios } from '../../services/api';
import '../../components/admin/Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalUsuarios: 0,
    productosActivos: 0,
  });
  const [productosRecientes, setProductosRecientes] = useState([]);
  const [usuariosRecientes, setUsuariosRecientes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setLoading(true);

      // Cargar estadísticas
      const statsResponse = await estadisticas.get();
      setStats(statsResponse.data);

      // Cargar productos recientes
      const productosResponse = await productos.getRecientes(5);
      setProductosRecientes(productosResponse.data);

      // Cargar usuarios (tomar los últimos 5)
      const usuariosResponse = await usuarios.getAll();
      setUsuariosRecientes(usuariosResponse.data.slice(0, 5));

    } catch (error) {
      console.error('Error al cargar datos del dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return 'badge-danger';
    if (stock <= 50) return 'badge-warning';
    return 'badge-success';
  };

  const getStockText = (stock) => {
    if (stock === 0) return 'Sin Stock';
    if (stock <= 50) return 'Bajo Stock';
    return 'En Stock';
  };

  if (loading) {
    return (
      <AdminLayout>
        <Header title="Dashboard" />
        <section className="content">
          <p>Cargando...</p>
        </section>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Header title="Dashboard">
        <span className="user-name">Admin</span>
      </Header>

      <section className="content">
        {/* Stats Cards */}
        <div className="stats-container">
          <StatsCard
            icon="📦"
            title="Productos"
            value={stats.totalProductos}
            className="products-icon"
          />
          <StatsCard
            icon="👥"
            title="Usuarios"
            value={stats.totalUsuarios}
            className="users-icon"
          />
          <StatsCard
            icon="✅"
            title="Productos Activos"
            value={stats.productosActivos}
            className="orders-icon"
          />
        </div>

        {/* Productos Recientes */}
        <div className="section-card">
          <div className="section-header">
            <h2>Productos Recientes</h2>
            <a href="/admin/products" className="btn-link">Ver todos</a>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
              </tr>
            </thead>
            <tbody>
              {productosRecientes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">No hay productos</td>
                </tr>
              ) : (
                productosRecientes.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.id}</td>
                    <td>{producto.nombre}</td>
                    <td>{producto.categoria}</td>
                    <td>${producto.precio}</td>
                    <td>
                      <span className={`badge ${getStockBadge(producto.stock)}`}>
                        {getStockText(producto.stock)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Usuarios Recientes */}
        <div className="section-card">
          <div className="section-header">
            <h2>Usuarios Recientes</h2>
            <a href="/admin/users" className="btn-link">Ver todos</a>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Estado</th>
                <th>Fecha Registro</th>
              </tr>
            </thead>
            <tbody>
              {usuariosRecientes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center">No hay usuarios</td>
                </tr>
              ) : (
                usuariosRecientes.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>{usuario.id}</td>
                    <td>{usuario.nombre} {usuario.apellidos}</td>
                    <td>{usuario.email}</td>
                    <td>
                      <span className={`badge ${usuario.activo ? 'badge-success' : 'badge-warning'}`}>
                        {usuario.activo ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>{new Date(usuario.fechaRegistro).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
};

export default Dashboard;