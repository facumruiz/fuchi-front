import axios from 'axios';

// Leer la URL base desde el entorno y agregarle el sufijo '/record'
const API_URL = `${process.env.REACT_APP_API_BASE_URL}/player`;

// Función para obtener jugadores desde la API
export const getPlayers = async () => {
  try {
    const response = await axios.get(API_URL);
    const jugadores = response.data; // Asumimos que los jugadores están en response.data

    // Filtramos los jugadores en titulares y suplentes
    const titulares = jugadores.filter(jugador => jugador.perfilFutbolistico.estado === 'Titular');
    const suplentes = jugadores.filter(jugador => jugador.perfilFutbolistico.estado === 'Suplente');

    return { titulares, suplentes }; // Devolvemos dos listas: titulares y suplentes
  } catch (error) {
    console.error('Error fetching players:', error);
    throw error;
  }
};

// Función para actualizar el estado de un jugador
export const updatePlayerStatus = async (id, newStatus) => {
  try {
    const response = await axios.patch(`${API_URL}/${id}/status`, { estado: newStatus });
    return response.data; // Retorna el jugador actualizado
  } catch (error) {
    console.error(`Error updating player status for ID ${id}:`, error);
    throw error;
  }
};
