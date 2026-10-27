import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";

export default function Wishlist() {
  const { wishlist } = useCart();

  return (
    <div className="container cart-page">
      <h1>My Wishlist</h1>
      {wishlist.length === 0 ? (
        <div className="state-box">
          <p>Your wishlist is empty. Tap the ♡ on any gift to save it.</p>
          <Link to="/shop" className="btn-small">Browse gifts</Link>
        </div>
      ) : (
        <div className="shop-grid">
          {wishlist.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}