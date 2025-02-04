import React, { useState, useEffect, useRef } from 'react';
import './Detalle.css';

import formationsData from '../../utils/formations.json'; // Importamos las formaciones

import { getPlayers, updatePlayerStatus, deletePlayer } from '../../services/playerService';

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

const SoccerDetails = () => {

  const [titulares, setTitulares] = useState([]);
  const [suplentes, setSuplentes] = useState([]);
  const [preseleccion, setPreseleccion] = useState([]);


  const [loading, setLoading] = useState(true);  // Estado para controlar la carga de los datos
  const tooltipRef = useRef(null); // Usamos un ref para el tooltip
  const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar la visibilidad del modal
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        setLoading(true);  // Empieza la carga de jugadores
        const { titulares, suplentes, preseleccion } = await getPlayers();
        setTitulares(titulares); // Guardamos los titulares
        setSuplentes(suplentes); // Guardamos los suplentes
        setPreseleccion(preseleccion);
        console.log(preseleccion)
      } catch (error) {
        console.error('Error al obtener los jugadores:', error);
      } finally {
        setLoading(false);  // Finaliza la carga
      }
    };

    fetchPlayers();
  }, []);




  // Función para manejar la eliminación
  const handleDelete = async (id) => {
    try {
      const confirmation = window.confirm("¿Estás seguro de que deseas eliminar este jugador?");
      if (confirmation) {
        // Eliminar al jugador del backend
        await deletePlayer(id);

        // Eliminar al jugador de los estados locales
        setTitulares((prev) => prev.filter(player => player._id !== id));
        setSuplentes((prev) => prev.filter(player => player._id !== id));
        setPreseleccion((prev) => prev.filter(player => player._id !== id));

        // Muestra el mensaje en el modal
        setModalMessage('Jugador eliminado correctamente');
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error('Error eliminando jugador:', error);
      alert('Hubo un error al eliminar al jugador');
    }
  };

  const closeModal = () => {
    setIsModalVisible(false); // Cerrar el modal
  };
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

      {/* Listado de jugadores titulares */}
      <div className="player-list-detalle">
        <h3>Titulares</h3>
        {loading ? (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Posición</th>
                <th>Edad</th>
                <th>Nacionalidad</th>
                
                <th>Estado</th>
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
                
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {sortPlayersByPosition(titulares).map((player, index) => (
                <tr
                  key={index}

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
                  
                  <td>{player.perfilFutbolistico.estado}</td>
                  <td>
                    <button
                      className="bajar-suplentes-detalle"
                      onClick={() => togglePlayerStatus(player, true)}
                    >
                      Bajar
                    </button>
                    <button disabled className='m-2'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                      </svg>
                    </button>
                    <button className="bajar-suplentes-detalle" onClick={() => handleDelete(player._id)}>
                      {/* Botón para eliminar */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                      </svg>
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Listado de jugadores suplentes */}
      <div className="player-list-detalle">
        <h3>Suplentes</h3>
        {loading ? (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Posición</th>
                <th>Edad</th>
                <th>Nacionalidad</th>
                
                <th>Estado</th>
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
                
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {sortPlayersByPosition(suplentes).map((player, index) => (
                <tr
                  key={index}

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
                  
                  <td>{player.perfilFutbolistico.estado}</td>
                  <td>
                    <button
                      className="subir-titulares-detalle"
                      onClick={() => togglePlayerStatus(player, false)}
                    >
                      Subir
                    </button>
                    <button disabled className='m-2'>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                      </svg>
                    </button >
                    <button className="bajar-suplentes-detalle" onClick={() => handleDelete(player._id)}>
                      {/* Botón para eliminar */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>


      <div className="player-list-detalle">
        <h3>Preseleccionados</h3>
        {loading ? (
          <table>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Posición</th>
                <th>Edad</th>
                <th>Nacionalidad</th>
                
                <th>Estado</th>
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
                
                <th>Estado</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {sortPlayersByPosition(preseleccion).map((player, index) => (
                <tr
                  key={index}

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
                  
                  <td>{player.perfilFutbolistico.estado}</td>
                  <td>
                    <button className="subir-titulares-detalle" onClick={() => togglePlayerStatus(player, false)}>
                      Subir
                    </button>
                    <button disabled className="m-2">
                      {/* Botón para editar */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                        <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                        <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                      </svg>
                    </button>
                    <button className="bajar-suplentes-detalle" onClick={() => handleDelete(player._id)}>
                      {/* Botón para eliminar */}
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                      </svg>
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

export default SoccerDetails;
