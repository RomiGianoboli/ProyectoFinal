import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { actividadAPI } from '../services/api';
import './Form.css';

const EditarActividad = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { actividad, hijo } = location.state || {};
  
  const [formData, setFormData] = useState({
    titulo: actividad?.titulo || '',
    descripcion: actividad?.descripcion || '',
    fecha: actividad?.fecha || '',
    hora: actividad?.hora || '',
    lugar: actividad?.lugar || '',
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
      await actividadAPI.editar(actividad.id, formData);
      navigate('/actividades', { state: { hijo } });
    } catch (err) {
      setError(err.response?.data?.message || 'Error al editar actividad');
    } finally {
      setLoading(false);
    }
  };

  if (!actividad || !hijo) {
    navigate('/home');
    return null;
  }

  return (
    <div className="form-container">
      <header className="form-header">
        <button className="btn-back" onClick={() => navigate('/actividades', { state: { hijo } })}>
          ← Volver
        </button>
        <h1>Editar Actividad</h1>
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
              placeholder="Título de la actividad"
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
            {loading ? 'Guardando...' : 'Guardar cambios'}
          </button>

          <div className="form-hint">
            Nota: Si editas una actividad creada por tu co-padre, quedará pendiente de su aprobación.
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarActividad;
