import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const FALLBACK =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='100%' height='100%' fill='#f8d7da'/><text x='50%' y='50%' font-size='64' text-anchor='middle' dominant-baseline='middle'>🎁</text></svg>`
  );

export default function ProductCard({ product }) {
  const { isWished, toggleWishlist } = useCart();
  const outOfStock = product.stock === 0;
  const wished = isWished(product._id);

  const onHeart = async (e) => {
    e.preventDefault(); // card ka link na khule
    e.stopPropagation();
    try {
      await toggleWishlist(product._id);
    } catch (err) {
      alert(err.message || "Could not update wishlist.");
    }
  };

  return (
    <Link to={`/product/${product.slug}`} className="card">
      <div className="card-img">
        <img
          src={product.images?.[0] || FALLBACK}
          alt={product.name}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = FALLBACK;
          }}
        />
        {outOfStock ? (
          <span className="badge badge-out">Out of stock</span>
        ) : product.isMysteryJar ? (
          <span className="badge">Mystery Jar</span>
        ) : product.isBestseller ? (
          <span className="badge">Bestseller</span>
        ) : null}
        <button
          type="button"
          className={`heart-btn ${wished ? "on" : ""}`}
          onClick={onHeart}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wished ? "♥" : "♡"}
        </button>
      </div>
      <div className="card-body">
        <h3>{product.name}</h3>
        <div className="card-meta">
          <span className="price">₹{product.price}</span>
          <span className="rating">★ {product.rating?.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}