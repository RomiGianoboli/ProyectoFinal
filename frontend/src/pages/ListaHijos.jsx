import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hijoAPI, notificacionAPI } from '../services/api';
import './ListaHijos.css';

const ListaHijos = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hijos, setHijos] = useState([]);
  const [notificacionesCount, setNotificacionesCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [hijosRes, notifRes] = await Promise.all([
        hijoAPI.misHijos(),
        notificacionAPI.contadorNoLeidas()
      ]);
      setHijos(hijosRes.data);
      setNotificacionesCount(notifRes.data);
    } catch (error) {
      console.error('Error al cargar datos:', error);
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
      <div className="lista-hijos-container">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="lista-hijos-container">
      <div className="lista-hijos-card">
        <div className="header-lista">
          <div className="logo-lista">
            <h1>We<br/>Parent</h1>
          </div>
          <button 
            className="btn-notification"
            onClick={() => navigate('/notificaciones')}
            style={{ position: 'relative' }}
          >
            <span className="bell-icon">🔔</span>
            {notificacionesCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                background: '#dc2626',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {notificacionesCount}
              </span>
            )}
          </button>
        </div>

        <div className="greeting-section">
          <h2>Bienvenido {user?.nombre || ''}</h2>
        </div>

        <div className="titulo-hijos">
          <h3>Selecciona un hijo</h3>
        </div>

        {hijos.length === 0 ? (
          <div className="empty-hijos">
            <p>No tienes hijos registrados</p>
            <button 
              onClick={() => navigate('/invitacion')}
              className="btn-primary"
            >
              Agregar hijo
            </button>
          </div>
        ) : (
          <>
            <div className="hijos-grid">
              {hijos.map((hijo) => (
                <button
                  key={hijo.id}
                  onClick={() => seleccionarHijo(hijo)}
                  className="hijo-card"
                >
                  <span className="hijo-nombre">
                    {hijo.nombre} {hijo.apellido}
                  </span>
                </button>
              ))}
            </div>
            
            <button 
              onClick={() => navigate('/agregar-hijo')}
              className="btn-agregar-hijo"
            >
              + Agregar otro hijo/a
            </button>
          </>
        )}

        <button 
          onClick={handleLogout}
          className="btn-salir"
        >
          Salir
        </button>
      </div>
    </div>
  );
};

export default ListaHijos;
