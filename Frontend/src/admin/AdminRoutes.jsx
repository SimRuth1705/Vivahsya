import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './AdminLayout';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';

// Pages
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Leads from './pages/Leads/Leads';
import CRM from './pages/CRM/CRM';
import Bookings from './pages/Bookings/Bookings';
import Events from './pages/Events/Events';
import Vendors from './pages/Vendors/Vendors';
import Users from './pages/Users/Users';

// AdminRoutes.jsx

const AdminRoutes = ({ setIsAuthenticated, onLogout }) => {
  return (
    <Routes>
      {/* PUBLIC: Login is the only page accessible without a token */}
      <Route path="login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
      
      {/* PRIVATE: Everything inside this ProtectedRoute requires a token */}
      <Route 
        element={
          <ProtectedRoute> 
            <AdminLayout onLogout={onLogout} />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        
        {/* Standard Staff Pages */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="crm" element={<CRM />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="events" element={<Events />} />
        <Route path="vendors" element={<Vendors />} />
        <Route path="leads" element={<Leads />} />
        <Route 
          path="users" 
          element={
            <ProtectedRoute requiredRole="owner">
              <Users />
            </ProtectedRoute>
          } 
        />
      </Route>

      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};


export default AdminRoutes;