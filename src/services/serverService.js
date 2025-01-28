import axios from 'axios';

// Leer la URL base desde el entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
console.log(API_BASE_URL)

export const getServerStatus = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/status`);
    return response.status === 200;
  } catch {
    return false;
  }
};