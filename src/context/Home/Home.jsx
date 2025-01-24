import React from 'react';
import './Home.css';
import CustomButton from '../../components/CustomButton'; // Importa el componente reutilizable

const Home = () => {
  return (
    <div className="container mt-5">
      <div className="row align-items-center">
        {/* Columna de texto */}
        <div className="col-12 col-md-6 text-center text-md-start">
          <h1 className="display-4 fw-bold title">BIENVENIDO A TU ASISTENTE PERSONAL</h1>
          <p className="lead">Administra rápidamente tu plantilla</p>

          {/* Botones */}
          <div className="d-flex gap-3 mt-4 flex-wrap">
            <CustomButton text="Agregar Plantilla" />
            <CustomButton text="Agregar Preselección" />
          </div>
        </div>

        {/* Columna de imagen */}
        <div className="col-12 col-md-4 text-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Soccer_pitch_transparent_25p_grey.svg/1200px-Soccer_pitch_transparent_25p_grey.svg.png"
            alt="Soccer Field"
            className="img-fluid soccer-image"
          />
        </div>
      </div>

      {/* Nueva fila para "Aplicaciones Favoritas" */}
      <div className="row mt-5">
        <div className="col-12 text-center">
          <h2 className="text-white fw-bold">Aplicaciones Favoritas</h2>
          <div className="d-flex justify-content-center gap-4 mt-3 flex-wrap">
            <CustomButton
              text="BeSoccer"
              href="https://www.besoccer.com"
              target="_blank"
            />
            <CustomButton
              text="Transfermarkt"
              href="https://www.transfermarkt.com"
              target="_blank"
            />
            <CustomButton
              text="Wyscout"
              href="https://www.wyscout.com"
              target="_blank"
            />
            <CustomButton
              text="CMMPlay"
              href="https://www.cmmplay.com"
              target="_blank"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
