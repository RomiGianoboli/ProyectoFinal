import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { solicitudAPI } from '../services/api';
import './Calendario.css';

const AprobarRechazarCambio = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const solicitudId = searchParams.get('id');
  
  const [solicitud, setSolicitud] = useState(null);
  const [hijo, setHijo] = useState(null);
  const [procesando, setProcesando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fechaActual, setFechaActual] = useState(new Date());

  useEffect(() => {
    cargarSolicitud();
  }, [solicitudId]);

  const cargarSolicitud = async () => {
    if (!solicitudId) {
      navigate('/calendario');
      return;
    }

    try {
      const hijoGuardado = localStorage.getItem('hijoSeleccionado');
      if (hijoGuardado) {
        setHijo(JSON.parse(hijoGuardado));
      }

      const response = await solicitudAPI.recibidas();
      const solicitudEncontrada = response.data.find(s => s.id === parseInt(solicitudId));
      
      if (!solicitudEncontrada) {
        alert('Solicitud no encontrada');
        navigate('/calendario');
        return;
      }
      
      setSolicitud(solicitudEncontrada);
      
      const fechaSolicitud = new Date(solicitudEncontrada.fechaDesde);
      setFechaActual(fechaSolicitud);
    } catch (error) {
      console.error('Error al cargar solicitud:', error);
      alert('Error al cargar la solicitud');
      navigate('/calendario');
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = async () => {
    setProcesando(true);
    
    try {
      await solicitudAPI.aprobar(solicitud.id);
      alert('Cambio aprobado exitosamente');
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

  if (!solicitud || !hijo) {
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
          <h1 className="logo-calendario">We<br/>Parent</h1>
          <button className="btn-notification">🔔</button>
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

        <div className="mes-navegacion">
          <h2 className="mes-titulo">{nombresMeses[fechaActual.getMonth()]} {fechaActual.getFullYear()}</h2>
        </div>

        <div style={{
          background: 'white',
          padding: '16px',
          borderRadius: '12px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <p style={{ fontWeight: '600', marginBottom: '8px', color: '#1f2937' }}>
            Solicitaron cambio del {formatearFecha(solicitud.fechaDesde)} al {formatearFecha(solicitud.fechaHasta)}
          </p>
          <p style={{ fontSize: '14px', color: '#666' }}>
            Los días resaltados serían intercambiados
          </p>
        </div>

        <div className="semana-header">
          {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map((dia, index) => (
            <div key={index} className="dia-semana">{dia}</div>
          ))}
        </div>

        <div className="calendario-grid">
          {getDiasDelMes().map((dia, index) => (
            <div
              key={index}
              className={getDiaClase(dia)}
            >
              {dia.vacio ? '' : dia.numero}
            </div>
          ))}
        </div>

        <div className="calendario-acciones" style={{ 
          marginTop: '20px',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px'
        }}>
          <button 
            className="btn-volver-cal" 
            onClick={() => navigate('/calendario', { state: { hijo } })}
            style={{ gridColumn: '1' }}
          >
            Volver
          </button>
          <button 
            className="btn-rechazar" 
            onClick={handleRechazar}
            disabled={procesando}
            style={{
              gridColumn: '2',
              background: '#dc2626',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Rechazar
          </button>
          <button 
            className="btn-establecer-custodia" 
            onClick={handleAprobar}
            disabled={procesando}
            style={{ gridColumn: '3' }}
          >
            {procesando ? 'Procesando...' : 'Aprobar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AprobarRechazarCambio;
