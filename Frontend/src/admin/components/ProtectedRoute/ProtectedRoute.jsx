import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // 1. If not logged in at all
  if (!token || !user) {
    return <Navigate to="/admin/login" replace />;
  }

  // 2. Hierarchical Role Check
  // Logic: 'owner' has access to EVERYTHING. 
  // 'admin' only has access if specifically required.
  const isOwner = user.role === 'owner';
  const isAdmin = user.role === 'admin';

  if (requiredRole) {
    const hasPermission = 
      isOwner || 
      (requiredRole === 'admin' && isAdmin) || 
      user.role === requiredRole;

    if (!hasPermission) {
      console.warn(`Access Denied: ${user.role} tried to access ${requiredRole}`);
      // Redirect to a safe page the user DOES have access to
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  // 3. Success!
  return children;
};

export default ProtectedRoute;