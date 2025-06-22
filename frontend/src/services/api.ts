// const BASE_URL = import.meta.env.VITE_API_URL;
const BASE_URL = "http://localhost:3000/api"; // URL temporal para desarrollo

if (!BASE_URL) {
  throw new Error(
    "La variable de entorno VITE_API_URL no está definida. Revisa tu archivo .env en la raíz del proyecto frontend."
  );
}

const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      ...(options.body instanceof FormData
        ? {} // no poner headers, el navegador los agrega automáticamente
        : { "Content-Type": "application/json" }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text(); // Leemos el cuerpo como texto, esto es más seguro.
    try {
      // Intentamos parsear el texto. Si funciona, el backend envió un error JSON.
      const errorData = JSON.parse(errorText);
      // Volvemos a stringificarlo para pasarlo en el mensaje del Error.
      // Esto permite que el que lo captura pueda acceder al objeto completo.
      throw new Error(JSON.stringify(errorData));
    } catch (e) {
      // Si el parseo falla, no era JSON. El error es el texto o uno genérico.
      const errorMessage = errorText || `Error ${response.status}: ${response.statusText}`;
      console.error(`Error en la petición a ${endpoint}:`, errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Si la respuesta es OK, devolvemos el cuerpo JSON
  // Si el cuerpo está vacío, response.json() falla. Manejamos ese caso.
  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
};

export default request;
