import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { actividadAPI } from '../services/api';
import './SeleccionDia.css';

const SeleccionDia = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fecha, hijo, mesAnio } = location.state || {};
  
  const [actividades, setActividades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!fecha || !hijo) {
      navigate('/calendario');
      return;
    }
    cargarActividades();
  }, [fecha, hijo]);

  const cargarActividades = async () => {
    try {
      const response = await actividadAPI.porFecha(hijo.id, fecha);
      setActividades(response.data);
    } catch (error) {
      console.error('Error al cargar actividades:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarActividad = () => {
    navigate('/agregar-actividad', { state: { fecha, hijo, mesAnio } });
  };

  const handleEditarActividad = (actividad) => {
    navigate('/editar-actividad', { state: { actividad, fecha, hijo, mesAnio } });
  };

  const handleEliminarActividad = (actividad) => {
    navigate('/eliminar-actividad', { state: { actividad, fecha, hijo, mesAnio } });
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha + 'T00:00:00');
    const dia = date.getDate();
    return dia;
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <div className="seleccion-dia-page">
      <div className="seleccion-dia-container">
        <div className="seleccion-dia-header">
          <div className="logo-seleccion">
            <h1>We<br/>Parent</h1>
          </div>
          <button className="btn-notification-sel">
            🔔
          </button>
        </div>

        <p className="tu-color-label">Tu color: [ver como hacer seleccion de color]</p>

        <div className="calendario-preview-card">
          <div className="mes-titulo-preview">{mesAnio || 'Noviembre 2025'}</div>
          <div className="calendario-mini">
            <div className="dias-semana-mini">
              {['S', 'L', 'M', 'M', 'J', 'V', 'S'].map(dia => (
                <div key={dia} className="dia-semana-mini">{dia}</div>
              ))}
            </div>
            <div className="dias-grid-mini">
              {Array.from({ length: 35 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`dia-mini ${i === parseInt(formatearFecha(fecha)) - 1 + 4 ? 'selected' : ''}`}
                >
                  {i >= 4 && i < 34 ? i - 3 : ''}
                </div>
              ))}
            </div>
          </div>

          <div className="actividades-lista">
            {actividades.length === 0 ? (
              <p className="no-actividades">No hay actividades programadas</p>
            ) : (
              actividades.map((actividad) => (
                <div key={actividad.id} className="actividad-item">
                  <div className="actividad-info">
                    <span className="actividad-circulo" style={{
                      backgroundColor: actividad.colorPadre === 'LILA' ? '#d8b4fe' : '#7dd3fc'
                    }}></span>
                    <div className="actividad-detalles">
                      <p className="actividad-nombre">{actividad.nombre}</p>
                      <p className="actividad-horario">
                        ({actividad.horaInicio} a {actividad.horaFin})
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="actividades-acciones">
            <button className="accion-actividad-btn" onClick={handleAgregarActividad}>
              <span className="icono-accion">➕</span>
              <span>Agregar actividad</span>
            </button>
            {actividades.length > 0 && (
              <>
                <button className="accion-actividad-btn" onClick={() => actividades.length > 0 && handleEditarActividad(actividades[0])}>
                  <span className="icono-accion">✏️</span>
                  <span>Editar actividad</span>
                </button>
                <button className="accion-actividad-btn" onClick={() => actividades.length > 0 && handleEliminarActividad(actividades[0])}>
                  <span className="icono-accion">🗑️</span>
                  <span>Eliminar actividad</span>
                </button>
              </>
            )}
          </div>
        </div>

        <button className="btn-volver-sel" onClick={() => navigate('/calendario')}>
          Volver
        </button>
      </div>
    </div>
  );
};

export default SeleccionDia;
