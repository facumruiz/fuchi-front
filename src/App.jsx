import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Ruta según la ubicación del archivo
import Home from './context/Home/Home'; // Componente que ya tienes
import SoccerField from './context/Plantilla/Plantilla'; // Cancha de fútbol
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Incluye Popper.js

const App = () => {
  const navLinks = [
    { label: 'Inicio', href: '/' },
    { label: 'Plantilla', href: '/plantilla' }, // Ajusta la etiqueta y ruta
  ];

  return (
    <Router>
      <div>
        <Navbar brand="Mi Asistente Personal" links={navLinks} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plantilla" element={<SoccerField />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
