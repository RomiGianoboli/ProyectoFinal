import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

function Home() {
  return (
    <div className="home-container">
      <div className="hero">
        <h1>DerWeParent</h1>
        <p className="subtitle">Sistema de Coordinación Parental</p>
        <p className="description">
          Gestiona actividades, fechas de custodia y comunicación entre padres/tutores de manera simple y efectiva.
        </p>
        <div className="status-badge">
          <span className="status-icon">✓</span>
          Sistema Activo
        </div>
      </div>
      
      <div className="features">
        <div className="feature-card">
          <div className="feature-icon">👥</div>
          <h3>Gestión de Co-padres</h3>
          <p>Invita y coordina con otros tutores</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📅</div>
          <h3>Calendario de Custodia</h3>
          <p>Organiza fechas y solicita cambios</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">🎯</div>
          <h3>Actividades</h3>
          <p>Registra y gestiona actividades de tus hijos</p>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
