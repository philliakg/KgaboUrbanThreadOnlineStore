import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import "../css/Navbar.css";

function Navbar() {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/");
  }

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        URBAN<span>THREADS</span>
      </Link>
      <nav className="navbar-links">
        <NavLink to="/" end>
          Home
        </NavLink>
        <NavLink to="/shop">Shop</NavLink>
        <NavLink to="/cart" className="navbar-cart">
          Cart
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </NavLink>
      </nav>
      <div className="navbar-auth">
        {user ? (
          <>
            <span className="navbar-user">
              Hi, {user.displayName || user.email}
            </span>
            <NavLink to="/account" className="btn-outline navbar-account">
              My Account
            </NavLink>
            <button type="button" className="btn-solid" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-outline">
              Login
            </Link>
            <Link to="/register" className="btn-solid">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
