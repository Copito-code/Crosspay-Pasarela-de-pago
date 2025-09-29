
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TransactionForm from './components/TransactionForm';
import LoginScreen from './components/LoginScreen'; 
import AdminPanel from './components/AdminPanel'; 
import ProtectedRoute from './components/ProtectedRoute'; 
import { AuthProvider } from './context/AuthContext'; 

function App() {
  return (
    <Router>
      <AuthProvider> {/* Envuelve toda la app en el contexto de autenticación */}
        <Routes>
          {/* Ruta Pública: Formulario de Pagos */}
          <Route path="/" element={<TransactionForm />} />
          
          {/* Ruta Pública: Pantalla de Login */}
          <Route path="/admin/login" element={<LoginScreen />} />
          
          {/* Ruta Protegida: Panel Administrativo */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />
          
          {/* Ruta de fallback para 404 */}
          <Route path="*" element={<h1>404: Página no encontrada</h1>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;