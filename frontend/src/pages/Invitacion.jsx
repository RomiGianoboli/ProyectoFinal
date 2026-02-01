import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { invitacionAPI, hijoAPI } from '../services/api';
import './Login.css';

const Invitacion = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [formData, setFormData] = useState({
    nombreCoPadre: '',
    apellidoCoPadre: '',
    emailCoPadre: '',
    hijos: [{ nombre: '', apellido: '', fechaNacimiento: '' }]
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleHijoChange = (index, field, value) => {
    const nuevosHijos = [...formData.hijos];
    nuevosHijos[index][field] = value;
    setFormData({ ...formData, hijos: nuevosHijos });
  };

  const agregarOtroHijo = () => {
    setFormData({
      ...formData,
      hijos: [...formData.hijos, { nombre: '', apellido: '', fechaNacimiento: '' }]
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Crear los hijos primero
      for (const hijo of formData.hijos) {
        if (hijo.nombre && hijo.apellido) {
          await hijoAPI.crear({
            nombre: hijo.nombre,
            apellido: hijo.apellido,
            fechaNacimiento: hijo.fechaNacimiento || null
          });
        }
      }

      // Si hay datos de co-padre, enviar invitación
      if (formData.nombreCoPadre && formData.apellidoCoPadre && formData.emailCoPadre) {
        await invitacionAPI.enviar({
          nombreCoPadre: formData.nombreCoPadre,
          apellidoCoPadre: formData.apellidoCoPadre,
          emailCoPadre: formData.emailCoPadre
        });
      }

      navigate('/lista-hijos');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al procesar la información');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">
          <h1>We<br/>Parent</h1>
          <p className="subtitle">Invita a tu co-padre</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <input
              type="text"
              name="nombreCoPadre"
              value={formData.nombreCoPadre}
              onChange={handleChange}
              placeholder="Nombre"
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              name="apellidoCoPadre"
              value={formData.apellidoCoPadre}
              onChange={handleChange}
              placeholder="Apellido"
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              name="emailCoPadre"
              value={formData.emailCoPadre}
              onChange={handleChange}
              placeholder="Email"
            />
          </div>

          <div className="form-section-title">Agrega a tu hijo/a</div>

          {formData.hijos.map((hijo, index) => (
            <div key={index}>
              <div className="form-group">
                <input
                  type="text"
                  value={hijo.nombre}
                  onChange={(e) => handleHijoChange(index, 'nombre', e.target.value)}
                  placeholder="Nombre"
                />
              </div>

              <div className="form-group">
                <input
                  type="text"
                  value={hijo.apellido}
                  onChange={(e) => handleHijoChange(index, 'apellido', e.target.value)}
                  placeholder="Apellido"
                />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '14px', color: '#666', marginBottom: '4px', display: 'block' }}>
                  Fecha de nacimiento
                </label>
                <input
                  type="date"
                  value={hijo.fechaNacimiento}
                  onChange={(e) => handleHijoChange(index, 'fechaNacimiento', e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>
          ))}

          <div className="add-another-link" onClick={agregarOtroHijo}>
            + Agregar otro hijo
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Procesando...' : 'Continuar'}
          </button>

          <button type="button" className="btn-secondary" onClick={handleLogout}>
            Salir
          </button>
        </form>
      </div>
    </div>
  );
};

export default Invitacion;
