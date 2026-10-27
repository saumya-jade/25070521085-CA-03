import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";

const summary = (items) => {
  if (!items || items.length === 0) return "Order";
  const first = items[0].name;
  return items.length > 1 ? `${first} + ${items.length - 1} more` : first;
};

export default function Orders() {
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getOrders().then((d) => setOrders(d.orders)).catch((e) => setError(e.message));
  }, []);

  if (error) return <div className="container state-box error">{error}</div>;
  if (!orders) return <div className="container state-box">Loading orders...</div>;

  return (
    <div className="container cart-page">
      <h1>My Orders</h1>
      {orders.length === 0 ? (
        <div className="state-box">
          <p>You have not placed any orders yet.</p>
          <Link to="/shop" className="btn-small">Browse gifts</Link>
        </div>
      ) : (
        orders.map((o) => (
          <Link to={`/orders/${o._id}`} className="order-row" key={o._id}>
            <div>
              <strong>{summary(o.items)}</strong>
              <span>Order {o.orderNumber} · {new Date(o.createdAt).toLocaleDateString("en-IN")}</span>
            </div>
            <div>{o.items.length} item(s)</div>
            <div>₹{o.total}</div>
            <div className="order-status">{o.status}</div>
          </Link>
        ))
      )}
    </div>
  );
}