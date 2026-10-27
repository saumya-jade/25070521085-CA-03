import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function Alerts() {
  const { alerts, refresh, toggleAlert } = useCart();

  useEffect(() => {
    refresh();
  }, [refresh]);

  const remove = async (productId) => {
    try {
      await toggleAlert(productId);
    } catch (err) {
      // ignore
    }
  };

  return (
    <div className="container cart-page">
      <h1>Stock Alerts</h1>
      <p className="alert-note">
        Reminders are shown here inside the app. We do not send email or SMS.
      </p>

      {alerts.length === 0 ? (
        <div className="state-box">
          <p>You have no stock reminders.</p>
          <Link to="/shop" className="btn-small">Browse gifts</Link>
        </div>
      ) : (
        alerts.map((a) => (
          <div className="alert-item" key={a._id}>
            <img src={a.product.images?.[0] || "/images/hero.jpg"} alt={a.product.name} />
            <div className="alert-item-info">
              <strong>{a.product.name}</strong>
              <span>₹{a.product.price}</span>
              <span className={a.backInStock ? "alert-badge back" : "alert-badge wait"}>
                {a.backInStock ? "Back in stock!" : "Waiting for stock"}
              </span>
            </div>
            <div className="alert-item-actions">
              {a.backInStock && (
                <Link to={`/product/${a.product.slug || a.product._id}`} className="btn-small">View product</Link>
              )}
              <button type="button" className="btn-outline" onClick={() => remove(a.product._id)}>Remove</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}