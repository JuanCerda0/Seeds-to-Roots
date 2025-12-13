import React, { createContext, useState, useCallback, useMemo } from 'react';

// Crear el contexto
export const CartContext = createContext(undefined);

// Proveedor del carrito
export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);

  // Agregar producto al carrito
  const addToCart = useCallback((producto) => {
    setCartItems((prevItems) => {
      // Verificar si el producto ya existe en el carrito
      const existingItem = prevItems.find((item) => item.id === producto.id);

      if (existingItem) {
        // Si existe, incrementar la cantidad
        return prevItems.map((item) =>
          item.id === producto.id
            ? {
                ...item,
                cantidad: Math.min(item.cantidad + 1, item.stock || 999),
              }
            : item
        );
      }
      // Si no existe, agregarlo con cantidad 1
      return [
        ...prevItems,
        {
          ...producto,
          cantidad: 1,
          // Asegurar que tenga las propiedades necesarias
          imagen: producto.imagen || producto.foto || 'https://via.placeholder.com/100x100?text=Producto',
          stock: producto.stock || 999,
        },
      ];
    });
  }, []);

  // Actualizar cantidad de un producto
  const updateQuantity = useCallback((id, cantidad) => {
    if (cantidad <= 0) return;

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, cantidad: Math.min(cantidad, item.stock || 999) }
          : item
      )
    );
  }, []);

  // Eliminar producto del carrito
  const removeFromCart = useCallback((id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);

  // Vaciar carrito
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Calcular totales - sin cartItems en dependencias para evitar ciclo infinito
  const calculateTotals = useCallback(() => {
    return (items) => {
      const subtotal = items.reduce(
        (sum, item) => sum + (item.precio || 0) * (item.cantidad || 0),
        0
      );
      return { subtotal, itemCount: items.length };
    };
  }, []);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    calculateTotals,
    cartCount: cartItems.length,
  }), [cartItems, addToCart, updateQuantity, removeFromCart, clearCart, calculateTotals]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}
