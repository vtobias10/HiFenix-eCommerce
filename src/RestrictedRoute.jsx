import React from 'react';
import { Navigate } from 'react-router-dom';

const RestrictedRoute = ({ children, restrictedRole, redirectTo }) => {
  const storedUser = localStorage.getItem('userData');
  const user = storedUser ? JSON.parse(storedUser) : null;

  if (user && user.role === restrictedRole) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default RestrictedRoute;
