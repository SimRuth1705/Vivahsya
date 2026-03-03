import "./NavBar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthContext/AuthContext";
import logo from "../../assets/vlogo.png";
import vivahasya_logo from "../../assets/vivahasya-logo.png";

function NavBar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="Navbar">
      <div className="logo-container">
        <img src={vivahasya_logo} alt="Vivahasya logo" className="nav-logo" />
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/PortfolioGallery">Our Portfolio</Link></li>
        <li><Link to="/contact">Contact</Link></li>

        {user?.role === "admin" && (
          <li><Link to="/admin">Admin Panel</Link></li>
        )}

        {user?.role === "client" && (
          <li><Link to="/client-home">Dashboard</Link></li>
        )}
      </ul>

      <div className="nav-actions">
        {user ? (
          <button onClick={handleLogout} className="nav-btn">
            LOG OUT
          </button>
        ) : (
          <Link to="/login" className="nav-btn">
            LOG IN
          </Link>
        )}
      </div>
    </nav>
  );
}

export default NavBar;