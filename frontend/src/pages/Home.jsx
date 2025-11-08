import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hijoAPI, notificacionAPI } from '../services/api';
import './Home.css';

const Home = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hijos, setHijos] = useState([]);
  const [hijoSeleccionado, setHijoSeleccionado] = useState(null);
  const [notificacionesCount, setNotificacionesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [hijosRes, notifRes] = await Promise.all([
        hijoAPI.misHijos(),
        notificacionAPI.contadorNoLeidas(),
      ]);
      
      setHijos(hijosRes.data);
      setNotificacionesCount(notifRes.data);
      
      if (hijosRes.data.length > 0) {
        setHijoSeleccionado(hijosRes.data[0]);
      }
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNavegar = (ruta) => {
    if (!hijoSeleccionado && ruta !== '/invitacion' && ruta !== '/agregar-hijo') {
      alert('Selecciona un hijo primero');
      return;
    }
    localStorage.setItem('hijoSeleccionado', JSON.stringify(hijoSeleccionado));
    navigate(ruta, { state: { hijo: hijoSeleccionado } });
  };

  if (loading) {
    return (
      <div className="home-container">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <header className="home-header">
        <div className="header-top">
          <div className="logo-small">
            <h2>We<br/>Parent</h2>
          </div>
          <button className="btn-logout" onClick={logout}>
            Salir
          </button>
        </div>
        
        <div className="user-greeting">
          <h1>¡Hola, {user?.nombre}!</h1>
          <p>Selecciona las opciones del menú</p>
        </div>
      </header>

      {hijos.length > 0 && (
        <div className="hijo-selector">
          <label>Hijo seleccionado:</label>
          <select 
            value={hijoSeleccionado?.id || ''} 
            onChange={(e) => setHijoSeleccionado(hijos.find(h => h.id === parseInt(e.target.value)))}
            className="hijo-select"
          >
            {hijos.map(hijo => (
              <option key={hijo.id} value={hijo.id}>
                {hijo.nombre} {hijo.apellido}
              </option>
            ))}
          </select>
        </div>
      )}

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
          onClick={() => handleNavegar('/actividades')}
        >
          <div className="menu-icon">⚽</div>
          <span>Actividades</span>
        </button>

        <button 
          className="menu-card"
          onClick={() => handleNavegar('/custodias')}
        >
          <div className="menu-icon">🏠</div>
          <span>Custodias</span>
        </button>

        <button 
          className="menu-card notification-card"
          onClick={() => navigate('/notificaciones')}
        >
          <div className="menu-icon">🔔</div>
          <span>Notificaciones</span>
          {notificacionesCount > 0 && (
            <div className="notification-badge">{notificacionesCount}</div>
          )}
        </button>

        <button 
          className="menu-card"
          onClick={() => navigate('/invitacion')}
        >
          <div className="menu-icon">✉️</div>
          <span>Invitar co-padre</span>
        </button>

        <button 
          className="menu-card"
          onClick={() => navigate('/agregar-hijo')}
        >
          <div className="menu-icon">👶</div>
          <span>Agregar hijo</span>
        </button>
      </div>

      {hijos.length === 0 && (
        <div className="empty-state">
          <p>No tienes hijos registrados aún</p>
          <button 
            className="btn-primary"
            onClick={() => navigate('/agregar-hijo')}
          >
            Agregar primer hijo
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
