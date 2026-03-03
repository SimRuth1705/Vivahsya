import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import './AdminLayout.css';

const AdminLayout = ({ onLogout }) => {
  return (
    <div className="admin-container">
      {/* Sidebar - Ensure its internal CSS still works with the 85px/260px logic */}
      <Sidebar onLogout={onLogout} />
      
      <main className="admin-main-content">
        {/* The child pages (Dashboard, Bookings, etc.) render here directly */}
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;