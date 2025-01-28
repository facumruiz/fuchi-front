import React from 'react';

const Error404 = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh', textAlign: 'center' }}>
      <div>
        <h1 style={{ fontSize: '5rem', fontWeight: 'bold' }}>404</h1>
        <h3>¡Página no encontrada!</h3>
        <img 
          src="https://media3.giphy.com/media/jxczLD31xmvq8dFcgL/giphy.gif?cid=6c09b952cpxgrhkhgp18unlsqgdy6l8e3n40gguo51fuwiqa&ep=v1_gifs_search&rid=giphy.gif&ct=g" 
          alt="Error 404" 
          className="img-fluid" // Esto hace que la imagen sea responsive
          style={{ maxWidth: '70%', height: 'auto' }} 
        />
      </div>
    </div>
  );
};

export default Error404;
