import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

// Pages
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Leads from "./pages/Leads/Leads";
import CRM from "./pages/CRM/CRM";
import Bookings from "./pages/Bookings/Bookings";
import Events from "./pages/Events/Events";
import Vendors from "./pages/Vendors/Vendors";
import Users from "./pages/Users/Users";

// AdminRoutes.jsx

const AdminRoutes = ({ setIsAuthenticated, onLogout }) => {
  return (
    // AdminRoutes.jsx
<Routes>
  {/* Public Admin Login */}
  <Route path="login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
  
  {/* 🔒 Protected Admin Area */}
  <Route element={
      <ProtectedRoute requiredRole="admin"> 
        <AdminLayout onLogout={onLogout} />
      </ProtectedRoute>
  }>
    <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
    <Route path="dashboard" element={<Dashboard />} />
    <Route path="crm" element={<CRM />} />
    <Route path="bookings" element={<Bookings />} />
    <Route path="events" element={<Events />} />
    <Route path="vendors" element={<Vendors />} />

    {/* 👑 Owner Only Area */}
    <Route path="leads" element={<ProtectedRoute requiredRole="owner"><Leads /></ProtectedRoute>} />
    <Route path="users" element={<ProtectedRoute requiredRole="owner"><Users /></ProtectedRoute>} />
  </Route>
</Routes>
  );
};

export default AdminRoutes;
