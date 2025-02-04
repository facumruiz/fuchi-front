import React, { useState, useEffect, useRef } from 'react';
import './Plantilla.css';
import pitchImage from './pitch.png';
import formationsData from '../../utils/formations.json'; // Importamos las formaciones
import ModalPlantilla from '../../components/ModalPlantilla';
import { getPlayers, updatePlayerStatus } from '../../services/playerService';

// Funciones utils
const getFormation = (formation, formations) => {
  return formations[formation] || formations['4-4-2']; // Por defecto usa la 4-4-2
};

// Función para contar la cantidad de jugadores por posición en los titulares
const countPositions = (players) => {
  const positionCount = {};
  players.forEach(player => {
    positionCount[player.perfilFutbolistico.posicionNatural] = (positionCount[player.perfilFutbolistico.posicionNatural] || 0) + 1;
  });
  return positionCount;
};

const getPositionDifferences = (formation, titulares) => {
  // Obtener datos de la formación y conteo de posiciones
  const formationData = getFormation(formation, formationsData);
  const positionCount = countPositions(titulares);

  // Crear el objeto de posiciones requeridas basado en la formación
  const requiredPositions = {};
  formationData.forEach(({ label }) => {
    requiredPositions[label] = (requiredPositions[label] || 0) + 1;
  });

  //console.log('Conteo de posiciones en titulares:', positionCount); // Depuración

  const missingPositions = [];
  const excessPositions = [];

  // Calcular posiciones faltantes y sobrantes
  // Iteramos sobre todas las posiciones existentes en titulares (positionCount) y en la formación requerida (requiredPositions)
  const allPositions = new Set([...Object.keys(positionCount), ...Object.keys(requiredPositions)]);

  allPositions.forEach(position => {
    const currentCount = positionCount[position] || 0;
    const requiredCount = requiredPositions[position] || 0;

    //console.log(`Comprobando posición: ${position} | Actual: ${currentCount} | Requerido: ${requiredCount}`); // Depuración

    // Calcular posiciones faltantes
    if (currentCount < requiredCount) {
      missingPositions.push(`${position} (${requiredCount - currentCount})`);
    }

    // Calcular posiciones sobrantes
    if (currentCount > requiredCount) {
      excessPositions.push(`${position} (${currentCount - requiredCount})`);
    }
  });

  //console.log('Posiciones faltantes:', missingPositions); // Depuración
  //console.log('Posiciones sobrantes:', excessPositions); // Depuración

  return { missingPositions, excessPositions };
};


// Mapeo de posiciones específicas a categorías generales
const positionMapping = {
  GK: "Arquero",
  CB: "Defensa",
  LB: "Defensa",
  RB: "Defensa",
  LWB: "Defensa",
  RWB: "Defensa",
  CDM: "Mediocampista",
  CM: "Mediocampista",
  LM: "Mediocampista",
  RM: "Mediocampista",
  CAM: "Mediocampista",
  LAM: "Mediocampista",
  RAM: "Mediocampista",
  ST: "Delantero",
};

// Orden de las categorías generales
const positionOrder = ["Arquero", "Defensa", "Mediocampista", "Delantero"];

// Función para ordenar jugadores por posición
const sortPlayersByPosition = (players) => {
  return [...players].sort((a, b) => {
    const positionA = positionMapping[a.perfilFutbolistico.posicionNatural] || "Otros";
    const positionB = positionMapping[b.perfilFutbolistico.posicionNatural] || "Otros";
    return positionOrder.indexOf(positionA) - positionOrder.indexOf(positionB);
  });
};

