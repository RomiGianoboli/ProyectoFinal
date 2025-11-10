import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { custodiaAPI } from '../services/api';
import './Calendario.css';

const EstablecerCustodia = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hijoFromState = location.state?.hijo;
  
  const [hijo, setHijo] = useState(null);
  const [fechaActual, setFechaActual] = useState(new Date());
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
  const [custodias, setCustodias] = useState([]);
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
      const misCustodias = response.data.filter(c => c.esMiCustodia && (c.estado === 'PENDIENTE' || c.estado === 'CONFIRMADA'));
      
      const fechas = misCustodias.map(c => c.fecha);
      setDiasSeleccionados(fechas);
      setCustodias(response.data);
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

  const toggleDia = (dia) => {
    if (dia.vacio || !dia.numero) return;
    
    const anio = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1;
    const fecha = `${anio}-${mes.toString().padStart(2, '0')}-${dia.numero.toString().padStart(2, '0')}`;
    
    setDiasSeleccionados(prev => {
      if (prev.includes(fecha)) {
        return prev.filter(f => f !== fecha);
      } else {
        return [...prev, fecha];
      }
    });
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
      dias.push({
        numero: dia,
        vacio: false
      });
    }
    
    return dias;
  };

  const getDiaClase = (dia) => {
    if (dia.vacio || !dia.numero) return 'dia-celda vacio';
    
    const anio = fechaActual.getFullYear();
    const mes = fechaActual.getMonth() + 1;
    const fecha = `${anio}-${mes.toString().padStart(2, '0')}-${dia.numero.toString().padStart(2, '0')}`;
    
    const seleccionado = diasSeleccionados.includes(fecha);
    const colorClase = hijo?.colorPadre === 'LILA' ? 'custodia-lila' : 'custodia-celeste';
    
    return `dia-celda ${seleccionado ? colorClase : ''}`;
  };

  const handleGuardar = async () => {
    if (diasSeleccionados.length === 0) {
      alert('Debes seleccionar al menos un día');
      return;
    }

    setGuardando(true);
    
    try {
      await custodiaAPI.establecer({
        hijoId: hijo.id,
        fechas: diasSeleccionados
      });
      
      alert('Fechas enviadas. Esperando confirmación del co-padre');
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
            ¿Qué días quieres establecer como tuyos?
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
                onClick={() => toggleDia(dia)}
                style={{ cursor: dia.vacio ? 'default' : 'pointer' }}
              >
                {dia.vacio ? '' : dia.numero}
              </div>
            ))}
          </div>
        </div>

        <div className="calendario-acciones">
          <button 
            className="btn-volver-cal" 
            onClick={() => navigate('/calendario', { state: { hijo } })}
          >
            Cancelar
          </button>
          <button 
            className="btn-establecer-custodia" 
            onClick={handleGuardar}
            disabled={guardando || diasSeleccionados.length === 0}
          >
            {guardando ? 'Guardando...' : `Establecer (${diasSeleccionados.length} días)`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EstablecerCustodia;
