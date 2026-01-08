import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { calendarioAPI, hijoAPI, notificacionAPI, solicitudAPI } from '../services/api';
import './Calendario.css';

const Calendario = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hijoFromState = location.state?.hijo;
  
  const [hijo, setHijo] = useState(null);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [calendario, setCalendario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [colorSeleccionado, setColorSeleccionado] = useState(null);
  const [guardandoColor, setGuardandoColor] = useState(false);
  const [notificacionesCount, setNotificacionesCount] = useState(0);
  const [solicitudesPendientes, setSolicitudesPendientes] = useState([]);

  useEffect(() => {
    const hijoGuardado = localStorage.getItem('hijoSeleccionado');
    if (hijoFromState) {
      setHijo(hijoFromState);
      setColorSeleccionado(hijoFromState.colorPadre);
      localStorage.setItem('hijoSeleccionado', JSON.stringify(hijoFromState));
    } else if (hijoGuardado) {
      const hijo = JSON.parse(hijoGuardado);
      setHijo(hijo);
      setColorSeleccionado(hijo.colorPadre);
    } else {
      navigate('/lista-hijos');
      return;
    }
  }, [hijoFromState, navigate]);

  useEffect(() => {
    if (hijo) {
      cargarCalendario();
      cargarNotificaciones();
      cargarSolicitudesPendientes();
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

  const cargarNotificaciones = async () => {
    try {
      const response = await notificacionAPI.contadorNoLeidas();
      setNotificacionesCount(response.data);
    } catch (error) {
      console.error('Error al cargar notificaciones:', error);
    }
  };

  const cargarSolicitudesPendientes = async () => {
    try {
      const response = await solicitudAPI.recibidas();
      const pendientes = response.data.filter(s => s.estado === 'PENDIENTE');
      setSolicitudesPendientes(pendientes);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
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

  const seleccionarColor = async (color) => {
    if (hijo.colorPadre !== null) {
      alert('El color ya fue seleccionado y no se puede cambiar');
      return;
    }
    
    setGuardandoColor(true);
    const colorOriginal = colorSeleccionado;
    const colorEnMayusculas = color.toUpperCase();
    setColorSeleccionado(colorEnMayusculas); // UI optimista en uppercase
    
    try {
      await hijoAPI.seleccionarColor(hijo.id, colorEnMayusculas);
      
      // Actualizar hijo con el nuevo color
      const hijoActualizado = { ...hijo, colorPadre: colorEnMayusculas };
      setHijo(hijoActualizado);
      localStorage.setItem('hijoSeleccionado', JSON.stringify(hijoActualizado));
    } catch (error) {
      console.error('Error al seleccionar color:', error);
      setColorSeleccionado(colorOriginal); // Rollback
      alert(error.response?.data?.message || 'Error al guardar color');
    } finally {
      setGuardandoColor(false);
    }
  };

  const handleDiaClick = (dia) => {
    if (!dia.vacio && dia.numero) {
      const anio = fechaActual.getFullYear();
      const mes = fechaActual.getMonth() + 1;
      const fecha = `${anio}-${mes.toString().padStart(2, '0')}-${dia.numero.toString().padStart(2, '0')}`;
      const mesAnio = `${nombresMeses[fechaActual.getMonth()]} ${fechaActual.getFullYear()}`;
      
      navigate('/seleccion-dia', { state: { fecha, hijo, mesAnio } });
    }
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
        const fecha = new Date(d.fecha + 'T00:00:00');
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
          <button 
            className="btn-notification-cal" 
            onClick={() => navigate('/notificaciones')}
            style={{ position: 'relative' }}
          >
            🔔
            {notificacionesCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#ff4444',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold'
              }}>
                {notificacionesCount}
              </span>
            )}
          </button>
        </div>

        {colorSeleccionado ? (
          <p className="tu-color-label">
            Tu color: 
            <span 
              className="color-badge-inline" 
              style={{ 
                backgroundColor: colorSeleccionado === 'LILA' ? '#d8b4fe' : '#7dd3fc',
                marginLeft: '8px',
                padding: '2px 12px',
                borderRadius: '12px',
                color: '#1f2937',
                fontWeight: '600'
              }}
            >
              {colorSeleccionado}
            </span>
          </p>
        ) : (
          <div className="color-selector">
            <p className="color-label">Tu color:</p>
            <div className="color-opciones">
              <button
                className="color-btn"
                onClick={() => seleccionarColor('lila')}
                style={{ backgroundColor: '#d8b4fe' }}
                disabled={guardandoColor}
              >
                Lila
              </button>
              <button
                className="color-btn"
                onClick={() => seleccionarColor('celeste')}
                style={{ backgroundColor: '#7dd3fc' }}
                disabled={guardandoColor}
              >
                Celeste
              </button>
            </div>
            {guardandoColor && <p className="guardando-texto">Guardando...</p>}
          </div>
        )}

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
                    onClick={() => handleDiaClick(dia)}
                    style={{ cursor: 'pointer' }}
                  >
                    <span className="dia-numero">{dia.numero}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        </div>

        <div className="acciones-calendario">
          <button className="accion-btn" onClick={() => navigate('/establecer-custodia', { state: { hijo } })}>
            <span className="accion-icon">📅</span>
            <span className="accion-texto">Establecer fechas<br/>de Custodia</span>
          </button>
          
          <button className="accion-btn" onClick={() => navigate('/solicitar-cambio', { state: { hijo } })}>
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
