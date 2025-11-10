import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { calendarioAPI } from '../services/api';
import './Calendario.css';

const Calendario = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hijoFromState = location.state?.hijo;
  
  const [hijo, setHijo] = useState(null);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [calendario, setCalendario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [colorSeleccionado, setColorSeleccionado] = useState('lila');

  useEffect(() => {
    const hijoGuardado = localStorage.getItem('hijoSeleccionado');
    if (hijoFromState) {
      setHijo(hijoFromState);
      localStorage.setItem('hijoSeleccionado', JSON.stringify(hijoFromState));
    } else if (hijoGuardado) {
      setHijo(JSON.parse(hijoGuardado));
    } else {
      navigate('/lista-hijos');
      return;
    }
  }, [hijoFromState, navigate]);

  useEffect(() => {
    if (hijo) {
      cargarCalendario();
    }
  }, [fechaActual, hijo]);

  const cargarCalendario = async () => {
    try {
      const anio = fechaActual.getFullYear();
      const mes = fechaActual.getMonth() + 1;
      
      const response = await calendarioAPI.mesCompleto(hijo.id, anio, mes);
      setCalendario(response.data);
    } catch (error) {
      console.error('Error al cargar calendario:', error);
    } finally {
      setLoading(false);
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

  const getDiaClase = (dia) => {
    let clases = ['dia-celda'];
    
    if (dia.colorCustodia) {
      clases.push(`custodia-${dia.colorCustodia.toLowerCase()}`);
    }
    
    return clases.join(' ');
  };

  const getDiasDelMes = () => {
    const anio = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();
    
    const primerDia = new Date(anio, mes, 1);
    const ultimoDia = new Date(anio, mes + 1, 0);
    
    const diasVaciosInicio = primerDia.getDay();
    const totalDias = ultimoDia.getDate();
    
    const dias = [];
    
    for (let i = 0; i < diasVaciosInicio; i++) {
      dias.push({ vacio: true, key: `vacio-${i}` });
    }
    
    for (let dia = 1; dia <= totalDias; dia++) {
      const diaData = calendario?.dias?.find(d => {
        const fecha = new Date(d.fecha);
        return fecha.getDate() === dia;
      });
      
      dias.push({
        numero: dia,
        key: `dia-${dia}`,
        colorCustodia: diaData?.colorCustodia || null
      });
    }
    
    return dias;
  };

  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const diasSemana = ['S', 'L', 'M', 'M', 'J', 'V', 'S'];

  if (loading) {
    return (
      <div className="calendario-page">
        <div className="loading">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="calendario-page">
      <div className="calendario-container">
        <div className="calendario-header">
          <div className="logo-calendario">
            <h1>We<br/>Parent</h1>
          </div>
          <button className="btn-notification-cal">
            🔔
          </button>
        </div>

        <div className="color-selector">
          <p className="color-label">Tu color:</p>
          <div className="color-opciones">
            <button
              className={`color-btn ${colorSeleccionado === 'lila' ? 'active' : ''}`}
              onClick={() => setColorSeleccionado('lila')}
              style={{ backgroundColor: '#d8b4fe' }}
            >
              {colorSeleccionado === 'lila' && '✓'}
            </button>
            <button
              className={`color-btn ${colorSeleccionado === 'celeste' ? 'active' : ''}`}
              onClick={() => setColorSeleccionado('celeste')}
              style={{ backgroundColor: '#7dd3fc' }}
            >
              {colorSeleccionado === 'celeste' && '✓'}
            </button>
          </div>
        </div>

        <div className="calendario-card">
          <div className="mes-navegacion">
            <button className="btn-nav" onClick={mesAnterior}>
              <span>&lt;</span>
            </button>
            <h2 className="mes-titulo">
              {nombresMeses[fechaActual.getMonth()]} {fechaActual.getFullYear()}
            </h2>
            <button className="btn-nav" onClick={mesSiguiente}>
              <span>&gt;</span>
            </button>
          </div>

          <div className="calendario-grid">
            <div className="dias-semana-row">
              {diasSemana.map(dia => (
                <div key={dia} className="dia-semana-header">{dia}</div>
              ))}
            </div>
            
            <div className="dias-grid">
              {getDiasDelMes().map(dia => (
                dia.vacio ? (
                  <div key={dia.key} className="dia-celda vacio"></div>
                ) : (
                  <div 
                    key={dia.key} 
                    className={`dia-celda ${dia.colorCustodia ? `custodia-${dia.colorCustodia.toLowerCase()}` : ''}`}
                  >
                    <span className="dia-numero">{dia.numero}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>

        <div className="acciones-calendario">
          <button className="accion-btn" onClick={() => navigate('/establecer-custodia')}>
            <span className="accion-icon">📅</span>
            <span className="accion-texto">Establecer fechas<br/>de Custodia</span>
          </button>
          
          <button className="accion-btn" onClick={() => navigate('/solicitar-cambio')}>
            <span className="accion-icon">🔄</span>
            <span className="accion-texto">Solicitar cambio</span>
          </button>
        </div>

        <button className="btn-volver" onClick={() => navigate('/home-hijo')}>
          Volver
        </button>
      </div>
    </div>
  );
};

export default Calendario;
