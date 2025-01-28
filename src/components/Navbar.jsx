import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css'; // Tu CSS personalizado

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid d-flex justify-content-between align-items-center">

        {/* Menú desplegable (izquierda)
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
 */}
        {/* Nombre centrado */}
        <div className="navbar-brand fw-bold">
          Plantilla
        </div>

        {/* Avatar (derecha) 
        <div className="d-flex align-items-center">
          <img
            src="https://via.placeholder.com/40" 
            alt="Avatar"
            className="rounded-circle avatar-img"
          />
        </div>
        */}
      </div>

      {/* Menú colapsable 
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto"> 
          <li className="nav-item">
            <a className="nav-link" href="/">Inicio</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/preseleccion">Preselección</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/contratos">Contratos</a>
          </li>
        </ul>
      </div>
      */}
    </nav>
  );
};

export default Navbar;
