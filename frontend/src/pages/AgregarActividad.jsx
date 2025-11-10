import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { actividadAPI } from '../services/api';
import './SeleccionDia.css';

const AgregarActividad = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fecha, hijo, mesAnio } = location.state || {};
  
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    fecha: fecha || new Date().toISOString().split('T')[0],
    horaInicio: '09:00',
    horaFin: '10:00',
    hijoId: hijo?.id || null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.hijoId) {
      setError('Error: No se encontró información del hijo');
      setLoading(false);
      return;
    }

    if (formData.horaFin <= formData.horaInicio) {
      setError('La hora de fin debe ser posterior a la hora de inicio');
      setLoading(false);
      return;
    }

    try {
      await actividadAPI.crear(formData);
      navigate('/seleccion-dia', { state: { fecha: formData.fecha, hijo, mesAnio } });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear actividad');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelar = () => {
    navigate('/seleccion-dia', { state: { fecha, hijo, mesAnio } });
  };

  if (!hijo) {
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

        <p className="tu-color-label">Agregar actividad para {hijo.nombre}</p>

        <div className="calendario-preview-card formulario-card">
          <div className="mes-titulo-preview">{mesAnio || 'Noviembre 2025'}</div>
          
          <form onSubmit={handleSubmit} className="formulario-actividad">
            <div className="form-group-act">
              <label>Nombre de la actividad</label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej: Fútbol, Dentista, Cumpleaños..."
                className="input-act"
                required
                maxLength={100}
              />
            </div>

            <div className="form-group-act">
              <label>Descripción (opcional)</label>
              <input
                type="text"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Detalles adicionales..."
                className="input-act"
                maxLength={500}
              />
            </div>

            <div className="form-group-act">
              <label>Fecha</label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                className="input-act"
                required
              />
            </div>

            <div className="horario-row">
              <div className="form-group-act">
                <label>Hora inicio</label>
                <input
                  type="time"
                  name="horaInicio"
                  value={formData.horaInicio}
                  onChange={handleChange}
                  className="input-act input-time"
                  required
                />
              </div>

              <div className="form-group-act">
                <label>Hora fin</label>
                <input
                  type="time"
                  name="horaFin"
                  value={formData.horaFin}
                  onChange={handleChange}
                  className="input-act input-time"
                  required
                />
              </div>
            </div>

            {error && <div className="error-message-act">{error}</div>}

            <div className="botones-form">
              <button type="button" className="btn-cancelar" onClick={handleCancelar}>
                Cancelar
              </button>
              <button type="submit" className="btn-guardar" disabled={loading}>
                {loading ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>

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

export default AgregarActividad;
