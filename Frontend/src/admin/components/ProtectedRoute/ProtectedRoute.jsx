import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // 1. If not logged in at all, go to login
  if (!token || !user) {
    // 🛑 FIX: Use the full path /admin/login
    return <Navigate to="/admin/login" replace />;
  }

  // 2. Check role
  if (requiredRole && user.role !== requiredRole) {
    // 🛑 FIX: Use absolute path /admin/dashboard
    return <Navigate to="/admin/dashboard" replace />;
  }

  // 3. Otherwise, show the protected content
  return children;
};

export default ProtectedRoute;