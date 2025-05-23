import React from 'react';
import { Navigate } from 'react-router-dom';

function PrivateRoute({ children }) {
  // In a real application, check if user is authenticated and has admin role
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const isAdmin = localStorage.getItem('userRole') === 'admin';

  // if (!isAuthenticated || !isAdmin) {
  //   // Redirect to login page if not authenticated or not admin
  //   return <Navigate to="/login" replace />;
  // }

  return children;
}

export default PrivateRoute; 