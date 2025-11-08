import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hijoAPI } from '../services/api';
import './Login.css';

const ListaHijos = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hijos, setHijos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarHijos();
  }, []);

  const cargarHijos = async () => {
    try {
      const response = await hijoAPI.misHijos();
      setHijos(response.data);
    } catch (error) {
      console.error('Error al cargar hijos:', error);
    } finally {
      setLoading(false);
    }
  };

  const seleccionarHijo = (hijo) => {
    localStorage.setItem('hijoSeleccionado', JSON.stringify(hijo));
    navigate('/home-hijo');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="login-container">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '400px' }}>
        <div className="logo">
          <h1>We<br/>Parent</h1>
          <p className="subtitle">Bienvenido {user?.nombre || ''}</p>
        </div>

        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <h3 style={{ color: '#2c3e50', marginBottom: '20px' }}>Selecciona un hijo</h3>
        </div>

        {hijos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ color: '#666', marginBottom: '20px' }}>No tienes hijos registrados</p>
            <button 
              onClick={() => navigate('/invitacion')}
              className="btn-primary"
            >
              Agregar hijo
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {hijos.map((hijo) => (
              <button
                key={hijo.id}
                onClick={() => seleccionarHijo(hijo)}
                style={{
                  padding: '20px',
                  backgroundColor: 'white',
                  border: '2px solid #7dd3fc',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: '500',
                  color: '#2c3e50',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#f0f9ff';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'white';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                {hijo.nombre} {hijo.apellido}
              </button>
            ))}
          </div>
        )}

        <button 
          onClick={handleLogout}
          className="btn-secondary"
          style={{ marginTop: '20px' }}
        >
          Salir
        </button>
      </div>
    </div>
  );
};

export default ListaHijos;
