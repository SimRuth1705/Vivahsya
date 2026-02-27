import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';
import { 
  HiOutlineViewGrid, HiOutlineUserGroup, HiOutlineCalendar, 
  HiOutlineClipboardList, HiOutlineBadgeCheck, HiOutlineChartPie, 
  HiOutlineCurrencyDollar, HiOutlineLogout 
} from 'react-icons/hi';

const Sidebar = ({ onLogout }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  // Get current user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const userRole = user?.role || 'employee';

  const menuItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <HiOutlineViewGrid />, role: 'all' },
    { name: "Leads", path: "/admin/leads", icon: <HiOutlineUserGroup />, role: 'owner' }, // Protected
    { name: "Bookings", path: "/admin/bookings", icon: <HiOutlineBadgeCheck />, role: 'all' },
    { name: "Events", path: "/admin/events", icon: <HiOutlineCalendar />, role: 'all' },
    { name: "Vendors", path: "/admin/vendors", icon: <HiOutlineClipboardList />, role: 'all' },
    { name: "CRM", path: "/admin/crm", icon: <HiOutlineChartPie />, role: 'all' },
    { name: "Users", path: "/admin/users", icon: <HiOutlineUserGroup />, role: 'owner' }, // Protected
    { name: "Sales", path: "/admin/sales", icon: <HiOutlineCurrencyDollar />, role: 'owner' }, // Protected
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
          <span className={`logo-text ${isHovered ? 'visible' : 'hidden'}`}>Vivahasya</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          // If the item is owner-only and user is an employee, skip it
          if (item.role === 'owner' && userRole !== 'owner') return null;

          return (
            <NavLink 
              key={item.name}
              to={item.path} 
              className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
            >
              <span className="icon-wrapper">{item.icon}</span>
              <span className={`label ${isHovered ? 'visible' : 'hidden'}`}>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

<div className="sidebar-footer">
  <button onClick={onLogout} className="logout-btn">
    <span className="icon-wrapper"><HiOutlineLogout size={22} /></span>
    <span className={`label ${isHovered ? 'visible' : 'hidden'}`}>
      Logout
    </span>
  </button>
</div>
    </aside>
  );
};

export default Sidebar;