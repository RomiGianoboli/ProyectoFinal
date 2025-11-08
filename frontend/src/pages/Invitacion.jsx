import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { invitacionAPI } from '../services/api';
import './Form.css';

const Invitacion = () => {
  const navigate = useNavigate();
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
        navigate('/home');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al enviar invitación');
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
        <h1>Invitar co-padre</h1>
      </header>

      <div className="form-content">
        <div className="logo-small-center">
          <h2>We<br/>Parent</h2>
          <p className="form-subtitle">Invita a un co-padre</p>
        </div>

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@delcopadre.com"
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="success-message">
              ¡Invitación enviada exitosamente!
            </div>
          )}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar invitación'}
          </button>

          <div className="form-hint">
            El co-padre recibirá un email con un enlace para aceptar la invitación.
          </div>
        </form>
      </div>
    </div>
  );
};

export default Invitacion;
