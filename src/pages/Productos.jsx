import { useState, useEffect } from 'react';
import productoService from '../services/productoService';
import { useCart } from '../context/useCart';
import styles from '../components/css/Productos.module.css';
import NavBar from '../components/navBar';

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

  if (loading) {
    return (
      <>
        <NavBar />
        <div className={styles.loading}>Cargando productos...</div>
      </>
    );
  }
  
  if (error) {
    return (
      <>
        <NavBar />
        <div className={styles.error}>{error}</div>
      </>
    );
  }

  return (
    <>
      <NavBar />
      <div className={styles.productosContainer}>
      {/* Header */}
      <section className={styles.productosHeader}>
        <h1>🌱 Nuestros Productos</h1>
        <p>Productos frescos y de calidad directamente del huerto a tu puerta</p>
      </section>

    
      {/* Grid de Productos */}
      <div className={styles.productosGrid}>
        {productos.map((producto) => (
          <div key={producto.id} className={styles.productoCard}>
            {/* Imagen */}
            <div className={styles.productoImagen}>
              <img 
                src={
                  producto.imagen || 
                  producto.foto || 
                  `https://via.placeholder.com/250x250?text=${encodeURIComponent(producto.nombre)}`
                } 
                alt={producto.nombre} 
              />
              {producto.stock > 0 ? (
                <span className={styles.stockBadge}>En Stock</span>
              ) : (
                <span className={`${styles.stockBadge} ${styles.agotado}`}>Agotado</span>
              )}
            </div>

            {/* Información del Producto */}
            <div className={styles.productoInfo}>
              <h3>{producto.nombre}</h3>
              
              {producto.categoria && (
                <p className={styles.categoria}>📂 {producto.categoria}</p>
              )}
              
              <p className={styles.descripcion}>{producto.descripcion}</p>
              
              {producto.caracteristicas && (
                <p className={styles.caracteristicas}>✨ {producto.caracteristicas}</p>
              )}
              
              {/* Precio y Stock */}
              <div className={styles.precioStock}>
                <p className={styles.precio}>
                  ${producto.precio?.toLocaleString('es-CL')}
                </p>
                {producto.stock !== undefined && producto.stock !== null && (
                  <p className={styles.stockInfo}>
                    Stock: <strong>{producto.stock}</strong>
                  </p>
                )}
              </div>

              {/* Botón Agregar al Carrito */}
              <button
                className={`
                  ${styles.btnAgregar} 
                  ${productoAgregado === producto.id ? styles.agregado : ''} 
                  ${producto.stock <= 0 ? styles.deshabilitado : ''}
                `.trim()}
                onClick={() => handleAgregarAlCarrito(producto)}
                disabled={producto.stock <= 0}
              >
                {productoAgregado === producto.id 
                  ? '✅ Agregado' 
                  : '🛒 Agregar al Carrito'
                }
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mensaje cuando no hay productos */}
      {productos.length === 0 && (
        <div className={styles.sinProductos}>
          <p>No hay productos disponibles en este momento</p>
        </div>
      )}
      </div>
    </>
  );
}

export default Productos;
