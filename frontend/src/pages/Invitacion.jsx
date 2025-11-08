import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { invitacionAPI } from '../services/api';
import './Login.css';

const Invitacion = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      await invitacionAPI.enviar({ emailInvitado: email });
      setSuccess(true);
      setEmail('');
      setTimeout(() => {
        navigate('/agregar-hijo');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar invitación');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/agregar-hijo');
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
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@delcopadre.com"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">
              ¡Invitación enviada!
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar invitación'}
          </button>

          <button type="button" className="btn-secondary" onClick={handleSkip}>
            Omitir por ahora
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
