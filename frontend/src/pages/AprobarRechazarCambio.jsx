import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { solicitudAPI, notificacionAPI } from '../services/api';
import './Calendario.css';

const AprobarRechazarCambio = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const solicitudId = searchParams.get('id');
  
  const [solicitud, setSolicitud] = useState(null);
  const [hijo, setHijo] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [notificacionesCount, setNotificacionesCount] = useState(0);

  useEffect(() => {
    cargarDatos();
  }, [solicitudId]);

  const cargarDatos = async () => {
    if (!solicitudId) {
      navigate('/notificaciones');
      return;
    }

    try {
      const hijoGuardado = localStorage.getItem('hijoSeleccionado');
      if (hijoGuardado) {
        setHijo(JSON.parse(hijoGuardado));
      }

      const [solicitudesRes, notifRes] = await Promise.all([
        solicitudAPI.recibidas(),
        notificacionAPI.contadorNoLeidas()
      ]);
      
      setNotificacionesCount(notifRes.data);
      
      const solicitudEncontrada = solicitudesRes.data.find(s => s.id === parseInt(solicitudId));
      
      if (!solicitudEncontrada) {
        alert('Solicitud no encontrada');
        navigate('/notificaciones');
        return;
      }
      
      setSolicitud(solicitudEncontrada);
      
      const fechaSolicitud = new Date(solicitudEncontrada.fechaDesde);
      setFechaActual(fechaSolicitud);
    } catch (error) {
      console.error('Error al cargar solicitud:', error);
      alert('Error al cargar la solicitud');
      navigate('/notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = async () => {
    setProcesando(true);
    
    try {
      await solicitudAPI.aprobar(solicitud.id);
      alert('Solicitud aprobada. Las fechas han sido asignadas.');
      navigate('/calendario', { state: { hijo } });
    } catch (error) {
      console.error('Error al aprobar:', error);
      alert(error.response?.data?.message || 'Error al aprobar solicitud');
    } finally {
      setProcesando(false);
    }
  };

  const handleRechazar = async () => {
    setProcesando(true);
    
    try {
      await solicitudAPI.rechazar(solicitud.id);
      alert('Solicitud rechazada');
      navigate('/calendario', { state: { hijo } });
    } catch (error) {
      console.error('Error al rechazar:', error);
      alert(error.response?.data?.message || 'Error al rechazar solicitud');
    } finally {
      setProcesando(false);
    }
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha + 'T00:00:00');
    const dia = date.getDate();
    const mes = date.toLocaleString('es', { month: 'long' });
    return `${dia} de ${mes}`;
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
      const enRango = fecha >= solicitud?.fechaDesde && fecha <= solicitud?.fechaHasta;
      
      dias.push({
        numero: dia,
        vacio: false,
        enRango
      });
    }
    
    return dias;
  };

  const getDiaClase = (dia) => {
    if (dia.vacio || !dia.numero) return 'dia-celda vacio';
    
    if (dia.enRango) {
      return 'dia-celda custodia-lila';
    }
    
    return 'dia-celda';
  };

  const nombresMeses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  if (loading) {
    return (
      <div className="calendario-page">
        <div className="loading">Cargando solicitud...</div>
      </div>
    );
  }

  if (!solicitud) {
    return (
      <div className="calendario-page">
        <div className="loading">Solicitud no encontrada</div>
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
                top: '-5px',
                right: '-5px',
                background: '#dc2626',
                color: 'white',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                fontSize: '12px',
                fontWeight: 'bold',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {notificacionesCount}
              </span>
            )}
          </button>
        </div>

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

          <div style={{
            background: '#fff8f0',
            padding: '16px',
            borderRadius: '12px',
            marginBottom: '20px',
            textAlign: 'center',
            border: '2px solid #ff9b71'
          }}>
            <p style={{ fontWeight: '600', marginBottom: '8px', color: '#1f2937', fontSize: '16px' }}>
              {solicitud.nombreSolicitante || 'El co-padre'} solicita estas fechas de custodia:
            </p>
            <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#ff9b71', marginBottom: '8px' }}>
              Del {formatearFecha(solicitud.fechaDesde)} al {formatearFecha(solicitud.fechaHasta)}
            </p>
            <p style={{ fontSize: '14px', color: '#666' }}>
              Los días resaltados en morado serían asignados
            </p>
          </div>

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
              >
                {dia.vacio ? '' : dia.numero}
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '12px',
          marginTop: '20px',
          textAlign: 'center'
        }}>
          <p style={{ fontWeight: '600', marginBottom: '16px', fontSize: '16px' }}>
            ¿Apruebas esta solicitud?
          </p>
          
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '16px'
          }}>
            <button 
              onClick={handleAprobar}
              disabled={procesando}
              style={{
                background: '#22c55e',
                color: 'white',
                border: 'none',
                padding: '16px 24px',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '18px',
                cursor: procesando ? 'not-allowed' : 'pointer',
                opacity: procesando ? 0.6 : 1
              }}
            >
              {procesando ? '...' : 'SI'}
            </button>
            <button 
              onClick={handleRechazar}
              disabled={procesando}
              style={{
                background: '#dc2626',
                color: 'white',
                border: 'none',
                padding: '16px 24px',
                borderRadius: '12px',
                fontWeight: '700',
                fontSize: '18px',
                cursor: procesando ? 'not-allowed' : 'pointer',
                opacity: procesando ? 0.6 : 1
              }}
            >
              {procesando ? '...' : 'NO'}
            </button>
          </div>

          <button 
            onClick={() => navigate('/notificaciones')}
            style={{
              background: 'transparent',
              color: '#666',
              border: '1px solid #ddd',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Volver a notificaciones
          </button>
        </div>
      </div>
    </div>
  );
};

export default AprobarRechazarCambio;
