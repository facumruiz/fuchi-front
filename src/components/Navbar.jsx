import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Navbar.css'; // Tu CSS personalizado

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid d-flex justify-content-between align-items-center">

        {/* Menú desplegable (izquierda)*/}
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

        {/* Nombre centrado */}
        <div className="navbar-brand fw-bold">
          Plantilla
        </div>

        {/* Avatar (derecha) */}
        <div className="d-flex align-items-center">

          <svg className="rounded-circle avatar-img" xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-person" viewBox="0 0 16 16">
            <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
          </svg>
        </div>

      </div>

      {/* Menú colapsable  */}
      <div className="collapse navbar-collapse" id="navbarNav">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <a className="nav-link" href="/plantilla">Plantilla</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/detalle">Detalles</a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="/contratos">Rendimiento</a>
          </li>
        </ul>
      </div>

    </nav>
  );
};

export default Navbar;
