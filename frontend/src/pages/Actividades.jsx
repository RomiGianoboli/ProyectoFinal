import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { actividadAPI } from '../services/api';
import './Actividades.css';

const Actividades = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hijoFromState = location.state?.hijo;
  
  const [hijo, setHijo] = useState(null);
  const [actividades, setActividades] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(
    new Date().toISOString().split('T')[0]
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hijoGuardado = localStorage.getItem('hijoSeleccionado');
    if (hijoFromState) {
      setHijo(hijoFromState);
      localStorage.setItem('hijoSeleccionado', JSON.stringify(hijoFromState));
    } else if (hijoGuardado) {
      setHijo(JSON.parse(hijoGuardado));
    } else {
      navigate('/home');
      return;
    }
  }, [hijoFromState, navigate]);

  useEffect(() => {
    if (hijo) {
      cargarActividades();
    }
  }, [fechaSeleccionada, hijo]);

  const cargarActividades = async () => {
    try {
      const response = await actividadAPI.porFecha(hijo.id, fechaSeleccionada);
      setActividades(response.data);
    } catch (error) {
      console.error('Error al cargar actividades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Eliminar esta actividad?')) return;
    
    try {
      await actividadAPI.eliminar(id);
      cargarActividades();
    } catch (error) {
      alert('Error al eliminar actividad');
    }
  };

  const getEstadoClase = (estado) => {
    switch (estado) {
      case 'CONFIRMADA':
        return 'estado-confirmada';
      case 'PENDIENTE_APROBACION':
        return 'estado-pendiente';
      case 'CANCELADA':
        return 'estado-cancelada';
      default:
        return '';
    }
  };

  const getEstadoTexto = (estado) => {
    switch (estado) {
      case 'CONFIRMADA':
        return 'Confirmada';
      case 'PENDIENTE_APROBACION':
        return 'Pendiente aprobación';
      case 'CANCELADA':
        return 'Cancelada';
      default:
        return estado;
    }
  };

  return (
    <div className="actividades-container">
      <header className="actividades-header">
        <button className="btn-back" onClick={() => navigate('/home')}>
          ← Volver
        </button>
        <h1>Actividades</h1>
      </header>

      <div className="actividades-content">
        <div className="hijo-info">
          <h2>{hijo?.nombre} {hijo?.apellido}</h2>
        </div>

        <div className="fecha-selector">
          <label>Selecciona una fecha</label>
          <input
            type="date"
            value={fechaSeleccionada}
            onChange={(e) => setFechaSeleccionada(e.target.value)}
            className="fecha-input"
          />
        </div>

        <div className="actividades-list">
          {loading ? (
            <div className="loading">Cargando...</div>
          ) : actividades.length === 0 ? (
            <div className="empty-state">
              <p>No hay actividades para esta fecha</p>
            </div>
          ) : (
            actividades.map((actividad) => (
              <div key={actividad.id} className="actividad-card">
                <div className="actividad-header">
                  <h3>{actividad.titulo}</h3>
                  <span className={`estado-badge ${getEstadoClase(actividad.estado)}`}>
                    {getEstadoTexto(actividad.estado)}
                  </span>
                </div>
                
                {actividad.descripcion && (
                  <p className="actividad-descripcion">{actividad.descripcion}</p>
                )}
                
                <div className="actividad-detalles">
                  <div className="detalle-item">
                    <span className="detalle-label">📍</span>
                    <span>{actividad.lugar || 'Sin ubicación'}</span>
                  </div>
                  <div className="detalle-item">
                    <span className="detalle-label">⏰</span>
                    <span>{actividad.hora || 'Sin hora'}</span>
                  </div>
                </div>

                <div className="actividad-actions">
                  <button
                    className="btn-editar"
                    onClick={() => navigate('/editar-actividad', { 
                      state: { actividad, hijo } 
                    })}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-eliminar"
                    onClick={() => handleEliminar(actividad.id)}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <button
          className="btn-agregar-floating"
          onClick={() => navigate('/agregar-actividad', { 
            state: { hijo, fecha: fechaSeleccionada } 
          })}
        >
          + Agregar actividad
        </button>
      </div>
    </div>
  );
};

export default Actividades;
