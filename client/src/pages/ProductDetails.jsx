import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { api } from "../services/api";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const params = useParams();
  const idOrSlug = params.slug || params.id || params.idOrSlug;
  const { addToCart, isWished, toggleWishlist, hasAlert, toggleAlert } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("ok");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    setQty(1);
    setActiveImg(0);
    api
      .getProduct(idOrSlug)
      .then((res) => {
        if (cancelled) return;
        setProduct(res?.product || res?.data || res);
      })
      .catch((err) => !cancelled && setError(err.message || "Product not found."))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [idOrSlug]);

  if (loading) return <div className="container state-box">Loading product...</div>;

  if (error || !product)
    return (
      <div className="container state-box error">
        <p>{error || "Product not found."}</p>
        <Link to="/shop" className="btn-small">Back to shop</Link>
      </div>
    );

  const images = product.images?.length ? product.images : ["/images/hero.jpg"];
  const inStock = product.stock > 0;
  const maxQty = Math.min(product.stock || 1, 10);
  const wished = isWished(product._id);
  const reminded = hasAlert(product._id);

  const showNotice = (text, type = "ok") => {
    setNotice(text);
    setNoticeType(type);
    setTimeout(() => setNotice(""), 4000);
  };

  const handleAdd = async () => {
    try {
      await addToCart(product._id, qty);
      showNotice("Added to cart ✓", "ok");
    } catch (err) {
      showNotice(err.message || "Could not add to cart.", "err");
    }
  };

  const handleWish = async () => {
    try {
      await toggleWishlist(product._id);
      showNotice(wished ? "Removed from wishlist." : "Saved to wishlist ♥", "ok");
    } catch (err) {
      showNotice(err.message || "Could not update wishlist.", "err");
    }
  };

  const handleRemind = async () => {
    try {
      await toggleAlert(product._id);
      showNotice(
        reminded ? "Reminder removed." : "Done! We will remind you on the Alerts page when it is back.",
        "ok"
      );
    } catch (err) {
      showNotice(err.message || "Could not update reminder.", "err");
    }
  };

  return (
    <div className="container pd-page">
      <nav className="pd-crumbs">
        <Link to="/">Home</Link> / <Link to="/shop">Shop</Link> / <span>{product.name}</span>
      </nav>

      <div className="pd-layout">
        <div className="pd-gallery">
          <img className="pd-main-img" src={images[activeImg]} alt={product.name} />
          {images.length > 1 && (
            <div className="pd-thumbs">
              {images.map((src, i) => (
                <img key={src + i} src={src} alt="" className={i === activeImg ? "active" : ""} onClick={() => setActiveImg(i)} />
              ))}
            </div>
          )}
        </div>

        <div className="pd-info">
          {product.isMysteryJar && <span className="pd-tag">Mystery Jar</span>}
          <h1>{product.name}</h1>
          <div className="pd-rating">
            ★ {product.rating || 0} <span>({product.numReviews || 0} reviews)</span>
          </div>
          <div className="pd-price">₹{product.price}</div>

          <p className="pd-desc">{product.description}</p>

          <ul className="pd-meta">
            {product.colour && (<li><strong>Colour:</strong> {product.colour}</li>)}
            {product.isMysteryJar && product.approxItems && (
              <li><strong>Approx items:</strong> {product.approxItems} (contents are a surprise)</li>
            )}
            {product.isMysteryJar && product.jarSize && (<li><strong>Jar size:</strong> {product.jarSize}</li>)}
            {product.isPersonalizable && (<li><strong>Personalization:</strong> Available</li>)}
          </ul>

          <p className={inStock ? "pd-stock ok" : "pd-stock out"}>
            {!inStock ? "Out of stock" : product.stock <= 5 ? `Only ${product.stock} left` : "In stock"}
          </p>

          {inStock && (
            <div className="pd-qty">
              <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))}>−</button>
              <span>{qty}</span>
              <button type="button" onClick={() => setQty((q) => Math.min(maxQty, q + 1))}>+</button>
            </div>
          )}

          <div className="pd-actions">
            {inStock ? (
              <button type="button" className="btn-primary" onClick={handleAdd}>
                Add to Cart
              </button>
            ) : (
              <button type="button" className="btn-primary" onClick={handleRemind}>
                {reminded ? "✓ Reminder set (tap to remove)" : "🔔 Remind me when back in stock"}
              </button>
            )}
            <button type="button" className="btn-outline" onClick={handleWish}>
              {wished ? "♥ In Wishlist" : "♡ Wishlist"}
            </button>
          </div>
          {notice && (
            <p className={`pd-notice ${noticeType === "err" ? "err" : ""}`}>
              {notice} {noticeType === "ok" && notice.includes("cart") && <Link to="/cart">View cart</Link>}
            </p>
          )}
        </div>
      </div>

      <section className="pd-reviews">
        <h2>Customer Reviews</h2>
        <p>No reviews yet. Reviews will be available soon.</p>
      </section>
    </div>
  );
}