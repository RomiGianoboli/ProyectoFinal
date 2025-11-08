import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Registro from './pages/Registro';
import Home from './pages/Home';
import ListaHijos from './pages/ListaHijos';
import HomeHijoSeleccionado from './pages/HomeHijoSeleccionado';
import Calendario from './pages/Calendario';
import AgregarHijo from './pages/AgregarHijo';
import Invitacion from './pages/Invitacion';
import Actividades from './pages/Actividades';
import AgregarActividad from './pages/AgregarActividad';
import EditarActividad from './pages/EditarActividad';
import Notificaciones from './pages/Notificaciones';
import Custodias from './pages/Custodias';
import './App.css';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-screen">Cargando...</div>;
  }
  
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Registro />} />
          <Route 
            path="/lista-hijos" 
            element={
              <PrivateRoute>
                <ListaHijos />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/home-hijo" 
            element={
              <PrivateRoute>
                <HomeHijoSeleccionado />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/home" 
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/calendario" 
            element={
              <PrivateRoute>
                <Calendario />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/actividades" 
            element={
              <PrivateRoute>
                <Actividades />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/agregar-hijo" 
            element={
              <PrivateRoute>
                <AgregarHijo />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/invitacion" 
            element={
              <PrivateRoute>
                <Invitacion />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/agregar-actividad" 
            element={
              <PrivateRoute>
                <AgregarActividad />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/editar-actividad" 
            element={
              <PrivateRoute>
                <EditarActividad />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/notificaciones" 
            element={
              <PrivateRoute>
                <Notificaciones />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/custodias" 
            element={
              <PrivateRoute>
                <Custodias />
              </PrivateRoute>
            } 
          />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
