import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Registro = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    if (formData.password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);

    try {
      await register(formData.nombre, formData.apellido, formData.email, formData.password);
      navigate('/agregar-hijo');
    } catch (err) {
      console.error('Error de registro:', err);
      
      // Manejar errores específicos del backend
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        // Si el backend devuelve errores de validación
        const errores = err.response.data.errors;
        if (errores.password) {
          setError(errores.password);
        } else {
          setError(Object.values(errores)[0] || 'Error al registrarse');
        }
      } else if (err.response?.status === 400) {
        setError('Los datos ingresados no son válidos. Verifica que la contraseña tenga al menos 8 caracteres.');
      } else {
        setError('Error al registrarse. Por favor, intenta nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="logo">
          <h1>We<br/>Parent</h1>
          <p className="subtitle">Crea tu cuenta de padre</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Nombre</label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
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
              placeholder="Tu apellido"
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="tu@email.com"
              required
            />
          </div>

          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              required
            />
            {formData.password.length > 0 && formData.password.length < 8 && (
              <small style={{ color: '#ff6b6b', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                ⚠️ La contraseña debe tener al menos 8 caracteres ({formData.password.length}/8)
              </small>
            )}
            {formData.password.length >= 8 && (
              <small style={{ color: '#51cf66', fontSize: '12px', marginTop: '4px', display: 'block' }}>
                ✓ Contraseña válida
              </small>
            )}
          </div>

          <div className="form-group">
            <label>Repetir contraseña</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirma tu contraseña"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

          <div className="register-link">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Registro;
