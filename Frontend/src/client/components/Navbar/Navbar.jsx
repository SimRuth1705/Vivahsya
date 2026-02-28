import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Navbar.css';

const Navbar = () => {
    const location = useLocation();
    const isHomePage = location.pathname === '/';
    const navbarClass = isHomePage ? 'navbar home' : 'navbar default';

    const navItems = [
        { name: 'Portfolio', path: '/portfolio' },
        { name: 'Booking', path: '/booking' },
        { name: 'Timeline', path: '/timeline' },
        { name: 'Venues', path: '/venues' },
        { name: 'Our Works', path: '/our-works' }
    ];

    return (
        <nav className={navbarClass}>
            <NavLink to="/">
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
