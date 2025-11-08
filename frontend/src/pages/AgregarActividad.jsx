import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { actividadAPI } from '../services/api';
import './Form.css';

const AgregarActividad = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hijo, fecha } = location.state || {};
  
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    fecha: fecha || new Date().toISOString().split('T')[0],
    hora: '',
    lugar: '',
    hijoId: hijo?.id || '',
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

    try {
      await actividadAPI.crear(formData);
      navigate('/actividades', { state: { hijo } });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear actividad');
    } finally {
      setLoading(false);
    }
  };

  if (!hijo) {
    navigate('/home');
    return null;
  }

  return (
    <div className="form-container">
      <header className="form-header">
        <button className="btn-back" onClick={() => navigate('/actividades', { state: { hijo } })}>
          ← Volver
        </button>
        <h1>Agregar Actividad</h1>
      </header>

      <div className="form-content">
        <div className="logo-small-center">
          <h2>We<br/>Parent</h2>
          <p className="form-subtitle">{hijo.nombre} {hijo.apellido}</p>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Título</label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              placeholder="Ej: Fútbol, Dentista, Cumpleaños..."
              required
            />
          </div>

          <div className="form-group">
            <label>Descripción (opcional)</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Detalles adicionales..."
            />
          </div>

          <div className="form-group">
            <label>Fecha</label>
            <input
              type="date"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Hora (opcional)</label>
            <input
              type="time"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Lugar (opcional)</label>
            <input
              type="text"
              name="lugar"
              value={formData.lugar}
              onChange={handleChange}
              placeholder="Dirección o ubicación"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creando...' : 'Crear actividad'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgregarActividad;
