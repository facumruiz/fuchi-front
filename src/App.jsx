import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Ruta según la ubicación del archivo
import SoccerField from './pages/Plantilla/Plantilla'; // Cancha de fútbol
import Error404 from './components/Error404'; // Componente de error
import { getServerStatus } from './services/serverService'; // Importar el servicio
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Incluye Popper.js
import './App.css';

const App = () => {
  const [serverOnline, setServerOnline] = useState(null); // 'null' indica que aún no se ha comprobado el estado del servidor

  const navLinks = [
    { label: 'Inicio', href: '/' },
    { label: 'Plantilla', href: '/plantilla' },
    // Solo mostrar "Estado del Servidor" si el servidor está en línea
    ...(serverOnline ? [{ label: 'Estado del Servidor', href: '/status' }] : []),
  ];

  useEffect(() => {
    // Verificar estado del servidor usando el servicio
    const checkServerStatus = async () => {
      const isOnline = await getServerStatus();
      setServerOnline(isOnline);
    };

    checkServerStatus();
  }, []);

  if (serverOnline === null) {
    // Mientras se verifica el estado del servidor, mostrar el loader
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
        <img
          src="https://media.tenor.com/3QjjiYwBjeYAAAAM/scaloni-manos.gif"
          alt="Cargando servidor"
          className="img-fluid mb-3" // Esto hace que la imagen sea responsive
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          Cargando servidor...
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div>
        <Navbar brand="Mi Asistente Personal" links={navLinks} />
        {!serverOnline ? (
          // Si el servidor no está en línea, mostrar el componente Error404
          <Error404 />
        ) : (
          // Si el servidor está en línea, cargar las rutas
          <Routes>
            <Route path="/" element={<SoccerField />} />
            <Route path="/plantilla" element={<SoccerField />} />
            {/* Ruta para manejar las rutas no definidas (Error 404) */}
            <Route path="*" element={<Error404 />} />
          </Routes>
        )}
      </div>
    </Router>
  );
};

export default App;
