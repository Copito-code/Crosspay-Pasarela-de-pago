
import React, { createContext, useState, useContext, type ReactNode } from 'react';
import axios from 'axios';


// Nueva URLs para JWT
const API_TOKEN_URL = 'http://localhost:8000/api/token/'


interface AuthContextType {
  isLoggedIn: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Inicializa el estado revisando si hay un token válido en el localStorage
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const token = localStorage.getItem('accessToken');
    // Simplificamos, si hay token, asumimos que está logueado 
    return !!token;
  });

  const login = async (username: string, password: string) => {
    try {
      // Realizar la petición al endpoint de token JWT
      console.log('Intentando obtener token JWT...');
      
      const response = await axios.post(
        API_TOKEN_URL,
        { username, password }
      );

      console.log('Login/Token exitoso:', response.status);
      
      // Almacenar el token de acceso
      const accessToken = response.data.access;
      localStorage.setItem('accessToken', accessToken);
      

      // Actualizar el estado
      setIsLoggedIn(true);
      return true;
      
    } catch (error: any) {
      console.error('Error de autenticación JWT:', error);
      
      // Manejo de error específico (e.g., credenciales inválidas)
      if (error.response && error.response.status === 401) {
        console.error('Credenciales Inválidas.');
      }
      
      return false;
    }
  };

  const logout = () => {
    // Al hacer logout, simplemente borramos el token de localStorage
    console.log('Cerrando sesión (eliminando token JWT)...');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken'); 
    
    setIsLoggedIn(false);
    
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de un AuthProvider');
  }
  return context;
};