const SoccerField = () => {
  const [formation, setFormation] = useState('4-4-2');
  const [titulares, setTitulares] = useState([]);
  const [suplentes, setSuplentes] = useState([]);
  const [missingPositions, setMissingPositions] = useState([]);
  const [excessPositions, setExcessPositions] = useState([]);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [loading, setLoading] = useState(true);  // Estado para controlar la carga de los datos
  const tooltipRef = useRef(null); // Usamos un ref para el tooltip

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);  // Empieza la carga de jugadores
        const { titulares, suplentes } = await getPlayers();
        setTitulares(titulares); // Guardamos los titulares
        setSuplentes(suplentes); // Guardamos los suplentes
      } catch (error) {
        console.error('Error al obtener los jugadores:', error);
      } finally {
        setLoading(false);  // Finaliza la carga
      }
    };

    fetchPlayers();
  }, []);

  useEffect(() => {
    const { missingPositions, excessPositions } = getPositionDifferences(formation, titulares);
    setMissingPositions(missingPositions);
    setExcessPositions(excessPositions);
  }, [formation, titulares]);

  const togglePlayerStatus = async (player, isStarter) => {
    if (!player || !player._id) {
      console.error('El jugador o su _id no está definido.');
      return;
    }

    try {
      // Verificar si el equipo titular ya está completo
      if (!isStarter && titulares.length >= 11) {
        alert('El equipo titular ya está completo. Debes dar de baja a un jugador antes de agregar uno nuevo.');
        return; // No continuar con la actualización si ya hay 11 titulares
      }

      // Determinar el nuevo estado
      const newStatus = isStarter ? 'Suplente' : 'Titular';

      // Actualizar estado en el backend
      await updatePlayerStatus(player._id, newStatus);

      // Actualizar los estados locales
      setTitulares((prevTitulares) =>
        isStarter
          ? prevTitulares.filter((p) => p._id !== player._id) // Remover de titulares
          : [...prevTitulares, {
            ...player,
            perfilFutbolistico: { ...player.perfilFutbolistico, estado: 'Titular' }
          }]
      );

      setSuplentes((prevSuplentes) =>
        isStarter
          ? [...prevSuplentes, {
            ...player,
            perfilFutbolistico: { ...player.perfilFutbolistico, estado: 'Suplente' }
          }]
          : prevSuplentes.filter((p) => p._id !== player._id) // Remover de suplentes
      );
    } catch (error) {
      console.error(`Error al cambiar el estado del jugador con _id ${player._id}:`, error);
    }
  };


  return (
    <div className="layout">
      <div className="soccer-field-container">
        {/* Modal en la esquina superior derecha */}
        <div className="modal-plantilla">
          <ModalPlantilla />
        </div>

        <div className="formation-controls pr-2">
          {Object.keys(formationsData).map((formationKey) => (
            <button
              key={formationKey}
              className={`btn btn-primary ${formation === formationKey ? 'active' : ''} me-2`}
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
              //console.log(excessPositions)
              const info = `
                Faltantes: ${missingPositions.length > 0 ? missingPositions.join(', ') : 'Ninguno'}
                Sobrantes: ${excessPositions.length > 0 ? excessPositions.join(', ') : 'Ninguno'}
              `;
              tooltipRef.current.innerText = info; // Actualizar el tooltip con la información
            }}
            onMouseLeave={() => {
              tooltipRef.current.innerText = ''; // Limpiar el tooltip
            }}
          >
            {missingPositions.length === 0 && excessPositions.length === 0 ? '✔️' : '⚠️'}
          </button>
          <div className="status-tooltip" ref={tooltipRef}></div> {/* Usamos ref aquí */}
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
                transition: 'top 0.5s ease, left 0.5s ease',
              }}
              onClick={() => {
                setSelectedPosition(player.label); // Actualizamos el estado con la posición seleccionada
              }}
            >
              {player.label}
            </button>
          ))}
        </div>
      </div>

      {/* Listado de jugadores titulares */}
<div className="player-list">
  <h3>Titulares</h3>
  {loading ? (
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
        <tr>
          <td colSpan="5" className="text-center">
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  ) : (
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
        {sortPlayersByPosition(titulares).map((player, index) => (
          <tr
            key={index}
            className={
              player.perfilFutbolistico.posicionNatural === selectedPosition
                ? 'highlight-titular'
                : ''
            }
          >
            <td>{player.datosPersonales.nombre + " " + player.datosPersonales.apellido}</td>
            <td>{player.perfilFutbolistico.posicionNatural}</td>
            <td>
              {new Date().getFullYear() - new Date(player.datosPersonales.fechaNacimiento).getFullYear() -
                (new Date().getMonth() < new Date(player.datosPersonales.fechaNacimiento).getMonth() ||
                  (new Date().getMonth() === new Date(player.datosPersonales.fechaNacimiento).getMonth() &&
                    new Date().getDate() < new Date(player.datosPersonales.fechaNacimiento).getDate())
                ? 1
                : 0)}
            </td>
            <td>{player.datosPersonales.primeraNacionalidad}</td>
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
  )}
</div>

     {/* Listado de jugadores suplentes */}
<div className="player-list">
  <h3>Suplentes</h3>
  {loading ? (
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
        <tr>
          <td colSpan="5" className="text-center">
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100px' }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Cargando...</span>
              </div>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  ) : (
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
        {sortPlayersByPosition(suplentes).map((player, index) => (
          <tr
            key={index}
            className={
              player.perfilFutbolistico.posicionNatural === selectedPosition
                ? 'highlight-suplente'
                : ''
            }
          >
            <td>{player.datosPersonales.nombre + " " + player.datosPersonales.apellido}</td>
            <td>{player.perfilFutbolistico.posicionNatural}</td>
            <td>
              {new Date().getFullYear() - new Date(player.datosPersonales.fechaNacimiento).getFullYear() -
                (new Date().getMonth() < new Date(player.datosPersonales.fechaNacimiento).getMonth() ||
                  (new Date().getMonth() === new Date(player.datosPersonales.fechaNacimiento).getMonth() &&
                    new Date().getDate() < new Date(player.datosPersonales.fechaNacimiento).getDate())
                ? 1
                : 0)}
            </td>
            <td>{player.datosPersonales.primeraNacionalidad}</td>
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
  )}
</div>
    </div>
  );
};

export default SoccerField;
