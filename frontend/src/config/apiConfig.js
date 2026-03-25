const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API_BASE_URL = API_URL.endsWith("/") ? API_URL.slice(0, -1) : API_URL;

export default API_BASE_URL;
