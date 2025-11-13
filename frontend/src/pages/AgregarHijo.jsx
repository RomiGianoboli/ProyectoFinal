import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hijoAPI } from '../services/api';
import './Form.css';

const AgregarHijo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
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
      await hijoAPI.crear(formData);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al agregar hijo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <header className="form-header">
        <button className="btn-back" onClick={() => navigate('/home')}>
          ← Volver
        </button>
        <h1>Agregar hijo</h1>
      </header>

      <div className="form-content">
        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre del hijo"
              required
            />
          </div>

          <div className="form-group">
            <label>Apellido</label>
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Apellido del hijo"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Agregando...' : 'Agregar hijo'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AgregarHijo;
