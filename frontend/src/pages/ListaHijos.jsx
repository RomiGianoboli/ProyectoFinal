import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hijoAPI } from '../services/api';
import './ListaHijos.css';

const ListaHijos = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [hijos, setHijos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarHijos();
  }, []);

  const cargarHijos = async () => {
    try {
      const response = await hijoAPI.misHijos();
      setHijos(response.data);
    } catch (error) {
      console.error('Error al cargar hijos:', error);
    } finally {
      setLoading(false);
    }
  };

  const seleccionarHijo = (hijo) => {
    localStorage.setItem('hijoSeleccionado', JSON.stringify(hijo));
    navigate('/home-hijo');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="lista-hijos-container">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="lista-hijos-container">
      <div className="lista-hijos-card">
        <div className="header-lista">
          <div className="logo-lista">
            <h1>We<br/>Parent</h1>
          </div>
          <button className="btn-notification">
            <span className="bell-icon">🔔</span>
          </button>
        </div>

        <div className="greeting-section">
          <h2>Bienvenido {user?.nombre || ''}</h2>
        </div>

        {hijos.length === 0 ? (
          <div className="empty-hijos">
            <p>No tienes hijos registrados</p>
            <button 
              onClick={() => navigate('/invitacion')}
              className="btn-primary"
            >
              Agregar hijo
            </button>
          </div>
        ) : (
          <div className="hijos-grid">
            {hijos.map((hijo) => (
              <button
                key={hijo.id}
                onClick={() => seleccionarHijo(hijo)}
                className="hijo-card"
              >
                <span className="hijo-nombre">
                  {hijo.nombre} {hijo.apellido}
                </span>
              </button>
            ))}
          </div>
        )}

        <button 
          onClick={handleLogout}
          className="btn-salir"
        >
          Salir
        </button>
      </div>
    </div>
  );
};

export default ListaHijos;
