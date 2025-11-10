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
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
              className="btn-notification-header" 
              onClick={() => navigate('/notificaciones')}
              style={{ position: 'relative' }}
            >
              🔔
              {notificacionesCount > 0 && (
                <span className="notification-badge">
                  {notificacionesCount}
                </span>
              )}
            </button>
            <button 
              className="btn-logout-icon" 
              onClick={handleLogout}
              title="Salir"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ff9b71" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="user-greeting">
          <h1>¡Hola, {user?.nombre || ''}!</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px' }}>
            <p style={{ fontSize: '18px', color: '#666', margin: 0 }}>
              Hijo: <strong>{hijoSeleccionado.nombre} {hijoSeleccionado.apellido}</strong>
            </p>
            <button 
              className="btn-cambiar-hijo" 
              onClick={handleVolver}
            >
              Cambiar hijo
            </button>
          </div>
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
