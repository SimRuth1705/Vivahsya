import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { HiOutlineLogout } from "react-icons/hi"; // npm install react-icons
import logo from "../../assets/logo.png";
import "./Navbar.css";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);

  const isHomePage = location.pathname === "/";

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    if (window.confirm("Sign out of Vivahasya?")) {
      localStorage.clear(); // Clears token and user data
      toast.success("Logged out successfully!");
      navigate("/login");
    }
  };

  return (
    <nav
      className={`navbar ${isHomePage ? "home" : "default"} ${isScrolled ? "scrolled" : ""}`}
    >
      <div className="nav-container">
        {/* --- LEFT SECTION: LOGO --- */}
        <div className="nav-left">
          <NavLink to="/client">
            <img src={logo} alt="Vivahasya" className="logo-img" />
          </NavLink>
        </div>

        {/* --- CENTER SECTION: PAGES --- */}
        <div className="nav-center">
          <ul className="nav-links">
            <li>
              <NavLink
                to="/client/portfolio"
                className={({ isActive }) =>
                  isActive ? "link active" : "link"
                }
              >
                Portfolio
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/client/booking"
                className={({ isActive }) =>
                  isActive ? "link active" : "link"
                }
              >
                Booking
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/client/timeline"
                className={({ isActive }) =>
                  isActive ? "link active" : "link"
                }
              >
                Timeline
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/client/venues"
                className={({ isActive }) =>
                  isActive ? "link active" : "link"
                }
              >
                Venues
              </NavLink>
            </li>
          </ul>
        </div>

        {/* --- RIGHT SECTION: ACTIONS --- */}
        <div className="nav-right">
          <button onClick={handleLogout} className="logout-btn">
            <span>Logout</span>
            <HiOutlineLogout />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
