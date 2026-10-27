import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <h4>BlushBox</h4>
            <p style={{ opacity: 0.85, fontSize: "0.92rem" }}>
              Personalized gifts and mystery jars, made to make someone smile.
            </p>
          </div>
          <div>
            <h4>Shop</h4>
            <Link to="/shop">All Gifts</Link>
            <Link to="/shop?category=birthday">Birthday</Link>
            <Link to="/shop?category=anniversary">Anniversary</Link>
            <Link to="/shop?category=graduation">Graduation</Link>
          </div>
          <div>
            <h4>Explore</h4>
            <Link to="/mystery-jars">Mystery Jars</Link>
            <Link to="/shop?category=personalized-gifts">Personalized</Link>
            <Link to="/shop?category=handmade-gifts">Handmade</Link>
          </div>
          <div>
            <h4>Budget</h4>
            <Link to="/shop?category=under-299">Under ₹299</Link>
            <Link to="/shop?category=under-499">Under ₹499</Link>
            <Link to="/shop?category=under-999">Under ₹999</Link>
          </div>
        </div>
        <div className="footer-bottom">
         © 2026 BlushBox. A college project. Payment options: Cash on Delivery and UPI QR (simulated).
        </div>
      </div>
    </footer>
  );
}