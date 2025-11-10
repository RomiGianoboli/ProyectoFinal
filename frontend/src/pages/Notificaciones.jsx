import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { notificacionAPI } from '../services/api';
import './Notificaciones.css';

const Notificaciones = () => {
  const navigate = useNavigate();
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarNotificaciones();
  }, []);

  const cargarNotificaciones = async () => {
    try {
      const response = await notificacionAPI.misNotificaciones();
      setNotificaciones(response.data);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const marcarLeida = async (id) => {
    try {
      await notificacionAPI.marcarLeida(id);
      setNotificaciones(notificaciones.map(n => 
        n.id === id ? { ...n, leida: true } : n
      ));
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  const handleNotificacionClick = async (notif) => {
    if (!notif.leida) {
      await marcarLeida(notif.id);
    }

    if (notif.tipo === 'SOLICITUD_CAMBIO_CUSTODIA' && notif.referenciaId) {
      navigate(`/aprobar-rechazar-cambio?id=${notif.referenciaId}`);
    }
  };

  const getTipoIcono = (tipo) => {
    switch (tipo) {
      case 'ACTIVIDAD_CREADA':
        return '📝';
      case 'ACTIVIDAD_EDITADA':
        return '✏️';
      case 'ACTIVIDAD_ELIMINADA':
        return '🗑️';
      case 'CUSTODIA_CAMBIADA':
        return '🔄';
      case 'SOLICITUD_CAMBIO':
        return '📩';
      case 'SOLICITUD_APROBADA':
        return '✅';
      case 'SOLICITUD_RECHAZADA':
        return '❌';
      default:
        return '🔔';
    }
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Ahora';
    if (minutes < 60) return `Hace ${minutes}m`;
    if (hours < 24) return `Hace ${hours}h`;
    if (days === 1) return 'Ayer';
    if (days < 7) return `Hace ${days}d`;
    
    return date.toLocaleDateString('es-AR');
  };

  return (
    <div className="notificaciones-container">
      <header className="notificaciones-header">
        <h1>We Parent</h1>
        <button className="btn-notificaciones-icon">
          🔔
        </button>
      </header>

      <div className="notificaciones-content">
        <h2 className="notificaciones-titulo">Notificaciones</h2>
        
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : notificaciones.length === 0 ? (
          <div className="empty-state">
            <p>No tienes notificaciones</p>
          </div>
        ) : (
          <div className="notificaciones-list">
            {notificaciones.map((notif) => (
              <div
                key={notif.id}
                className={`notificacion-card ${!notif.leida ? 'no-leida' : ''}`}
                onClick={() => handleNotificacionClick(notif)}
                style={{ cursor: 'pointer' }}
              >
                <div className="notificacion-icono">
                  {getTipoIcono(notif.tipo)}
                </div>
                <div className="notificacion-contenido">
                  <p className="notificacion-mensaje">{notif.mensaje}</p>
                  <span className="notificacion-fecha">
                    {formatearFecha(notif.fechaCreacion)}
                  </span>
                </div>
                {!notif.leida && <div className="indicador-no-leida"></div>}
              </div>
            ))}
          </div>
        )}

        <button className="btn-back" onClick={() => navigate('/home')}>
          Volver
        </button>
      </div>
    </div>
  );
};

export default Notificaciones;
