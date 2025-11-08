import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { custodiaAPI } from '../services/api';
import './Custodias.css';

const Custodias = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hijoFromState = location.state?.hijo;
  
  const [hijo, setHijo] = useState(null);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [custodias, setCustodias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [formData, setFormData] = useState({
    fecha: new Date().toISOString().split('T')[0],
    hijoId: '',
  });

  useEffect(() => {
    const hijoGuardado = localStorage.getItem('hijoSeleccionado');
    if (hijoFromState) {
      setHijo(hijoFromState);
      localStorage.setItem('hijoSeleccionado', JSON.stringify(hijoFromState));
    } else if (hijoGuardado) {
      setHijo(JSON.parse(hijoGuardado));
    } else {
      navigate('/home');
      return;
    }
  }, [hijoFromState, navigate]);

  useEffect(() => {
    if (hijo) {
      setFormData(prev => ({ ...prev, hijoId: hijo.id }));
      cargarCustodias();
    }
  }, [fechaActual, hijo]);

  const cargarCustodias = async () => {
    if (!hijo) return;
    
    try {
      const anio = fechaActual.getFullYear();
      const mes = fechaActual.getMonth() + 1;
      
      const response = await custodiaAPI.porMes(hijo.id, anio, mes);
      setCustodias(response.data);
    } catch (error) {
      console.error('Error al cargar custodias:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await custodiaAPI.establecer(formData);
      setMostrarForm(false);
      cargarCustodias();
      setFormData({
        fecha: new Date().toISOString().split('T')[0],
        hijoId: hijo.id,
      });
    } catch (error) {
      alert('Error al establecer custodia');
    }
  };

  const mesAnterior = () => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setMonth(nuevaFecha.getMonth() - 1);
    setFechaActual(nuevaFecha);
  };

  const mesSiguiente = () => {
    const nuevaFecha = new Date(fechaActual);
    nuevaFecha.setMonth(nuevaFecha.getMonth() + 1);
    setFechaActual(nuevaFecha);
  };

  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  if (!hijo) return null;

  return (
    <div className="custodias-container">
      <header className="custodias-header">
        <button className="btn-back" onClick={() => navigate('/home')}>
          ← Volver
        </button>
        <h1>Custodias</h1>
      </header>

      <div className="custodias-content">
        <div className="hijo-info">
          <h2>{hijo.nombre} {hijo.apellido}</h2>
        </div>

        <div className="mes-navegacion">
          <button className="btn-mes" onClick={mesAnterior}>←</button>
          <h2 className="mes-titulo">
            {nombresMeses[fechaActual.getMonth()]} {fechaActual.getFullYear()}
          </h2>
          <button className="btn-mes" onClick={mesSiguiente}>→</button>
        </div>

        <div className="custodias-list">
          {loading ? (
            <div className="loading">Cargando...</div>
          ) : custodias.length === 0 ? (
            <div className="empty-state">
              <p>No hay fechas de custodia establecidas para este mes</p>
            </div>
          ) : (
            custodias.map((custodia) => (
              <div key={custodia.id} className="custodia-card">
                <div className="custodia-fecha">
                  📅 {new Date(custodia.fecha).toLocaleDateString('es-AR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="custodia-padre">
                  Responsable: {custodia.padreNombre}
                </div>
              </div>
            ))
          )}
        </div>

        {!mostrarForm ? (
          <button
            className="btn-agregar-floating"
            onClick={() => setMostrarForm(true)}
          >
            + Establecer custodia
          </button>
        ) : (
          <div className="form-modal">
            <div className="form-modal-content">
              <h3>Establecer fecha de custodia</h3>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Fecha</label>
                  <input
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                    required
                  />
                </div>
                <div className="form-buttons">
                  <button type="button" className="btn-cancelar" onClick={() => setMostrarForm(false)}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn-primary">
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Custodias;
