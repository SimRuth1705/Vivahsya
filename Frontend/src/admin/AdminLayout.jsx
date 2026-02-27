import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import './AdminLayout.css';

const AdminLayout = ({ onLogout }) => {
  return (
    <div className="admin-layout-wrapper">
      {/* Sidebar gets the logout function */}
      <Sidebar onLogout={onLogout} />
      
      <div className="admin-main-content">
        {/* This renders the actual pages like Dashboard, Sales, etc. */}
        <div className="page-container">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;