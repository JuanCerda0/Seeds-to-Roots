import React, { useState } from 'react';
import { useCart } from '../context/useCart';
import styles from '../components/css/Carrito.module.css';

const Carrito = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [cupón, setCupón] = useState('');
  const [descuento, setDescuento] = useState(0);
  const [cuponAplicado, setCuponAplicado] = useState(false);

  // Códigos de cupón válidos (simulado)
  const cupónesValidos = {
    'DESCUENTO10': 0.10,
    'DESCUENTO20': 0.20,
    'ENVIOGRATIS': 0.05
  };

  // Calcular totales
  const subtotal = cartItems.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  const descuentoMonto = subtotal * descuento;
  const envio = subtotal > 50000 ? 0 : 5000;
  const total = subtotal - descuentoMonto + envio;

  // Aplicar cupón
  const aplicarCupón = () => {
    if (!cupón.trim()) {
      alert('Ingresa un código de cupón');
      return;
    }

    if (cupónesValidos[cupón.toUpperCase()]) {
      setDescuento(cupónesValidos[cupón.toUpperCase()]);
      setCuponAplicado(true);
      alert(`✅ Cupón aplicado: ${(cupónesValidos[cupón.toUpperCase()] * 100).toFixed(0)}% de descuento`);
    } else {
      alert('❌ Cupón no válido');
      setDescuento(0);
      setCuponAplicado(false);
    }
  };

  // Limpiar cupón
  const limpiarCupón = () => {
    setCupón('');
    setDescuento(0);
    setCuponAplicado(false);
  };

  // Vaciar carrito
  const vaciarCarrito = () => {
    if (window.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
      clearCart();
      limpiarCupón();
    }
  };

  // Proceder al checkout
  const procesoCheckout = () => {
    if (cartItems.length === 0) {
      alert('El carrito está vacío');
      return;
    }
    alert(`Procesando compra por $${total.toLocaleString('es-CL')}`);
  };

  return (
    <div className={styles.carritoContainer}>
      {/* Header */}
      <section className={styles.carritoHeader}>
        <h1>🛒 Tu carrito 🛒</h1>
        <p>{cartItems.length} producto{cartItems.length !== 1 ? 's' : ''} en el carrito</p>
      </section>

      {/* Navegación - Estilo Header Verde */}
      <section className={styles.navBar}>
        <nav>
          <ul>
            <li><a href="/">Inicio</a></li>
            <li><a href="/productos">Productos</a></li>
            <li><a href="/blog">Blog</a></li>
            <li><a href="/carrito">Carrito</a></li>
          </ul>
        </nav>
      </section>

      <div className={styles.carritoContent}>
        {/* Tabla de productos */}
        <section className={styles.carritoItems}>
          {cartItems.length > 0 ? (
            <>
              <table className={styles.itemsTable}>
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio Unitario</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.id} className={styles.itemRow}>
                      <td className={styles.itemProducto}>
                        <img 
                          src={item.imagen || `https://via.placeholder.com/70?text=${encodeURIComponent(item.nombre)}`} 
                          alt={item.nombre} 
                        />
                        <div>
                          <h4>{item.nombre}</h4>
                          <span className={styles.stockInfo}>Stock: {item.stock}</span>
                        </div>
                      </td>
                      <td className={styles.itemPrecio}>
                        ${item.precio.toLocaleString('es-CL')}
                      </td>
                      <td className={styles.itemCantidad}>
                        <div className={styles.cantidadControl}>
                          <button
                            className={styles.btnQty}
                            onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                            disabled={item.cantidad <= 1}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={item.cantidad}
                            onChange={(e) =>
                              updateQuantity(item.id, parseInt(e.target.value) || 1)
                            }
                            min="1"
                            max={item.stock}
                          />
                          <button
                            className={styles.btnQty}
                            onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                            disabled={item.cantidad >= item.stock}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className={styles.itemSubtotal}>
                        ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                      </td>
                      <td className={styles.itemAcciones}>
                        <button
                          className={styles.btnEliminar}
                          onClick={() => removeFromCart(item.id)}
                          title="Eliminar producto"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button className={styles.btnVaciar} onClick={vaciarCarrito}>
                Vaciar Carrito
              </button>
            </>
          ) : (
            <div className={styles.carritoVacio}>
              <h2>Tu carrito está vacío 😢</h2>
              <p>Comienza a comprar nuestros productos frescos</p>
              <a href="/productos" className={styles.btnVolver}>
                Ir a Productos
              </a>
            </div>
          )}
        </section>

        {/* Resumen y opciones de pago */}
        {cartItems.length > 0 && (
          <section className={styles.carritoResumen}>
            {/* Cupones */}
            <div className={styles.seccionCupon}>
              <h3>Aplicar Cupón</h3>
              <div className={styles.cuponInput}>
                <input
                  type="text"
                  placeholder="Ingresa tu código de cupón"
                  value={cupón}
                  onChange={(e) => setCupón(e.target.value.toUpperCase())}
                  disabled={cuponAplicado}
                />
                {!cuponAplicado ? (
                  <button className={styles.btnAplicar} onClick={aplicarCupón}>
                    Aplicar
                  </button>
                ) : (
                  <button className={styles.btnLimpiar} onClick={limpiarCupón}>
                    Limpiar
                  </button>
                )}
              </div>
              {cuponAplicado && (
                <div className={styles.cuponExito}>
                  ✅ Cupón "{cupón}" aplicado correctamente
                </div>
              )}
              <p className={styles.cuponesInfo}>
                Códigos disponibles: DESCUENTO10, DESCUENTO20, ENVIOGRATIS
              </p>
            </div>

            {/* Resumen de precios */}
            <div className={styles.resumenPrecios}>
              <h3>Resumen de Compra</h3>
              
              <div className={styles.precioLine}>
                <span>Subtotal:</span>
                <span>${subtotal.toLocaleString('es-CL')}</span>
              </div>

              {descuento > 0 && (
                <div className={`${styles.precioLine} ${styles.descuento}`}>
                  <span>Descuento ({(descuento * 100).toFixed(0)}%):</span>
                  <span>-${descuentoMonto.toLocaleString('es-CL')}</span>
                </div>
              )}

              <div className={styles.precioLine}>
                <span>Envío:</span>
                <span className={envio === 0 ? styles.gratis : ''}>
                  {envio === 0 ? 'GRATIS' : `$${envio.toLocaleString('es-CL')}`}
                </span>
              </div>

              {subtotal > 50000 && (
                <p className={styles.infoEnvio}>
                  🎉 ¡Envío gratis por compra mayor a $50.000!
                </p>
              )}

              <div className={styles.precioTotal}>
                <span>Total:</span>
                <span>${total.toLocaleString('es-CL')}</span>
              </div>
            </div>

            {/* Opciones de pago */}
            <div className={styles.opcionesPago}>
              <h3>Método de Pago</h3>
              <div className={styles.metodos}>
                <label className={styles.metodoOption}>
                  <input type="radio" name="pago" value="tarjeta" defaultChecked />
                  <span>💳 Tarjeta de Crédito/Débito</span>
                </label>
                <label className={styles.metodoOption}>
                  <input type="radio" name="pago" value="transferencia" />
                  <span>🏦 Transferencia Bancaria</span>
                </label>
                <label className={styles.metodoOption}>
                  <input type="radio" name="pago" value="efectivo" />
                  <span>💵 Efectivo contra Entrega</span>
                </label>
              </div>
            </div>

            {/* Botón de checkout */}
            <button className={styles.btnCheckout} onClick={procesoCheckout}>
              Proceder al Pago
            </button>

            {/* Opciones adicionales */}
            <div className={styles.opcionesAdicionales}>
              <label>
                <input type="checkbox" />
                <span>Deseo recibir ofertas y promociones por email</span>
              </label>
              <label>
                <input type="checkbox" defaultChecked />
                <span>Acepto los términos y condiciones</span>
              </label>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Carrito;