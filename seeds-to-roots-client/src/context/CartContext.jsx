import React, {
  createContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';
import carritoService from '../services/carritoService';
import authService from '../services/authService';

export const CartContext = createContext(undefined);

const mapBackendItems = (items = []) =>
  items.map((item) => ({
    id: item.productoId,
    nombre: item.productoNombre,
    imagen:
      item.productoImagen ||
      'https://via.placeholder.com/100x100?text=Producto',
    precio: Number(item.precioUnitario ?? 0),
    cantidad: item.cantidad ?? 0,
    stock: 999,
    subtotal: Number(item.subtotal ?? 0),
  }));

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(() =>
    authService.getUserIdFromToken() || null
  );
  const [syncing, setSyncing] = useState(false);

  const updateFromResponse = useCallback((response) => {
    if (response?.items) {
      setCartItems(mapBackendItems(response.items));
    }
  }, []);

  const loadCartFromServer = useCallback(async () => {
    if (!userId) return;
    setSyncing(true);
    try {
      const response = await carritoService.get(userId);
      updateFromResponse(response);
    } catch (error) {
      console.error('Error al cargar carrito:', error);
    } finally {
      setSyncing(false);
    }
  }, [updateFromResponse, userId]);

  useEffect(() => {
    loadCartFromServer();
  }, [loadCartFromServer]);

  const refreshAuthUser = useCallback(() => {
    const nextUserId = authService.getUserIdFromToken() || null;
    setUserId(nextUserId);
    if (!nextUserId) {
      setCartItems([]);
    }
  }, []);

  useEffect(() => {
    refreshAuthUser();

    if (typeof window !== 'undefined') {
      window.addEventListener('auth-change', refreshAuthUser);
      window.addEventListener('storage', refreshAuthUser);
      return () => {
        window.removeEventListener('auth-change', refreshAuthUser);
        window.removeEventListener('storage', refreshAuthUser);
      };
    }
    return undefined;
  }, [refreshAuthUser]);

  const tryPersist = useCallback(
    async (operation) => {
      if (!userId) return false;
      try {
        const response = await operation();
        updateFromResponse(response);
        return true;
      } catch (error) {
        console.error('Error al sincronizar carrito:', error);
        return false;
      }
    },
    [updateFromResponse, userId]
  );

  const addToCart = useCallback(
    async (producto) => {
      const persisted = await tryPersist(() =>
        carritoService.add(userId, {
          productoId: producto.id,
          cantidad: 1,
        })
      );
      if (persisted) return;

      setCartItems((prevItems) => {
        const existingItem = prevItems.find((item) => item.id === producto.id);
        if (existingItem) {
          return prevItems.map((item) =>
            item.id === producto.id
              ? {
                  ...item,
                  cantidad: Math.min(item.cantidad + 1, item.stock || 999),
                }
              : item
          );
        }

        return [
          ...prevItems,
          {
            ...producto,
            cantidad: 1,
            imagen:
              producto.imagen ||
              producto.foto ||
              'https://via.placeholder.com/100x100?text=Producto',
            stock: producto.stock || 999,
          },
        ];
      });
    },
    [tryPersist, userId]
  );

  const updateQuantity = useCallback(
    async (id, cantidad) => {
      if (cantidad <= 0) return;

      const persisted = await tryPersist(() =>
        carritoService.update(userId, { productoId: id, cantidad })
      );
      if (persisted) return;

      setCartItems((prevItems) =>
        prevItems.map((item) =>
          item.id === id
            ? { ...item, cantidad: Math.min(cantidad, item.stock || 999) }
            : item
        )
      );
    },
    [tryPersist, userId]
  );

  const removeFromCart = useCallback(
    async (id) => {
      const persisted = await tryPersist(() =>
        carritoService.remove(userId, id)
      );
      if (persisted) return;

      setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
    },
    [tryPersist, userId]
  );

  const clearCart = useCallback(async () => {
    if (userId) {
      try {
        await carritoService.clear(userId);
        setCartItems([]);
        return;
      } catch (error) {
        console.error('Error al vaciar carrito:', error);
      }
    }
    setCartItems([]);
  }, [userId]);

  const calculateTotals = useCallback(
    () => (items) => {
      const subtotal = items.reduce(
        (sum, item) => sum + (item.precio || 0) * (item.cantidad || 0),
        0
      );
      return { subtotal, itemCount: items.length };
    },
    []
  );

  const value = useMemo(
    () => ({
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      calculateTotals,
      cartCount: cartItems.reduce(
        (sum, item) => sum + (item.cantidad || 0),
        0
      ),
      isPersisted: Boolean(userId),
      syncing,
    }),
    [
      cartItems,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      calculateTotals,
      userId,
      syncing,
    ]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}
