// Detectar si estamos en local o producción
const isLocal = window.location.hostname === 'localhost' || 
                window.location.hostname === '127.0.0.1';

const CONFIG = {
  API_URL: isLocal 
    ? 'http://localhost:8080' 
    : 'https://seeds-to-roots-backend.up.railway.app',
};

export default CONFIG;