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
  const positionCount = { GK: 0, LB: 0, CB: 0, RB: 0, LM: 0, RM: 0, CM: 0, ST: 0 };

  starters.forEach(player => {
    positionCount[player.position] += 1;
  });

  return positionCount;
};

// Función para verificar las posiciones faltantes y sobrantes
const getPositionDifferences = (formation, starters) => {
  const formationData = getFormation(formation, formationsData);
  const positionCount = countPositions(starters);

  // Se obtienen las posiciones de la formación actual
  const formationPositions = formationData.map(p => p.label);

  // Contamos las posiciones en la formación seleccionada
  const maxPositions = {
    GK: 1,
    LB: formationPositions.filter(pos => pos === 'LB').length,
    CB: formationPositions.filter(pos => pos === 'CB').length,
    RB: formationPositions.filter(pos => pos === 'RB').length,
    LM: formationPositions.filter(pos => pos === 'LM').length,
    RM: formationPositions.filter(pos => pos === 'RM').length,
    CM: formationPositions.filter(pos => pos === 'CM').length,
    ST: formationPositions.filter(pos => pos === 'ST').length,
  };

  const missingPositions = [];
  const excessPositions = [];

  // Recorremos las posiciones y verificamos si faltan o sobran jugadores
  Object.keys(maxPositions).forEach(position => {
    const count = positionCount[position] || 0;

    if (count < maxPositions[position]) {
      missingPositions.push(position); // Faltan jugadores
    } else if (count > maxPositions[position]) {
      excessPositions.push(position); // Sobran jugadores
    }
  });

  return { missingPositions, excessPositions };
};

const SoccerField = () => {
  const [formation, setFormation] = useState('4-4-2');
  const [starters, setStarters] = useState(getStarters(playersData)); // Usamos los datos importados de players.json
  const [substitutes, setSubstitutes] = useState(getSubstitutes(playersData)); // Usamos los datos importados de players.json
  const [missingPositions, setMissingPositions] = useState([]); // Estado para las posiciones faltantes
  const [excessPositions, setExcessPositions] = useState([]); // Estado para las posiciones sobrantes

  // Actualiza las posiciones faltantes y sobrantes cuando cambie la formación o los titulares
  useEffect(() => {
    const { missingPositions, excessPositions } = getPositionDifferences(formation, starters);
    setMissingPositions(missingPositions);
    setExcessPositions(excessPositions);
  }, [formation, starters]);

  // Función para mover jugadores entre titulares y suplentes
  const togglePlayerStatus = (player, isStarter) => {
    if (isStarter) {
      // Si el jugador está en titulares, lo movemos a suplentes
      setStarters(starters.filter((p) => p.id !== player.id));
      setSubstitutes([...substitutes, player]);
    } else {
      if (starters.length < 11) {
        // Si hay espacio en los titulares, movemos a suplentes
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
          <button className="btn btn-primary" onClick={() => setFormation('4-4-2')}>
            4-4-2
          </button>
          <button className="btn btn-primary" onClick={() => setFormation('4-3-3')}>
            4-3-3
          </button>
        </div>
        <div className="soccer-field">
          <img src={pitchImage} alt="Soccer Pitch" className="field-image" />
          {getFormation(formation, formationsData).map((player) => (
            <button
              key={player.id}
              className="player-button"
              style={{ top: player.top, left: player.left }}
            >
              {player.label}
            </button>
          ))}
        </div>
      </div>

      {/* Indicador de posiciones faltantes */}
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

      {/* Indicador de posiciones sobrantes */}
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
              <th>Edición</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {starters.map((player, index) => (
              <tr key={index}>
                <td>{player.name}</td>
                <td>{player.position}</td>
                <td>{player.age}</td>
                <td>{player.nationality}</td>
                <td>{player.edition}</td>
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
              <th>Edición</th>
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {substitutes.map((player, index) => (
              <tr key={index}>
                <td>{player.name}</td>
                <td>{player.position}</td>
                <td>{player.age}</td>
                <td>{player.nationality}</td>
                <td>{player.edition}</td>
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
