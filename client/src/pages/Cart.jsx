import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const { cart, updateQty, removeItem, clearCart } = useCart();
  const [error, setError] = useState("");

  const run = async (fn) => {
    setError("");
    try {
      await fn();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="container cart-page">
        <h1>Your Cart</h1>
        <div className="state-box">
          <p>Your cart is empty.</p>
          <Link to="/shop" className="btn-small">Continue shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container cart-page">
      <h1>Your Cart</h1>
      {error && <p className="cart-error">{error}</p>}

      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map((it) => {
            const p = it.product;
            return (
              <div className="cart-row" key={p._id}>
                <img src={p.images?.[0] || "/images/hero.jpg"} alt={p.name} />
                <div className="cart-row-info">
                  <Link to={`/product/${p.slug}`}>{p.name}</Link>
                  <span>₹{p.price}</span>
                  {it.outOfStock && <span className="cart-oos">Out of stock - remove to continue</span>}
                </div>
                <div className="pd-qty">
                  <button type="button" disabled={it.outOfStock} onClick={() => it.quantity > 1 && run(() => updateQty(p._id, it.quantity - 1))}>−</button>
                  <span>{it.quantity}</span>
                  <button type="button" disabled={it.outOfStock} onClick={() => run(() => updateQty(p._id, it.quantity + 1))}>+</button>
                </div>
                <div className="cart-line">₹{it.lineTotal}</div>
                <button type="button" className="cart-remove" onClick={() => run(() => removeItem(p._id))}>Remove</button>
              </div>
            );
          })}
          <button type="button" className="btn-small" onClick={() => run(clearCart)}>Clear cart</button>
        </div>

        <aside className="cart-summary">
          <h2>Order Summary</h2>
          <div className="sum-row"><span>Items</span><span>{cart.itemCount}</span></div>
          <div className="sum-row"><span>Subtotal</span><span>₹{cart.subtotal}</span></div>
          <div className="sum-row total"><span>Total</span><span>₹{cart.subtotal}</span></div>
          <p className="sum-note">Shipping and payment options are shown at checkout.</p>
          <Link to="/checkout" className="btn-primary" style={{ display: "block", textAlign: "center", textDecoration: "none" }}>Proceed to Checkout</Link>
        </aside>
      </div>
    </div>
  );
}