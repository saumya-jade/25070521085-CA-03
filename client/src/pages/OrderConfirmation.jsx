import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api";

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getOrder(id).then((d) => setOrder(d.order)).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="container state-box error">{error}</div>;
  if (!order) return <div className="container state-box">Loading...</div>;

  const payText = order.paymentMethod === "UPI_DEMO" ? "UPI QR (demo payment)" : "Cash on Delivery";

  return (
    <div className="container cart-page">
      <div className="state-box">
        <h1>Order placed 🎉</h1>
        <p>Thank you! Your order number is <strong>{order.orderNumber}</strong>.</p>
        <p>Total: <strong>₹{order.total}</strong> ({payText})</p>
        <p>Status: {order.status}</p>
        <div className="pd-actions" style={{ justifyContent: "center" }}>
          <Link to={`/orders/${order._id}`} className="btn-small">View order</Link>
          <Link to="/orders" className="btn-small">My orders</Link>
          <Link to="/shop" className="btn-small">Continue shopping</Link>
        </div>
      </div>
    </div>
  );
}