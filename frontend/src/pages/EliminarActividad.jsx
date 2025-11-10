import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { actividadAPI } from '../services/api';
import './SeleccionDia.css';

const EliminarActividad = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { actividad, fecha, hijo, mesAnio } = location.state || {};
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEliminar = async () => {
    setLoading(true);
    setError('');

    try {
      await actividadAPI.eliminar(actividad.id);
      navigate('/seleccion-dia', { state: { fecha, hijo, mesAnio } });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al eliminar actividad');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    if (fecha && hijo) {
      navigate('/seleccion-dia', { state: { fecha, hijo, mesAnio } });
    } else {
      navigate('/calendario', { state: { hijo } });
    }
  };

  if (!actividad) {
    navigate('/calendario');
    return null;
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

        <div className="calendario-preview-card confirmacion-card">
          <div className="mes-titulo-preview">{mesAnio || 'Noviembre 2025'}</div>
          
          <div className="confirmacion-contenido">
            <h3 className="confirmacion-titulo">¿Está seguro de eliminar esta actividad?</h3>
            
            <div className="actividad-detalles-eliminar">
              <p className="actividad-nombre-eliminar">{actividad.nombre}</p>
              <p className="actividad-horario-eliminar">
                {actividad.horaInicio} a {actividad.horaFin}
              </p>
            </div>

            {error && <div className="error-message-act">{error}</div>}

            <div className="botones-confirmacion">
              <button className="btn-cancelar" onClick={handleCancelar}>
                Cancelar
              </button>
              <button className="btn-eliminar" onClick={handleEliminar} disabled={loading}>
                {loading ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>

          <div className="calendario-mini">
            <div className="dias-grid-mini small">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="dia-mini-small">
                  {i >= 4 && i < 34 ? i - 3 : ''}
                </div>
              ))}
            </div>
          </div>
        </div>

        <button className="btn-volver-sel" onClick={handleCancelar}>
          Volver
        </button>
      </div>
    </div>
  );
};

export default EliminarActividad;
