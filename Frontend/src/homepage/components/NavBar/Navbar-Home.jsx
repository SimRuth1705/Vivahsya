import "./Navbarrr.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../AuthContext/AuthContext";
import vivahasya_logo from "../../assets/Vivahasya-logo.png";

// Renamed from NavBar to NavbarHome
function NavbarHome() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className={`NavBar ${menuOpen ? "menu-open" : ""}`}>
      <div className="logo-container">
        <img src={vivahasya_logo} alt="Vivahasya logo" className="nav-logo" />
      </div>

      <button
        type="button"
        className="menu-toggle"
        onClick={() => setMenuOpen((prev) => !prev)}
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        aria-controls="homepage-nav-menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <ul className="nav-links">
        <li><Link to="/" onClick={closeMenu}>Home</Link></li>
        <li><Link to="/about" onClick={closeMenu}>About</Link></li>
        <li><Link to="/services" onClick={closeMenu}>Services</Link></li>
        <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>

        {user?.role === "admin" && (
          <li><Link to="/admin" onClick={closeMenu}>Admin Panel</Link></li>
        )}

        {user?.role === "client" && (
          <li><Link to="/client-home" onClick={closeMenu}>Dashboard</Link></li>
        )}
      </ul>

      <div className="nav-actions">
        {user ? (
          <button onClick={handleLogout} className="nav-btn">
            LOG OUT
          </button>
        ) : (
          <Link to="/login" className="nav-btn" onClick={closeMenu}>
            LOG IN
          </Link>
        )}
      </div>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`} id="homepage-nav-menu">
        <ul className="mobile-nav-links">
          <li><Link to="/" onClick={closeMenu}>Home</Link></li>
          <li><Link to="/about" onClick={closeMenu}>About</Link></li>
          <li><Link to="/services" onClick={closeMenu}>Services</Link></li>
          <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>

          {user?.role === "admin" && (
            <li><Link to="/admin" onClick={closeMenu}>Admin Panel</Link></li>
          )}

          {user?.role === "client" && (
            <li><Link to="/client-home" onClick={closeMenu}>Dashboard</Link></li>
          )}
        </ul>

        <div className="mobile-nav-actions">
          {user ? (
            <button onClick={handleLogout} className="nav-btn">
              LOG OUT
            </button>
          ) : (
            <Link to="/login" className="nav-btn" onClick={closeMenu}>
              LOG IN
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavbarHome;
