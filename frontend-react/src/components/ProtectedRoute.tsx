
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoggedIn } = useAuth();
  
  if (!isLoggedIn) {
    // Si no está logueado, redirige a la pantalla de login
    return <Navigate to="/admin/login" replace />;
  }
  
  // Si está logueado, muestra el contenido (AdminPanel)
  return <>{children}</>;
};

export default ProtectedRoute;