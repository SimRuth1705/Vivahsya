import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { 
  HiOutlineViewGrid, HiOutlineUserGroup, HiOutlineCalendar, 
  HiOutlineClipboardList, HiOutlineBadgeCheck, HiOutlineChartPie, 
  HiOutlineCurrencyDollar, HiOutlineLogout 
} from 'react-icons/hi';

const Sidebar = ({ userRole, onLogout }) => {
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <HiOutlineViewGrid /> },
    { name: "Leads", path: "/admin/leads", icon: <HiOutlineUserGroup /> },
    { name: "Bookings", path: "/admin/bookings", icon: <HiOutlineBadgeCheck /> },
    { name: "Events", path: "/admin/events", icon: <HiOutlineCalendar /> },
    { name: "Vendors", path: "/admin/vendors", icon: <HiOutlineClipboardList /> },
    { name: "CRM", path: "/admin/crm", icon: <HiOutlineChartPie /> },
    { name: "Sales", path: "/admin/sales", icon: <HiOutlineCurrencyDollar /> },
  ];

  return (
    <aside 
      className={`sidebar ${isHovered ? 'open' : 'closed'}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="sidebar-header">
        <div className="logo-section">
          <div className="logo-icon">V</div>
          {isHovered && <span className="logo-text">Vivahasya</span>}
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink 
            key={item.name}
            to={item.path} 
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            style={{ textDecoration: 'none' }} // Extra insurance against underlines
          >
            <span className="icon">{item.icon}</span>
            {isHovered && <span className="label">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button onClick={onLogout} className="logout-btn">
          <HiOutlineLogout size={22} />
          {isHovered && <span className="logout-text">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;