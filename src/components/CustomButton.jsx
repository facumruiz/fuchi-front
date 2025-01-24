import React from 'react';
import PropTypes from 'prop-types';
import './CustomButton.css'; // Puedes agregar estilos específicos para este botón aquí.

const CustomButton = ({ text, onClick, href, target, rel }) => {
  // Si se proporciona una URL, el botón será un enlace.
  if (href) {
    return (
      <a href={href} target={target} rel={rel}>
        <button className="btn btn-outline-primary custom-button">{text}</button>
      </a>
    );
  }

  // Si no se proporciona una URL, será un botón normal.
  return (
    <button className="btn btn-outline-primary custom-button" onClick={onClick}>
      {text}
    </button>
  );
};

// Definir tipos de propiedades para mejorar la validación.
CustomButton.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  href: PropTypes.string,
  target: PropTypes.string,
  rel: PropTypes.string,
};

// Valores predeterminados de las props.
CustomButton.defaultProps = {
  onClick: null,
  href: null,
  target: '_self',
  rel: 'noopener noreferrer',
};

export default CustomButton;
