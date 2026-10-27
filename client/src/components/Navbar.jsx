import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { cartCount, wishlist, backInStockCount } = useCart();
  const navigate = useNavigate();
  const close = () => setOpen(false);

  const handleLogout = () => {
    logout();
    close();
    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="logo" onClick={close}>
          Blush<span>Box</span>
        </Link>
        <button className="nav-toggle" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? "✕" : "☰"}
        </button>
        <nav className={`nav-links ${open ? "open" : ""}`}>
          {user ? (
            <>
              <NavLink to="/" end onClick={close}>Home</NavLink>
              <NavLink to="/shop" onClick={close}>Shop</NavLink>
              <NavLink to="/mystery-jars" onClick={close}>Mystery Jars</NavLink>
              <NavLink to="/orders" onClick={close}>Orders</NavLink>
              <NavLink to="/alerts" onClick={close}>
                Alerts{backInStockCount > 0 && <span className="nav-count">{backInStockCount}</span>}
              </NavLink>
              <NavLink to="/wishlist" onClick={close}>
                Wishlist{wishlist.length > 0 && <span className="nav-count">{wishlist.length}</span>}
              </NavLink>
              <NavLink to="/cart" onClick={close}>
                Cart{cartCount > 0 && <span className="nav-count">{cartCount}</span>}
              </NavLink>
              <span className="nav-user">Hi, {user.name.split(" ")[0]}</span>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <NavLink to="/login" onClick={close}>Login</NavLink>
              <Link to="/signup" className="btn btn-sm" onClick={close}>Sign Up</Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}