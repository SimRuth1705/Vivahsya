import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // 1. If not logged in at all, kick back to login
  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  // 2. Role-Based Permissions
  // Logic: 'owner' is the superuser.
  const isOwner = user.role === 'owner';
  
  if (requiredRole) {
    // Check if user is owner or matches the specific required role (e.g., 'employee')
    const hasPermission = isOwner || user.role === requiredRole;

    if (!hasPermission) {
      console.warn(`Access Denied: ${user.role} tried to access ${requiredRole} route.`);
      // Redirect to their specific dashboard if they lack permission
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  // 3. Success: Render the protected content
  return children;
};

export default ProtectedRoute;