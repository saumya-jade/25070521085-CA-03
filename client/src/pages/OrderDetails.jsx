import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api";

const STEPS = ["Placed", "Confirmed", "Packed", "Shipped", "Delivered"];

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getOrder(id).then((d) => setOrder(d.order)).catch((e) => setError(e.message));
  }, [id]);

  if (error) return <div className="container state-box error">{error}</div>;
  if (!order) return <div className="container state-box">Loading...</div>;

  const a = order.shippingAddress;
  const stepIndex = STEPS.indexOf(order.status);
  const isUpi = order.paymentMethod === "UPI_DEMO";

  return (
    <div className="container cart-page">
      <h1>Order {order.orderNumber}</h1>
      <p>Placed on {new Date(order.createdAt).toLocaleString("en-IN")}</p>

      {order.status === "Cancelled" ? (
        <p className="cart-error">This order was cancelled.</p>
      ) : (
        <div className="status-track">
          {STEPS.map((s, i) => (
            <span key={s} className={i <= stepIndex ? "done" : ""}>{s}</span>
          ))}
        </div>
      )}

      <div className="cart-layout">
        <div className="cart-items">
          {order.items.map((it) => (
            <div className="cart-row" key={it.product}>
              <img src={it.image || "/images/hero.jpg"} alt={it.name} />
              <div className="cart-row-info">
                <span>{it.name}</span>
                <span>₹{it.price} × {it.quantity}</span>
              </div>
              <span />
              <div className="cart-line">₹{it.price * it.quantity}</div>
              <span />
            </div>
          ))}
        </div>

        <aside className="cart-summary">
          <h2>Delivery Address</h2>
          <p>{a.fullName}<br />{a.line1}{a.line2 ? `, ${a.line2}` : ""}<br />{a.city}, {a.state} - {a.pincode}<br />Phone: {a.phone}</p>
          <h2>Payment</h2>
          <p>
            {isUpi ? "UPI QR (Demo)" : "Cash on Delivery"}
            {order.paymentStatus ? ` · ${order.paymentStatus}` : ""}
          </p>
          {isUpi && <p>Demo payment only. No real money was taken.</p>}
          <div className="sum-row"><span>Subtotal</span><span>₹{order.itemsTotal}</span></div>
          <div className="sum-row"><span>Shipping</span><span>{order.shippingFee === 0 ? "Free" : `₹${order.shippingFee}`}</span></div>
          <div className="sum-row total"><span>Total</span><span>₹{order.total}</span></div>
        </aside>
      </div>
      <p><Link to="/orders">← Back to my orders</Link></p>
    </div>
  );
}