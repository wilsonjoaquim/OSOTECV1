import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AppContext = createContext();
const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

export function AppProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("osotec_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const [filters, setFilters] = useState({
    category: "", search: "", minPrice: 0, maxPrice: 9999999, brand: "", condition: "",
  });

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("osotec_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    localStorage.setItem("osotec_cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const exists = prev.find((i) => i._id === product._id);
      if (exists) return prev.map((i) => i._id === product._id ? { ...i, qty: i.qty + qty } : i);
      return [...prev, { ...product, qty }];
    });
  };

  const removeFromCart = (id) => setCart((prev) => prev.filter((i) => i._id !== id));
  const updateQty = (id, qty) => { if (qty < 1) return removeFromCart(id); setCart((prev) => prev.map((i) => i._id === id ? { ...i, qty } : i)); };
  const clearCart = () => setCart([]);
  const cartCount = cart.reduce((acc, i) => acc + i.qty, 0);
  const cartTotal = cart.reduce((acc, i) => acc + i.price * i.qty, 0);

  const login = async (email, password) => {
    const { data } = await axios.post(`${API}/api/auth/login`, { email, password });
    localStorage.setItem("osotec_user", JSON.stringify(data.user));
    localStorage.setItem("osotec_token", data.token);
    setUser(data.user);
    return data;
  };

  const register = async (name, email, phone, password) => {
    const { data } = await axios.post(`${API}/api/auth/register`, { name, email, phone, password });
    localStorage.setItem("osotec_user", JSON.stringify(data.user));
    localStorage.setItem("osotec_token", data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("osotec_user");
    localStorage.removeItem("osotec_token");
    setUser(null);
  };

  const getAuthHeader = () => ({
    Authorization: `Bearer ${localStorage.getItem("osotec_token")}`,
  });

  return (
    <AppContext.Provider value={{
      cart, addToCart, removeFromCart, updateQty, clearCart,
      cartCount, cartTotal,
      filters, setFilters,
      notifications, setNotifications,
      user, login, register, logout, getAuthHeader,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);