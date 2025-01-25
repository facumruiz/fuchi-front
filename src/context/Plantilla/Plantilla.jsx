import React, { useState, useEffect } from 'react';
import './Plantilla.css';
import pitchImage from './pitch.png';
import playersData from '../../utils/players.json'; // Importamos los jugadores
import formationsData from '../../utils/formations.json'; // Importamos las formaciones

// Funciones utils
const getStarters = (allPlayers) => {
  return allPlayers.slice(0, 11); // Los primeros 11 jugadores
};

const getSubstitutes = (allPlayers) => {
  return allPlayers.slice(11); // Los jugadores restantes
};

const getFormation = (formation, formations) => {
  return formations[formation] || formations['4-4-2']; // Por defecto usa la 4-4-2
};

// Función para contar la cantidad de jugadores por posición en los titulares
const countPositions = (starters) => {
  const positionCount = {};

  starters.forEach(player => {
    positionCount[player.position] = (positionCount[player.position] || 0) + 1;
  });

  return positionCount;
};

// Función para verificar las posiciones faltantes y sobrantes
const getPositionDifferences = (formation, starters) => {
  const formationData = getFormation(formation, formationsData);
  const positionCount = countPositions(starters);

  // Inicializamos las posiciones requeridas según la formación seleccionada
  const requiredPositions = {};
  formationData.forEach(({ label }) => {
    requiredPositions[label] = (requiredPositions[label] || 0) + 1;
  });

  const missingPositions = [];
  const excessPositions = [];

  // Verificamos si faltan o sobran jugadores por posición
  Object.keys(requiredPositions).forEach(position => {
    const currentCount = positionCount[position] || 0;
    const requiredCount = requiredPositions[position];

    if (currentCount < requiredCount) {
      missingPositions.push(`${position} (${requiredCount - currentCount})`);
    } else if (currentCount > requiredCount) {
      excessPositions.push(`${position} (${currentCount - requiredCount})`);
    }
  });

  return { missingPositions, excessPositions };
};

const SoccerField = () => {
  const [formation, setFormation] = useState('4-4-2');
  const [starters, setStarters] = useState(getStarters(playersData));
  const [substitutes, setSubstitutes] = useState(getSubstitutes(playersData));
  const [missingPositions, setMissingPositions] = useState([]);
  const [excessPositions, setExcessPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);


  useEffect(() => {
    const { missingPositions, excessPositions } = getPositionDifferences(formation, starters);
    setMissingPositions(missingPositions);
    setExcessPositions(excessPositions);
  }, [formation, starters]);

  const togglePlayerStatus = (player, isStarter) => {
    if (isStarter) {
      setStarters(starters.filter((p) => p.id !== player.id));
      setSubstitutes([...substitutes, player]);
    } else {
      if (starters.length < 11) {
        setSubstitutes(substitutes.filter((p) => p.id !== player.id));
        setStarters([...starters, player]);
      } else {
        alert('El equipo titular ya está completo. Debes dar de baja a un jugador antes de agregar uno nuevo.');
      }
    }
  };

  return (
    <div className="layout">
      <div className="soccer-field-container">


        <div className="formation-controls">
          {Object.keys(formationsData).map((formationKey) => (
            <button
              key={formationKey}
              className={`btn btn-primary ${formation === formationKey ? 'active' : ''}`}
              onClick={() => setFormation(formationKey)}
            >
              {formationKey}
            </button>
          ))}
        </div>
        {/* Botón de estado */}
        <div className="team-status-button" title="">
          <button
            className={`status-button ${missingPositions.length === 0 && excessPositions.length === 0
              ? 'check'
              : 'warning'
              }`}
            onMouseEnter={() => {
              const info = `
          Faltantes: ${missingPositions.join(', ') || 'Ninguno'}
          Sobrantes: ${excessPositions.join(', ') || 'Ninguno'}
        `;
              document.querySelector('.status-tooltip').innerText = info;
            }}
            onMouseLeave={() => {
              document.querySelector('.status-tooltip').innerText = '';
            }}
          >
            {missingPositions.length === 0 && excessPositions.length === 0 ? '✔️' : '⚠️'}
          </button>
          <div className="status-tooltip"></div>
        </div>
        <div className="soccer-field">
          <img src={pitchImage} alt="Soccer Pitch" className="field-image" />
          {getFormation(formation, formationsData).map((player, index) => (
            <button
              key={index}
              className="player-button"
              style={{
                top: player.top,
                left: player.left,
                transition: 'top 0.5s ease, left 0.5s ease', // Transición suave
              }}
              onClick={() => {
                setSelectedPosition(player.label); // Actualizamos el estado con la posición seleccionada
                const filteredPlayers = starters.filter(p => p.position === player.label);
                console.log(filteredPlayers);
              }}
            >
              {player.label}
            </button>
          ))}

        </div>
      </div>

      {/* Indicador de posiciones faltantes 
      {missingPositions.length > 0 && (
        <div className="missing-positions">
          <h4>Posiciones Faltantes:</h4>
          <ul>
            {missingPositions.map((position, index) => (
              <li key={index}>{position}</li>
            ))}
          </ul>
        </div>
      )}
      */}

      {/* Indicador de posiciones sobrantes 
      {excessPositions.length > 0 && (
        <div className="excess-positions">
          <h4>Posiciones Sobrantes:</h4>
          <ul>
            {excessPositions.map((position, index) => (
              <li key={index}>{position}</li>
            ))}
          </ul>
        </div>
      )}
        */}

      {/* Listado de jugadores titulares */}
      <div className="player-list">
  <h3>Titulares</h3>
  <table>
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Posición</th>
        <th>Edad</th>
        <th>Nacionalidad</th>
        <th>Acción</th>
      </tr>
    </thead>
    <tbody>
      {starters.map((player, index) => (
        <tr
          key={index}
          className={player.position === selectedPosition ? 'highlight-titular' : ''}
        >
          <td>{player.name}</td>
          <td>{player.position}</td>
          <td>{player.age}</td>
          <td>{player.nationality}</td>
          <td>
            <button
              className="bajar-suplentes"
              onClick={() => togglePlayerStatus(player, true)}
            >
              Bajar
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>



      {/* Listado de jugadores suplentes */}
      <div className="player-list">
  <h3>Suplentes</h3>
  <table>
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Posición</th>
        <th>Edad</th>
        <th>Nacionalidad</th>
        <th>Acción</th>
      </tr>
    </thead>
    <tbody>
      {substitutes.map((player, index) => (
        <tr
          key={index}
          className={player.position === selectedPosition ? 'highlight-suplente' : ''}
        >
          <td>{player.name}</td>
          <td>{player.position}</td>
          <td>{player.age}</td>
          <td>{player.nationality}</td>
          <td>
            <button
              className="subir-titulares"
              onClick={() => togglePlayerStatus(player, false)}
            >
              Subir
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default SoccerField;
