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
    const errorText = await response.text();
    console.error(
      `Error en la petición a ${endpoint}: ${response.status} - ${errorText}`
    );
    throw new Error(`Error en ${endpoint}: ${response.status} - ${errorText}`);
  }

  return response.json();
};

export default request;
