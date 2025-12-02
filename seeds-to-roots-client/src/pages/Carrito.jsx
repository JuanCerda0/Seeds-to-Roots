import React, { useState } from 'react';
import { useCart } from '../context/useCart';
import NavBar from '../components/navBar';
import '../components/css/Carrito.css';

const Carrito = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const [cupón, setCupón] = useState('');
  const [descuento, setDescuento] = useState(0);
  const [cuponAplicado, setCuponAplicado] = useState(false);

  // Códigos de cupón válidos (simulado)
  const cupónesValidos = {
    'DESCUENTO10': 0.1,
    'DESCUENTO20': 0.2,
    'ENVIOGRATIS': 0.05
  };

  // Calcular totales de forma más segura
  const subtotal = cartItems.reduce((sum, item) => {
    const precio = Number(item.precio) || 0;
    const cantidad = Number(item.cantidad) || 0;
    return sum + (precio * cantidad);
  }, 0);
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
    if (globalThis.confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
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
    <div className="carrito-container">
      <NavBar />
      <section className="carrito-header">
        <h1>🛒 Tu carrito 🛒</h1>
        <p>{cartItems.length} producto{cartItems.length !== 1 ? 's' : ''} en el carrito</p>
      </section>

      <div className="carrito-content">
        {/* Tabla de productos */}
        <section className="carrito-items">
          {cartItems.length > 0 ? (
            <>
              <table className="items-table">
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
                    <tr key={item.id} className="item-row">
                      <td className="item-producto">
                        <img 
                          src={item.imagen || item.foto || 'https://via.placeholder.com/80x80?text=' + item.nombre} 
                          alt={item.nombre} 
                        />
                        <div>
                          <h4>{item.nombre}</h4>
                          <span className="stock-info">Stock: {item.stock}</span>
                        </div>
                      </td>
                      <td className="item-precio">${(item.precio || 0).toLocaleString('es-CL')}</td>
                      <td className="item-cantidad">
                        <div className="cantidad-control">
                          <button
                            className="btn-qty"
                            onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                            disabled={item.cantidad <= 1}
                          >
                            −
                          </button>
                          <input
                            type="number"
                            value={item.cantidad}
                            onChange={(e) =>
                              updateQuantity(item.id, Number.parseInt(e.target.value) || 1)
                            }
                            min="1"
                            max={item.stock}
                          />
                          <button
                            className="btn-qty"
                            onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                            disabled={item.cantidad >= item.stock}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="item-subtotal">
                        ${((item.precio || 0) * (item.cantidad || 0)).toLocaleString('es-CL')}
                      </td>
                      <td className="item-acciones">
                        <button
                          className="btn-eliminar"
                          onClick={() => removeFromCart(item.id)}
                          title="Eliminar producto"
                          aria-label="Eliminar producto"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button className="btn-vaciar" onClick={vaciarCarrito}>
                Vaciar Carrito
              </button>
            </>
          ) : (
            <div className="carrito-vacio">
              <h2>Tu carrito está vacío 😢</h2>
              <p>Comienza a comprar nuestros productos frescos</p>
              <a href="/productos" className="btn-volver">
                Ir a Productos
              </a>
            </div>
          )}
        </section>

        {/* Resumen y opciones de pago */}
        {cartItems.length > 0 && (
          <section className="carrito-resumen">
            {/* Cupones */}
            <div className="seccion-cupon">
              <h3>Aplicar Cupón</h3>
              <div className="cupon-input">
                <input
                  type="text"
                  placeholder="Ingresa tu código de cupón"
                  value={cupón}
                  onChange={(e) => setCupón(e.target.value.toUpperCase())}
                  disabled={cuponAplicado}
                />
                {!cuponAplicado ? (
                  <button className="btn-aplicar" onClick={aplicarCupón}>
                    Aplicar
                  </button>
                ) : (
                  <button className="btn-limpiar" onClick={limpiarCupón}>
                    Limpiar
                  </button>
                )}
              </div>
              {cuponAplicado && (
                <div className="cupon-exito">
                  ✅ Cupón "{cupón}" aplicado correctamente
                </div>
              )}
              <p className="cupones-info">
                Códigos disponibles: DESCUENTO10, DESCUENTO20, ENVIOGRATIS
              </p>
            </div>

            {/* Resumen de precios */}
            <div className="resumen-precios">
              <h3>Resumen de Compra</h3>
              
              <div className="precio-line">
                <span>Subtotal:</span>
                <span>${subtotal.toLocaleString('es-CL')}</span>
              </div>

              {descuento > 0 && (
                <div className="precio-line descuento">
                  <span>Descuento ({(descuento * 100).toFixed(0)}%):</span>
                  <span>-${descuentoMonto.toLocaleString('es-CL')}</span>
                </div>
              )}

              <div className="precio-line">
                <span>Envío:</span>
                <span className={envio === 0 ? 'gratis' : ''}>
                  {envio === 0 ? 'GRATIS' : `$${envio.toLocaleString('es-CL')}`}
                </span>
              </div>

              {subtotal > 50000 && (
                <p className="info-envio">🎉 ¡Envío gratis por compra mayor a $50.000!</p>
              )}

              <div className="precio-total">
                <span>Total:</span>
                <span>${total.toLocaleString('es-CL')}</span>
              </div>
            </div>

            {/* Opciones de pago */}
            <div className="opciones-pago">
              <h3>Método de Pago</h3>
              <div className="metodos">
                <label className="metodo-option">
                  <input type="radio" name="pago" value="tarjeta" defaultChecked />
                  💳 Tarjeta de Crédito/Débito
                </label>
                <label className="metodo-option">
                  <input type="radio" name="pago" value="transferencia" />
                  🏦 Transferencia Bancaria
                </label>
                <label className="metodo-option">
                  <input type="radio" name="pago" value="efectivo" />
                  💵 Efectivo contra Entrega
                </label>
              </div>
            </div>

            {/* Botón de checkout */}
            <button className="btn-checkout" onClick={procesoCheckout}>
              Proceder al Pago
            </button>

            {/* Opciones adicionales */}
            <div className="opciones-adicionales">
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
