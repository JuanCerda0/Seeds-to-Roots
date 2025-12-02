import { useState, useEffect } from 'react';
import productoService from '../services/productoService';
import { useCart } from '../context/useCart';
import '../components/css/Productos.css';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [productoAgregado, setProductoAgregado] = useState(null);
  
  const { addToCart } = useCart();

  useEffect(() => {
    loadProductos();
  }, []);

  const loadProductos = async () => {
    try {
      setLoading(true);
      const data = await productoService.getAll();
      setProductos(data);
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarAlCarrito = (producto) => {
    addToCart(producto);
    
    // Mostrar confirmación temporal
    setProductoAgregado(producto.id);
    setTimeout(() => setProductoAgregado(null), 2000);
  };

  if (loading) return <div className="loading">Cargando productos...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="productos-container">
      <section className="productos-header">
        <h1>🌱 Nuestros Productos</h1>
        <p>Productos frescos y de calidad directamente del huerto a tu puerta</p>
      </section>

      <div className="productos-grid">
        {productos.map((producto) => (
          <div key={producto.id} className="producto-card">
            <div className="producto-imagen">
              <img 
                src={producto.imagen || producto.foto || 'https://via.placeholder.com/250x250?text=' + producto.nombre} 
                alt={producto.nombre} 
              />
              {producto.stock > 0 ? (
                <span className="stock-badge">En Stock</span>
              ) : (
                <span className="stock-badge agotado">Agotado</span>
              )}
            </div>

            <div className="producto-info">
              <h3>{producto.nombre}</h3>
              
              {producto.categoria && (
                <p className="categoria">📂 {producto.categoria}</p>
              )}
              
              <p className="descripcion">{producto.descripcion}</p>
              
              {producto.caracteristicas && (
                <p className="caracteristicas">✨ {producto.caracteristicas}</p>
              )}
              
              <div className="precio-stock">
                <p className="precio">${producto.precio?.toLocaleString('es-CL')}</p>
                {producto.stock && (
                  <p className="stock-info">
                    Stock: <strong>{producto.stock}</strong>
                  </p>
                )}
              </div>

              <button
                className={`btn-agregar ${productoAgregado === producto.id ? 'agregado' : ''} ${producto.stock <= 0 ? 'deshabilitado' : ''}`}
                onClick={() => handleAgregarAlCarrito(producto)}
                disabled={producto.stock <= 0}
              >
                {productoAgregado === producto.id ? '✅ Agregado' : '🛒 Agregar al Carrito'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {productos.length === 0 && (
        <div className="sin-productos">
          <p>No hay productos disponibles en este momento</p>
        </div>
      )}
    </div>
  );
}

export default Productos;