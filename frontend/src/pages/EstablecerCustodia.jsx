import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { solicitudAPI, custodiaAPI } from '../services/api';
import './Calendario.css';

const EstablecerCustodia = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hijoFromState = location.state?.hijo;
  
  const [hijo, setHijo] = useState(null);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [fechaDesde, setFechaDesde] = useState('');
  const [fechaHasta, setFechaHasta] = useState('');
  const [fechasOcupadas, setFechasOcupadas] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const hijoGuardado = localStorage.getItem('hijoSeleccionado');
    if (hijoFromState) {
      setHijo(hijoFromState);
    } else if (hijoGuardado) {
      setHijo(JSON.parse(hijoGuardado));
    } else {
      navigate('/lista-hijos');
    }
  }, [hijoFromState, navigate]);

  useEffect(() => {
    if (hijo) {
      cargarCustodiasExistentes();
    }
  }, [hijo, fechaActual]);

  const cargarCustodiasExistentes = async () => {
    try {
      const anio = fechaActual.getFullYear();
      const mes = fechaActual.getMonth() + 1;
      
      const response = await custodiaAPI.porMes(hijo.id, anio, mes);
      const custodiasConfirmadas = response.data.filter(c => c.estado === 'CONFIRMADA');
      
      setFechasOcupadas(custodiasConfirmadas.map(c => ({
        fecha: c.fecha,
        color: c.colorPadreResponsable,
        esMia: c.esMiCustodia
      })));
    } catch (error) {
      console.error('Error al cargar custodias:', error);
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
      const ocupada = fechasOcupadas.find(f => f.fecha === fecha);
      
      dias.push({
        numero: dia,
        vacio: false,
        fecha,
        ocupada: !!ocupada,
        color: ocupada?.color,
        esMia: ocupada?.esMia
      });
    }
    
    return dias;
  };

  const getDiaClase = (dia) => {
    if (dia.vacio || !dia.numero) return 'dia-celda vacio';
    
    const enRango = fechaDesde && fechaHasta && 
                    dia.fecha >= fechaDesde && 
                    dia.fecha <= fechaHasta;
    
    if (dia.ocupada) {
      const colorClase = dia.color === 'LILA' ? 'custodia-lila' : 'custodia-celeste';
      return `dia-celda ${colorClase} ocupado`;
    }
    
    if (enRango) {
      const miColorClase = hijo?.colorPadre === 'LILA' ? 'custodia-lila' : 'custodia-celeste';
      return `dia-celda ${miColorClase} seleccionado`;
    }
    
    return 'dia-celda';
  };

  const handleGuardar = async () => {
    if (!fechaDesde || !fechaHasta) {
      alert('Debes seleccionar las fechas desde y hasta');
      return;
    }

    if (new Date(fechaHasta) < new Date(fechaDesde)) {
      alert('La fecha hasta debe ser posterior a la fecha desde');
      return;
    }

    let fecha = new Date(fechaDesde + 'T00:00:00');
    const fin = new Date(fechaHasta + 'T00:00:00');
    
    while (fecha <= fin) {
      const fechaStr = `${fecha.getFullYear()}-${(fecha.getMonth() + 1).toString().padStart(2, '0')}-${fecha.getDate().toString().padStart(2, '0')}`;
      const ocupada = fechasOcupadas.find(f => f.fecha === fechaStr);
      
      if (ocupada) {
        alert(`El día ${fecha.toLocaleDateString('es-AR')} ya está ocupado. En "Establecer custodia" no puedes seleccionar fechas ya asignadas.`);
        return;
      }
      
      fecha.setDate(fecha.getDate() + 1);
    }

    setGuardando(true);
    
    try {
      await solicitudAPI.crear({
        hijoId: hijo.id,
        fechaDesde,
        fechaHasta,
        tipoSolicitud: 'ESTABLECER',
        motivo: 'Establecer fechas de custodia'
      });
      
      alert('Solicitud enviada. Esperando confirmación del co-padre');
      navigate('/calendario', { state: { hijo } });
    } catch (error) {
      console.error('Error al establecer fechas:', error);
      alert(error.response?.data?.message || 'Error al establecer fechas de custodia');
    } finally {
      setGuardando(false);
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

          <p style={{ textAlign: 'center', marginBottom: '16px', color: '#666' }}>
            Selecciona el rango de fechas que deseas establecer
          </p>
          <p style={{ textAlign: 'center', marginBottom: '16px', color: '#999', fontSize: '12px' }}>
            Los días con color ya están ocupados
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
                style={{ 
                  cursor: dia.vacio || dia.ocupada ? 'default' : 'pointer',
                  opacity: dia.ocupada ? 0.7 : 1
                }}
              >
                {dia.vacio ? '' : dia.numero}
              </div>
            ))}
          </div>
        </div>

        <div className="seleccion-fechas" style={{ 
          margin: '20px 0',
          padding: '16px',
          background: 'white',
          borderRadius: '12px'
        }}>
          <h3 style={{ marginBottom: '12px', fontSize: '16px' }}>Selecciona el rango de fechas</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                Desde
              </label>
              <input 
                type="date" 
                value={fechaDesde}
                onChange={(e) => setFechaDesde(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5',
                  fontSize: '14px'
                }}
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: '500' }}>
                Hasta
              </label>
              <input 
                type="date" 
                value={fechaHasta}
                onChange={(e) => setFechaHasta(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '8px',
                  border: '1px solid #e5e5e5',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>
        </div>

        <div className="calendario-acciones">
          <button 
            className="btn-accion-secondary" 
            onClick={() => navigate('/calendario', { state: { hijo } })}
          >
            Cancelar
          </button>
          <button 
            className="btn-accion-primary" 
            onClick={handleGuardar}
            disabled={guardando || !fechaDesde || !fechaHasta}
          >
            {guardando ? 'Enviando...' : 'Solicitar fechas'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EstablecerCustodia;
