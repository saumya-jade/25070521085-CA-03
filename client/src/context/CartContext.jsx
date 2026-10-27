import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { api } from "../services/api";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);
const emptyCart = { items: [], subtotal: 0, itemCount: 0 };

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [cart, setCart] = useState(emptyCart);
  const [wishlist, setWishlist] = useState([]);
  const [alerts, setAlerts] = useState([]);

  const refresh = useCallback(async () => {
    try {
      const [c, w, a] = await Promise.all([api.getCart(), api.getWishlist(), api.getStockAlerts()]);
      setCart(c.cart || emptyCart);
      setWishlist(w.products || []);
      setAlerts(a.alerts || []);
    } catch (err) {
      // silent: pages show their own errors
    }
  }, []);

  useEffect(() => {
    if (user) refresh();
    else {
      setCart(emptyCart);
      setWishlist([]);
      setAlerts([]);
    }
  }, [user, refresh]);

  const addToCart = async (productId, quantity = 1) => {
    const d = await api.addToCart(productId, quantity);
    setCart(d.cart);
  };

  const updateQty = async (productId, quantity) => {
    const d = await api.updateCartItem(productId, quantity);
    setCart(d.cart);
  };

  const removeItem = async (productId) => {
    const d = await api.removeCartItem(productId);
    setCart(d.cart);
  };

  const clearCart = async () => {
    const d = await api.clearCart();
    setCart(d.cart);
  };

  const isWished = (productId) => wishlist.some((p) => p._id === productId);

  const toggleWishlist = async (productId) => {
    const d = isWished(productId)
      ? await api.removeFromWishlist(productId)
      : await api.addToWishlist(productId);
    setWishlist(d.products || []);
  };

  const hasAlert = (productId) => alerts.some((a) => a.product && a.product._id === productId);

  const toggleAlert = async (productId) => {
    const d = hasAlert(productId)
      ? await api.removeStockAlert(productId)
      : await api.addStockAlert(productId);
    setAlerts(d.alerts || []);
  };

  const backInStockCount = alerts.filter((a) => a.backInStock).length;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount: cart.itemCount || 0,
        wishlist,
        alerts,
        backInStockCount,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        isWished,
        toggleWishlist,
        hasAlert,
        toggleAlert,
        refresh,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);