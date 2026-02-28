import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../components/AuthContext/AuthContext"; // Adjust the path as needed
import logo from "../../assets/vlogo.png"; // Adjust the path as needed

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); 
  };

  return (
    <nav className="navbar">
      <div className="logo-container">
        <img src={logo} alt="Vivahasya logo" />
        <span className="brand-name">Vivahasya</span>
      </div>

      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/PortfolioGallery">Our Portfolio</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        
        {/* Dynamic Admin Link */}
        {user?.role === "admin" && (
          <li><Link to="/admin">Admin Panel</Link></li>
        )}
        
        {/* Dynamic Client Link (Optional - if the client team wants a direct link) */}
        {user?.role === "client" && (
          <li><Link to="/client-home">Dashboard</Link></li>
        )}
      </ul>

      {user ? (
        <button onClick={handleLogout} className="nav-btn">
          LOG OUT
        </button>
      ) : (
        <Link to="/admin/login" className="nav-btn">
          LOG IN
        </Link>
      )}
    </nav>
  );
}

export default Navbar;