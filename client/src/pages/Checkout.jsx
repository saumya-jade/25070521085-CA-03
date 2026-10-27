import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import { api } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const FREE_SHIPPING_ABOVE = 999;
const SHIPPING_FEE = 49;

export default function Checkout() {
  const { user } = useAuth();
  const { cart, refresh } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: user?.name || "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const items = cart.items.filter((i) => !i.outOfStock);
  const hasOut = cart.items.some((i) => i.outOfStock);
  const shipping = cart.subtotal >= FREE_SHIPPING_ABOVE || cart.subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = cart.subtotal + shipping;

  if (cart.items.length === 0) {
    return (
      <div className="container cart-page">
        <h1>Checkout</h1>
        <div className="state-box">
          <p>Your cart is empty.</p>
          <Link to="/shop" className="btn-small">Continue shopping</Link>
        </div>
      </div>
    );
  }

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (hasOut) return setError("Please remove out-of-stock items from your cart first.");
    setPlacing(true);
    try {
      const d = await api.placeOrder(form, paymentMethod);
      await refresh();
      navigate(`/order-confirmation/${d.order._id}`);
    } catch (err) {
      setError(err.message || "Could not place order.");
    } finally {
      setPlacing(false);
    }
  };

  const qrText = `BlushBox DEMO payment only - amount Rs ${total} - not a real payment`;

  return (
    <div className="container cart-page">
      <h1>Checkout</h1>
      {error && <p className="cart-error">{error}</p>}

      <form className="cart-layout" onSubmit={submit}>
        <div className="checkout-form">
          <h2>Delivery Address</h2>
          <div className="form-grid">
            <label>Full name
              <input name="fullName" value={form.fullName} onChange={change} required />
            </label>
            <label>Mobile number
              <input name="phone" value={form.phone} onChange={change} maxLength={10} placeholder="10-digit number" required />
            </label>
            <label className="span2">Address line 1
              <input name="line1" value={form.line1} onChange={change} required />
            </label>
            <label className="span2">Address line 2 (optional)
              <input name="line2" value={form.line2} onChange={change} />
            </label>
            <label>City
              <input name="city" value={form.city} onChange={change} required />
            </label>
            <label>State
              <input name="state" value={form.state} onChange={change} required />
            </label>
            <label>Pincode
              <input name="pincode" value={form.pincode} onChange={change} maxLength={6} placeholder="6-digit pincode" required />
            </label>
          </div>

          <h2>Payment</h2>
          <div className="pay-box" style={{ marginBottom: 12 }}>
            <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "COD"}
                onChange={() => setPaymentMethod("COD")}
              />
              Cash on Delivery
            </label>
            <p>Pay in cash when your order arrives.</p>
          </div>

          <div className="pay-box">
            <label style={{ display: "flex", gap: 8, alignItems: "center", cursor: "pointer" }}>
              <input
                type="radio"
                name="payment"
                checked={paymentMethod === "UPI_DEMO"}
                onChange={() => setPaymentMethod("UPI_DEMO")}
              />
              UPI QR (Demo)
            </label>
            {paymentMethod === "UPI_DEMO" && (
              <div style={{ textAlign: "center", marginTop: 12 }}>
                <div style={{ background: "#fff", display: "inline-block", padding: 12, borderRadius: 12 }}>
                  <QRCodeSVG value={qrText} size={160} />
                </div>
                <p><strong>Demo payment only.</strong> This QR is not a real UPI payment and no money is taken.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="cart-summary">
          <h2>Order Summary</h2>
          {items.map((it) => (
            <div className="sum-row" key={it.product._id}>
              <span>{it.product.name} × {it.quantity}</span>
              <span>₹{it.lineTotal}</span>
            </div>
          ))}
          <div className="sum-row"><span>Subtotal</span><span>₹{cart.subtotal}</span></div>
          <div className="sum-row"><span>Shipping</span><span>{shipping === 0 ? "Free" : `₹${shipping}`}</span></div>
          <div className="sum-row total"><span>Total</span><span>₹{total}</span></div>
          <p className="sum-note">Free shipping above ₹{FREE_SHIPPING_ABOVE}. Final price is confirmed by the server.</p>
          <button type="submit" className="btn-primary" disabled={placing}>
            {placing
              ? "Placing order..."
              : paymentMethod === "UPI_DEMO" ? "Place Order (UPI Demo)" : "Place Order (COD)"}
          </button>
        </aside>
      </form>
    </div>
  );
}