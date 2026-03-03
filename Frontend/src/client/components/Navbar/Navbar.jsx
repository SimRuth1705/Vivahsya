import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const navbarClass = isHomePage ? 'navbar home' : 'navbar default';

    const navItems = [
        { name: 'Portfolio', path: '/client/portfolio' },
        { name: 'Booking', path: '/client/booking' },
        { name: 'Timeline', path: '/client/timeline' },
        { name: 'Venues', path: '/client/venues' },
    ];

    return (
        <nav className={navbarClass}>
            <NavLink to="/Client">
                <img src={logo} alt="logo" className="logo" />
            </NavLink>
            <ul className="nav-list">
                {navItems.map((item) => (
                    <li key={item.name}>
                        <NavLink
                            to={item.path}
                            className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}
                        >
                            {item.name}
                        </NavLink>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default Navbar;
