import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notificacionAPI } from '../services/api';
import './Home.css';

const HomeHijoSeleccionado = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hijoSeleccionado, setHijoSeleccionado] = useState(null);
  const [notificacionesCount, setNotificacionesCount] = useState(0);

  useEffect(() => {
    const hijo = JSON.parse(localStorage.getItem('hijoSeleccionado'));
    if (!hijo) {
      navigate('/lista-hijos');
      return;
    }
    setHijoSeleccionado(hijo);
    cargarNotificaciones();
  }, [navigate]);

  const cargarNotificaciones = async () => {
    try {
      const response = await notificacionAPI.contadorNoLeidas();
      setNotificacionesCount(response.data);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    }
  };

  const handleNavegar = (ruta) => {
    navigate(ruta, { state: { hijo: hijoSeleccionado } });
  };

  const handleVolver = () => {
    localStorage.removeItem('hijoSeleccionado');
    navigate('/lista-hijos');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!hijoSeleccionado) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-top">
          <div className="logo-small">
            <h2>We<br/>Parent</h2>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button 
              className="btn-icon" 
              onClick={handleVolver}
              style={{
                background: 'white',
                border: '2px solid #7dd3fc',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontSize: '14px',
                color: '#2c3e50'
              }}
            >
              ← Cambiar hijo
            </button>
            <button className="btn-logout" onClick={handleLogout}>
              Salir
            </button>
          </div>
        </div>
        
        <div className="user-greeting">
          <h1>¡Hola, {user?.nombre || ''}!</h1>
          <p style={{ fontSize: '18px', marginTop: '10px', color: '#666' }}>
            Hijo: <strong>{hijoSeleccionado.nombre} {hijoSeleccionado.apellido}</strong>
          </p>
        </div>
      </header>

      <div className="menu-grid">
        <button 
          className="menu-card"
          onClick={() => handleNavegar('/calendario')}
        >
          <div className="menu-icon">📅</div>
          <span>Calendario</span>
        </button>

        <button 
          className="menu-card"
          onClick={() => handleNavegar('/gastos')}
        >
          <div className="menu-icon">💵</div>
          <span>Gastos</span>
        </button>

        <button 
          className="menu-card"
          onClick={() => handleNavegar('/registros-medicos')}
        >
          <div className="menu-icon">🏥</div>
          <span>Registros Médicos</span>
        </button>

        <button 
          className="menu-card"
          onClick={() => handleNavegar('/reportes')}
        >
          <div className="menu-icon">📊</div>
          <span>Reportes</span>
        </button>

        <button 
          className="menu-card notification-card"
          onClick={() => navigate('/mensajeria')}
        >
          <div className="menu-icon">✉️</div>
          <span>Mensajería</span>
        </button>
      </div>
    </div>
  );
};

export default HomeHijoSeleccionado;
