const BASE = "/api";

export const getToken = () => localStorage.getItem("blushbox_token");
export const setToken = (t) => localStorage.setItem("blushbox_token", t);
export const clearToken = () => localStorage.removeItem("blushbox_token");

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("Unable to reach the server. Please try again.");
  }

  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export const api = {
  getProducts: (query = "") => request(`/products${query ? `?${query}` : ""}`),
  getProduct: (id) => request(`/products/${id}`),
  getCategories: (type = "") => request(`/categories${type ? `?type=${type}` : ""}`),
  getFilterOptions: () => request("/products/filters/options"),

  register: (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/auth/me"),

  getCart: () => request("/cart"),
  addToCart: (productId, quantity = 1) =>
    request("/cart/items", { method: "POST", body: JSON.stringify({ productId, quantity }) }),
  updateCartItem: (productId, quantity) =>
    request(`/cart/items/${productId}`, { method: "PUT", body: JSON.stringify({ quantity }) }),
  removeCartItem: (productId) => request(`/cart/items/${productId}`, { method: "DELETE" }),
  clearCart: () => request("/cart", { method: "DELETE" }),

  getWishlist: () => request("/wishlist"),
  addToWishlist: (productId) => request(`/wishlist/${productId}`, { method: "POST" }),
  removeFromWishlist: (productId) => request(`/wishlist/${productId}`, { method: "DELETE" }),

  placeOrder: (shippingAddress, paymentMethod = "COD") =>
    request("/orders", { method: "POST", body: JSON.stringify({ shippingAddress, paymentMethod }) }),
  getOrders: () => request("/orders"),
  getOrder: (id) => request(`/orders/${id}`),

  getStockAlerts: () => request("/stock-alerts"),
  addStockAlert: (productId) => request(`/stock-alerts/${productId}`, { method: "POST" }),
  removeStockAlert: (productId) => request(`/stock-alerts/${productId}`, { method: "DELETE" }),
};