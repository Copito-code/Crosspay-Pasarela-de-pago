
import React, { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginScreen: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const success = await login(username, password);

    if (success) {
      // Navegar al panel si el login fue exitoso
      navigate('/admin/dashboard');
    } else {
      setError('Credenciales inválidas. Por favor, revisa tu usuario y contraseña.');
    }
    setLoading(false);
  };

  return (
    <div style={{ 
      maxWidth: '400px', 
      margin: '100px auto', 
      padding: '40px', 
      backgroundColor: 'var(--bg-sec)',
      borderRadius: '8px',
      boxShadow: '0 4px 12px var(--shadow)' 
    }}>
      <h1 style={{ color: 'var(--titles)', textAlign: 'center' }}>Portal Administrativo</h1>
      <p style={{ color: 'var(--pg)', textAlign: 'center', marginBottom: '20px' }}>Inicia sesión para ver las transacciones.</p>

      {error && <p style={{ color: 'var(--accent2)', fontWeight: 'bold' }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
        <div>
          <label style={{ color: 'var(--pg)' }}>Usuario:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
            required 
          />
        </div>

        <div>
          <label style={{ color: 'var(--pg)' }}>Contraseña:</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{ 
            backgroundColor: 'var(--accent3)', 
            color: 'white', 
            padding: '12px', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            marginTop: '10px'
          }}
        >
          {loading ? 'Verificando...' : 'Iniciar Sesión'}
        </button>
      </form>
    </div>
  );
};

export default LoginScreen;