import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { solicitudAPI, custodiaAPI } from '../services/api';
import './Calendario.css';

const SolicitarCambio = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hijoFromState = location.state?.hijo;
  
  const [hijo, setHijo] = useState(null);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [todasLasCustodias, setTodasLasCustodias] = useState([]);
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [seleccionando, setSeleccionando] = useState('desde');

  useEffect(() => {
    const hijoGuardado = localStorage.getItem('hijoSeleccionado');
    if (hijoFromState) {
      setHijo(hijoFromState);
    } else if (hijoGuardado) {
      setHijo(JSON.parse(hijoGuardado));
    } else {
      navigate('/lista-hijos');
      return;
    }
  }, [hijoFromState, navigate]);

  useEffect(() => {
    if (hijo) {
      cargarTodasLasCustodias();
    }
  }, [hijo, fechaActual]);

  const cargarTodasLasCustodias = async () => {
    try {
      const anio = fechaActual.getFullYear();
      const mes = fechaActual.getMonth() + 1;
      
      const response = await custodiaAPI.porMes(hijo.id, anio, mes);
      setTodasLasCustodias(response.data.filter(c => c.estado === 'CONFIRMADA'));
    } catch (error) {
      console.error('Error al cargar custodias:', error);
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

  const getDiasDelMes = () => {
    const anio = fechaActual.getFullYear();
    const mes = fechaActual.getMonth();
    
    const primerDia = new Date(anio, mes, 1);
    const ultimoDia = new Date(anio, mes + 1, 0);
    
    const diasVaciosInicio = primerDia.getDay();
    const totalDias = ultimoDia.getDate();
    
    const dias = [];
    
    for (let i = 0; i < diasVaciosInicio; i++) {
      dias.push({ vacio: true });
    }
    
    for (let dia = 1; dia <= totalDias; dia++) {
      const fecha = `${anio}-${(mes + 1).toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
      const custodia = todasLasCustodias.find(c => c.fecha === fecha);
      
      dias.push({
        numero: dia,
        vacio: false,
        fecha,
        tieneCustodia: !!custodia,
        esMiCustodia: custodia?.esMiCustodia,
        color: custodia?.colorPadreResponsable
      });
    }
    
    return dias;
  };

  const handleDiaClick = (dia) => {
    if (dia.vacio) return;
    
    if (seleccionando === 'desde') {
      setFechaDesde(dia.fecha);
      setFechaHasta('');
      setSeleccionando('hasta');
    } else {
      if (dia.fecha < fechaDesde) {
        setFechaDesde(dia.fecha);
        setFechaHasta(fechaDesde);
      } else {
        setFechaHasta(dia.fecha);
      }
      setSeleccionando('desde');
    }
  };

  const limpiarSeleccion = () => {
    setFechaDesde('');
    setFechaHasta('');
    setSeleccionando('desde');
  };

  const getDiaClase = (dia) => {
    if (dia.vacio || !dia.numero) return 'dia-celda vacio';
    
    const esDesde = dia.fecha === fechaDesde;
    const esHasta = dia.fecha === fechaHasta;
    const enRango = fechaDesde && fechaHasta && 
                    dia.fecha >= fechaDesde && 
                    dia.fecha <= fechaHasta;
    
    if (dia.tieneCustodia && !esDesde && !esHasta && !enRango) {
      const colorClase = dia.color === 'LILA' ? 'custodia-lila' : 'custodia-celeste';
      return `dia-celda ${colorClase}`;
    }
    
    if (esDesde || esHasta || enRango) {
      const miColorClase = hijo?.colorPadre === 'LILA' ? 'custodia-lila' : 'custodia-celeste';
      return `dia-celda ${miColorClase} seleccionado`;
    }
    
    if (dia.tieneCustodia) {
      const colorClase = dia.color === 'LILA' ? 'custodia-lila' : 'custodia-celeste';
      return `dia-celda ${colorClase}`;
    }
    
    return 'dia-celda';
  };

  const handleEnviarSolicitud = async () => {
    if (!fechaDesde || !fechaHasta) {
      alert('Debes seleccionar las fechas desde y hasta');
      return;
    }

    if (new Date(fechaHasta) < new Date(fechaDesde)) {
      alert('La fecha hasta debe ser posterior a la fecha desde');
      return;
    }

    setEnviando(true);
    
    try {
      await solicitudAPI.crear({
        hijoId: hijo.id,
        fechaDesde,
        fechaHasta,
        tipoSolicitud: 'CAMBIO',
        motivo: 'Solicitud de cambio de custodia'
      });
      
      alert('Solicitud enviada al co-padre');
      navigate('/calendario', { state: { hijo } });
    } catch (error) {
      console.error('Error al crear solicitud:', error);
      alert(error.response?.data?.message || 'Error al enviar solicitud');
    } finally {
      setEnviando(false);
    }
  };

  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  if (!hijo) {
    return <div className="loading">Cargando...</div>;
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
          >
            🔔
          </button>
        </div>

        {hijo.colorPadre && (
          <p className="tu-color-label">
            Tu color: 
            <span 
              className="color-badge-inline" 
              style={{ 
                backgroundColor: hijo.colorPadre === 'LILA' ? '#d8b4fe' : '#7dd3fc',
                marginLeft: '8px',
                padding: '2px 12px',
                borderRadius: '12px',
                color: '#1f2937',
                fontWeight: '600'
              }}
            >
              {hijo.colorPadre}
            </span>
          </p>
        )}

        <div className="calendario-card">
          <div className="mes-navegacion">
            <button onClick={mesAnterior} className="btn-nav">
              <span>&lt;</span>
            </button>
            <h2 className="mes-titulo">{nombresMeses[fechaActual.getMonth()]} {fechaActual.getFullYear()}</h2>
            <button onClick={mesSiguiente} className="btn-nav">
              <span>&gt;</span>
            </button>
          </div>

          <p style={{ textAlign: 'center', marginBottom: '8px', color: '#666' }}>
            Toca los días para seleccionar el rango
          </p>
          <p style={{ textAlign: 'center', marginBottom: '8px', color: '#ff9b71', fontSize: '14px', fontWeight: '500' }}>
            {seleccionando === 'desde' ? '1. Selecciona el primer día' : '2. Selecciona el último día'}
          </p>
          <p style={{ textAlign: 'center', marginBottom: '16px', color: '#999', fontSize: '12px' }}>
            Puedes seleccionar fechas tuyas o del co-padre
          </p>

          <div className="dias-semana-row">
            {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((dia, index) => (
              <div key={index} className="dia-semana-header">{dia}</div>
            ))}
          </div>

          <div className="dias-grid">
            {getDiasDelMes().map((dia, index) => (
              <div
                key={index}
                className={getDiaClase(dia)}
                onClick={() => handleDiaClick(dia)}
                style={{ cursor: dia.vacio ? 'default' : 'pointer' }}
              >
                {dia.vacio ? '' : dia.numero}
              </div>
            ))}
          </div>
        </div>

        {(fechaDesde || fechaHasta) && (
          <div style={{ 
            margin: '20px 0',
            padding: '16px',
            background: 'white',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
              Rango seleccionado:
            </p>
            <p style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937' }}>
              {fechaDesde ? new Date(fechaDesde + 'T00:00:00').toLocaleDateString('es-AR') : '...'} 
              {' - '} 
              {fechaHasta ? new Date(fechaHasta + 'T00:00:00').toLocaleDateString('es-AR') : '...'}
            </p>
            <button
              onClick={limpiarSeleccion}
              style={{
                marginTop: '8px',
                padding: '6px 16px',
                background: 'transparent',
                border: '1px solid #ddd',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#666'
              }}
            >
              Limpiar seleccion
            </button>
          </div>
        )}

        <div className="calendario-acciones">
          <button 
            className="btn-accion-secondary" 
            onClick={() => navigate('/calendario', { state: { hijo } })}
          >
            Volver
          </button>
          <button 
            className="btn-accion-primary" 
            onClick={handleEnviarSolicitud}
            disabled={enviando || !fechaDesde || !fechaHasta}
          >
            {enviando ? 'Enviando...' : 'Enviar solicitud'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SolicitarCambio;
