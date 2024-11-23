import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, role, allowOwnProfile, profileEmail }) => {
  const token = localStorage.getItem('authToken');
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  // Verificar si el usuario está autenticado
  if (!token || !currentUser) {
    return <Navigate to="/userLogin" />;
  }

  // Verificar si tiene el rol requerido
  if (role && currentUser.role !== role) {
    return <Navigate to="/" />;
  }

  // Verificar si puede acceder a su propio perfil u otras rutas restringidas
  if (allowOwnProfile && profileEmail && currentUser.email !== profileEmail) {
    return <Navigate to="/" />;
  }

  // Si todas las verificaciones son correctas, renderiza el componente hijo
  return children;
};

export default ProtectedRoute;
