import React, { useState, useEffect } from 'react';
import './dashboard.css'; // Importar el CSS separado

// Componente Sidebar
const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo">
          <a href="/frontend/client/pages/index.html">
            <h2>🌱 Seeds to Roots</h2>
          </a>
        </div>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <a href="dashboard.html" className="nav-link active">
              Dashboard
            </a>
          </li>
          <li>
            <a href="products.html" className="nav-link">
              Productos
            </a>
          </li>
          <li>
            <a href="users.html" className="nav-link">
              Usuarios
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

// Componente Header
const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <h1>Dashboard</h1>
        <div className="user-section">
          <span className="user-name">Admin</span>
        </div>
      </div>
    </header>
  );
};

// Componente StatCard
const StatCard = ({ icon, title, value }) => {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${title.toLowerCase()}-icon`}>{icon}</div>
      <div className="stat-info">
        <h3>{title}</h3>
        <p className="stat-number">{value}</p>
      </div>
    </div>
  );
};

// Componente ProductsTable
const ProductsTable = ({ productos, loading }) => {
  const getStatusClass = (stock) => {
    if (stock === 0) return 'badge-danger';
    if (stock <= 50) return 'badge-warning';
    return 'badge-success';
  };

  const getStatusText = (stock) => {
    if (stock === 0) return 'Sin Stock';
    if (stock <= 50) return 'Bajo Stock';
    return 'En Stock';
  };

  if (loading) {
    return (
      <tr>
        <td colSpan="5" className="text-center">
          Cargando productos...
        </td>
      </tr>
    );
  }

  if (productos.length === 0) {
    return (
      <tr>
        <td colSpan="5" className="text-center">
          No hay productos
        </td>
      </tr>
    );
  }

  return (
    <>
      {productos.map((producto) => (
        <tr key={producto.id}>
          <td>{producto.id}</td>
          <td>{producto.nombre}</td>
          <td>{producto.categoria}</td>
          <td>${producto.precio.toFixed(2)}</td>
          <td>
            <span className={`badge ${getStatusClass(producto.stock)}`}>
              {getStatusText(producto.stock)}
            </span>
          </td>
        </tr>
      ))}
    </>
  );
};

// Componente UsersTable
const UsersTable = ({ usuarios, loading }) => {
  if (loading) {
    return (
      <tr>
        <td colSpan="5" className="text-center">
          Cargando usuarios...
        </td>
      </tr>
    );
  }

  if (usuarios.length === 0) {
    return (
      <tr>
        <td colSpan="5" className="text-center">
          No hay usuarios
        </td>
      </tr>
    );
  }

  return (
    <>
      {usuarios.map((usuario) => {
        const statusClass =
          usuario.estado === 'activo' ? 'badge-success' : 'badge-warning';
        const statusText =
          usuario.estado.charAt(0).toUpperCase() + usuario.estado.slice(1);

        return (
          <tr key={usuario.id}>
            <td>{usuario.id}</td>
            <td>{usuario.nombre}</td>
            <td>{usuario.email}</td>
            <td>
              <span className={`badge ${statusClass}`}>{statusText}</span>
            </td>
            <td>{usuario.fechaRegistro}</td>
          </tr>
        );
      })}
    </>
  );
};

// Componente Principal Dashboard
const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProductos: 0,
    totalUsuarios: 0,
    totalPedidos: 0,
  });
  const [productos, setProductos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simulación de APIClient
  const mockAPI = {
    getEstadisticas: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return {
        success: true,
        data: {
          totalProductos: 45,
          totalUsuarios: 128,
        },
      };
    },
    getProductosRecientes: async () => {
      await new Promise((resolve) => setTimeout(resolve, 600));
      return {
        success: true,
        data: [
          {
            id: 1,
            nombre: 'Semillas de Tomate',
            categoria: 'Semillas',
            precio: 12.99,
            stock: 150,
          },
          {
            id: 2,
            nombre: 'Abono Orgánico',
            categoria: 'Fertilizantes',
            precio: 25.5,
            stock: 45,
          },
          {
            id: 3,
            nombre: 'Maceta de Cerámica',
            categoria: 'Herramientas',
            precio: 18.75,
            stock: 0,
          },
          {
            id: 4,
            nombre: 'Semillas de Lechuga',
            categoria: 'Semillas',
            precio: 8.99,
            stock: 200,
          },
          {
            id: 5,
            nombre: 'Kit de Riego',
            categoria: 'Herramientas',
            precio: 45.0,
            stock: 30,
          },
        ],
      };
    },
    getUsuariosRecientes: async () => {
      await new Promise((resolve) => setTimeout(resolve, 700));
      return {
        success: true,
        data: [
          {
            id: 1,
            nombre: 'Juan Pérez',
            email: 'juan@example.com',
            estado: 'activo',
            fechaRegistro: '2024-11-15',
          },
          {
            id: 2,
            nombre: 'María González',
            email: 'maria@example.com',
            estado: 'activo',
            fechaRegistro: '2024-11-20',
          },
          {
            id: 3,
            nombre: 'Carlos Ruiz',
            email: 'carlos@example.com',
            estado: 'inactivo',
            fechaRegistro: '2024-10-05',
          },
          {
            id: 4,
            nombre: 'Ana López',
            email: 'ana@example.com',
            estado: 'activo',
            fechaRegistro: '2024-11-28',
          },
          {
            id: 5,
            nombre: 'Pedro Martínez',
            email: 'pedro@example.com',
            estado: 'activo',
            fechaRegistro: '2024-12-01',
          },
        ],
      };
    },
  };

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const [estadisticasRes, productosRes, usuariosRes] = await Promise.all([
        mockAPI.getEstadisticas(),
        mockAPI.getProductosRecientes(5),
        mockAPI.getUsuariosRecientes(5),
      ]);

      if (estadisticasRes.success) {
        setStats({
          totalProductos: estadisticasRes.data.totalProductos,
          totalUsuarios: estadisticasRes.data.totalUsuarios,
          totalPedidos: estadisticasRes.data.totalProductos * 2,
        });
      }

      if (productosRes.success) {
        setProductos(productosRes.data);
      }

      if (usuariosRes.success) {
        setUsuarios(usuariosRes.data);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();

    // Recargar datos cada 30 segundos
    const interval = setInterval(() => {
      cargarDatos();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="admin-container">
      <Sidebar />

      <main className="main-content">
        <Header />

        <section className="content">
          {/* Stats Cards */}
          <div className="stats-container">
            <StatCard
              icon="📦"
              title="Productos"
              value={stats.totalProductos}
            />
            <StatCard icon="👥" title="Usuarios" value={stats.totalUsuarios} />
            <StatCard icon="📋" title="Pedidos" value={stats.totalPedidos} />
          </div>

          {/* Products Section */}
          <div className="section-card">
            <div className="section-header">
              <h2>Productos Recientes</h2>
              <a href="products.html" className="btn-link">
                Ver todos
              </a>
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
                <ProductsTable productos={productos} loading={loading} />
              </tbody>
            </table>
          </div>

          {/* Users Section */}
          <div className="section-card">
            <div className="section-header">
              <h2>Usuarios Recientes</h2>
              <a href="users.html" className="btn-link">
                Ver todos
              </a>
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
                <UsersTable usuarios={usuarios} loading={loading} />
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;