import axios from 'axios';

const API_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  validate: () => api.get('/auth/validate'),
};

export const hijoAPI = {
  crear: (data) => api.post('/hijos/crear', data),
  misHijos: () => api.get('/hijos/mis-hijos'),
  vincular: (data) => api.post('/hijos/vincular', data),
};

export const actividadAPI = {
  crear: (data) => api.post('/actividades', data),
  editar: (id, data) => api.put(`/actividades/${id}`, data),
  eliminar: (id) => api.delete(`/actividades/${id}`),
  porFecha: (hijoId, fecha) => api.get(`/actividades/hijo/${hijoId}/fecha/${fecha}`),
  porMes: (hijoId, anio, mes) => api.get(`/actividades/hijo/${hijoId}/mes/${anio}/${mes}`),
};

export const custodiaAPI = {
  establecer: (data) => api.post('/custodias', data),
  porMes: (hijoId, anio, mes) => api.get(`/custodias/hijo/${hijoId}/mes/${anio}/${mes}`),
};

export const calendarioAPI = {
  mesCompleto: (hijoId, anio, mes) => api.get(`/calendario/hijo/${hijoId}/mes/${anio}/${mes}`),
};

export const notificacionAPI = {
  misNotificaciones: () => api.get('/notificaciones/mis-notificaciones'),
  marcarLeida: (id) => api.post(`/notificaciones/${id}/leer`),
  contadorNoLeidas: () => api.get('/notificaciones/no-leidas/count'),
};

export const invitacionAPI = {
  enviar: (data) => api.post('/invitaciones/enviar', data),
  aceptar: (token) => api.post(`/invitaciones/aceptar/${token}`),
  pendientes: () => api.get('/invitaciones/pendientes'),
};

export const solicitudAPI = {
  crear: (data) => api.post('/solicitudes-cambio', data),
  aprobar: (id) => api.post(`/solicitudes-cambio/${id}/aprobar`),
  rechazar: (id) => api.post(`/solicitudes-cambio/${id}/rechazar`),
  pendientes: () => api.get('/solicitudes-cambio/pendientes'),
};

export default api;
