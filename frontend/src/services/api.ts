const BASE_URL = import.meta.env.VITE_API_URL;

const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      ...(options.body instanceof FormData
        ? {} // no poner headers, el navegador los agrega automáticamente
        : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error en ${endpoint}: ${response.status} - ${errorText}`);
  }

  return response.json();
};

export default request;
