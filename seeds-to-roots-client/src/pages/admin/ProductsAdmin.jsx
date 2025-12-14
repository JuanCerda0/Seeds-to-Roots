import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import Header from '../../components/admin/Header';
import productoService from '../../services/productoService';
import '../../components/admin/Dashboard.css';
import '../../components/admin/admin-global.css';

const Products = () => {
  const navigate = useNavigate();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtros
  const [searchInput, setSearchInput] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');

  const itemsPerPage = 10;

  // Cargar productos al montar el componente
  useEffect(() => {
    cargarProductos();
  }, []);

  // Aplicar filtros cuando cambien
  useEffect(() => {
    aplicarFiltros();
  }, [searchInput, categoryFilter, stockFilter, allProducts]);

  /**
   * Carga todos los productos
   */
  const cargarProductos = async () => {
    try {
      setLoading(true);
      setError('');
      const productos = await productoService.getAll();
      setAllProducts(Array.isArray(productos) ? productos : []);
      setCurrentPage(1);
    } catch (err) {
      console.error('Error al cargar productos:', err);
      setError('Error al cargar los productos');
      setAllProducts([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Aplica todos los filtros
   */
  const aplicarFiltros = () => {
    let filtered = allProducts;

    // Filtro de búsqueda
    if (searchInput.trim()) {
      const searchLower = searchInput.toLowerCase();
      filtered = filtered.filter(producto =>
        producto.nombre.toLowerCase().includes(searchLower) ||
        producto.sku.toLowerCase().includes(searchLower)
      );
    }

    // Filtro de categoría
    if (categoryFilter) {
      filtered = filtered.filter(producto => producto.categoria === categoryFilter);
    }

    // Filtro de stock
    if (stockFilter) {
      filtered = filtered.filter(producto => {
        if (stockFilter === 'en-stock') return producto.stock > 50;
        if (stockFilter === 'bajo-stock') return producto.stock > 0 && producto.stock <= 50;
        if (stockFilter === 'sin-stock') return producto.stock === 0;
        return true;
      });
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  /**
   * Abre el formulario para crear o editar
   */
  const abrirFormulario = (productId) => {
    if (productId) {
      navigate(`/admin/product-form?id=${productId}`);
    } else {
      navigate('/admin/product-form');
    }
  };

  /**
   * Elimina un producto
   */
  const eliminarProducto = async (productId) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      try {
        await productoService.delete(productId);
        alert('Producto eliminado exitosamente');
        await cargarProductos();
      } catch (err) {
        console.error('Error:', err);
        alert('Error al eliminar el producto');
      }
    }
  };

  /**
   * Determina la clase CSS del estado de stock
   */
  const getStatusClass = (stock) => {
    if (stock === 0) return 'badge-danger';
    if (stock <= 50) return 'badge-warning';
    return 'badge-success';
  };

  /**
   * Obtiene el texto del estado de stock
   */
  const getStatusText = (stock) => {
    if (stock === 0) return 'Sin Stock';
    if (stock <= 50) return 'Bajo Stock';
    return 'En Stock';
  };

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const inicio = (currentPage - 1) * itemsPerPage;
  const fin = inicio + itemsPerPage;
  const productosEnPagina = filteredProducts.slice(inicio, fin);

  return (
    <AdminLayout>
      <Header title="Productos">
        <button
          className="btn btn-primary"
          onClick={() => abrirFormulario(null)}
        >
          + Nuevo Producto
        </button>
      </Header>

      <section className="content">
          {error && (
            <div className="alert alert-error">
              {error}
              <button onClick={cargarProductos} className="btn btn-small">
                Reintentar
              </button>
            </div>
          )}

          {/* Filtros y búsqueda */}
          <div className="filters-container">
            <div className="search-box">
              <input
                type="text"
                placeholder="Buscar por nombre o código..."
                className="search-input"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <select
                className="filter-select"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Todas las categorías</option>
                <option value="Hortalizas">Hortalizas</option>
                <option value="Verduras">Verduras</option>
                <option value="Condimentos">Condimentos</option>
                <option value="Frutas">Frutas</option>
              </select>
            </div>
            <div className="filter-group">
              <select
                className="filter-select"
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <option value="">Todos los estados</option>
                <option value="en-stock">En Stock</option>
                <option value="bajo-stock">Bajo Stock</option>
                <option value="sin-stock">Sin Stock</option>
              </select>
            </div>
          </div>

          {/* Tabla de Productos */}
          <div className="section-card">
            <div className="section-header">
              <h2>Listado de Productos</h2>
              <span className="product-count">
                {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''}
              </span>
            </div>

            {loading ? (
              <div className="loading">Cargando productos...</div>
            ) : filteredProducts.length === 0 ? (
              <table className="table table-products">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan="8" className="text-center">
                      No hay productos
                    </td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <table className="table table-products">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {productosEnPagina.map(producto => (
                    <tr key={producto.id}>
                      <td>{producto.id}</td>
                      <td>
                        <strong>{producto.sku}</strong>
                      </td>
                      <td>{producto.nombre}</td>
                      <td>{producto.categoria}</td>
                      <td>${producto.precio.toFixed(2)}</td>
                      <td>{producto.stock}</td>
                      <td>
                        <span className={`badge ${getStatusClass(producto.stock)}`}>
                          {getStatusText(producto.stock)}
                        </span>
                      </td>
                      <td>
                        <div className="product-actions">
                          <button
                            className="btn-edit btn-small"
                            onClick={() => abrirFormulario(producto.id)}
                            title="Editar"
                          >
                            ✏️ Editar
                          </button>
                          <button
                            className="btn-delete btn-small"
                            onClick={() => eliminarProducto(producto.id)}
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
          {filteredProducts.length > 0 && (
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
    </AdminLayout>
  );
};

export default Products;
