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
    
    if (dia.cantidadActividades > 0) {
      clases.push('tiene-actividades');
    }
    
    if (dia.tieneCambioSolicitado) {
      clases.push('tiene-solicitud');
    }
    
    const hoy = new Date();
    const fechaDia = new Date(dia.fecha);
    if (
      fechaDia.getDate() === hoy.getDate() &&
      fechaDia.getMonth() === hoy.getMonth() &&
      fechaDia.getFullYear() === hoy.getFullYear()
    ) {
      clases.push('dia-hoy');
    }
    
    return clases.join(' ');
  };

  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  if (loading) {
    return (
      <div className="calendario-container">
        <div className="loading">Cargando calendario...</div>
      </div>
    );
  }

  return (
    <div className="calendario-container">
      <header className="calendario-header">
        <button className="btn-back" onClick={() => navigate('/home')}>
          ← Volver
        </button>
        <h1>{hijo?.nombre} {hijo?.apellido}</h1>
      </header>

      <div className="mes-navegacion">
        <button className="btn-mes" onClick={mesAnterior}>←</button>
        <h2 className="mes-titulo">
          {nombresMeses[fechaActual.getMonth()]} {fechaActual.getFullYear()}
        </h2>
        <button className="btn-mes" onClick={mesSiguiente}>→</button>
      </div>

      <div className="calendario-grid">
        {diasSemana.map(dia => (
          <div key={dia} className="dia-semana">{dia}</div>
        ))}
        
        {calendario?.dias?.map((dia, index) => {
          const fecha = new Date(dia.fecha);
          const primerDia = index === 0;
          const diaSemana = fecha.getDay();
          
          return (
            <React.Fragment key={dia.fecha}>
              {primerDia && diaSemana > 0 && 
                Array.from({ length: diaSemana }).map((_, i) => (
                  <div key={`empty-${i}`} className="dia-celda vacio"></div>
                ))
              }
              <div className={getDiaClase(dia)}>
                <div className="dia-numero">{fecha.getDate()}</div>
                {dia.cantidadActividades > 0 && (
                  <div className="actividad-badge">{dia.cantidadActividades}</div>
                )}
                {dia.tieneCambioSolicitado && (
                  <div className="solicitud-badge">!</div>
                )}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="leyenda">
        <div className="leyenda-item">
          <div className="leyenda-color custodia-lila"></div>
          <span>Custodia Padre 1</span>
        </div>
        <div className="leyenda-item">
          <div className="leyenda-color custodia-celeste"></div>
          <span>Custodia Padre 2</span>
        </div>
        <div className="leyenda-item">
          <div className="leyenda-badge">3</div>
          <span>Actividades</span>
        </div>
        <div className="leyenda-item">
          <div className="leyenda-badge-solicitud">!</div>
          <span>Cambio solicitado</span>
        </div>
      </div>
    </div>
  );
};

export default Calendario;
