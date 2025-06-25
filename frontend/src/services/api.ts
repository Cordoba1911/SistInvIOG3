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
      
      // Extraer solo el mensaje de error del backend, sin incluir la URL
      let errorMessage = errorData.message || errorData.error || errorText;
      
      // Si es un array de mensajes (como en validaciones), usar el primer mensaje
      if (Array.isArray(errorMessage)) {
        errorMessage = errorMessage[0];
      }
      
      // Limpiar cualquier referencia a localhost del mensaje
      errorMessage = cleanErrorMessage(errorMessage);
      
      throw new Error(errorMessage);
    } catch (parseError) {
      // Si el parseo falla, no era JSON. El error es el texto o uno genérico.
      let errorMessage = errorText;
      
      // Limpiar cualquier referencia a localhost del mensaje
      errorMessage = cleanErrorMessage(errorMessage);
      
      if (!errorMessage) {
        errorMessage = `Error ${response.status}: ${response.statusText}`;
      }
      
      console.error(`Error en la petición a ${endpoint}:`, errorMessage);
      throw new Error(errorMessage);
    }
  }

  // Si la respuesta es OK, devolvemos el cuerpo JSON
  // Si el cuerpo está vacío, response.json() falla. Manejamos ese caso.
  const text = await response.text();
  return text ? JSON.parse(text) : {};
};

// Función helper para limpiar mensajes de error de referencias a localhost
const cleanErrorMessage = (message: string): string => {
  if (typeof message !== 'string') {
    return String(message);
  }
  
  // Remover URLs completas que contengan localhost
  let cleanedMessage = message.replace(/https?:\/\/localhost:\d+[^\s]*/g, '');
  
  // Si el mensaje incluye localhost, intentar extraer solo la parte relevante
  if (cleanedMessage.includes('localhost')) {
    // Intentar extraer solo el mensaje después de los dos puntos
    const parts = cleanedMessage.split(': ');
    if (parts.length > 1) {
      cleanedMessage = parts[parts.length - 1];
    }
    
    // Si todavía contiene localhost, intentar otras estrategias
    if (cleanedMessage.includes('localhost')) {
      // Buscar patrones como "Error fetching http://localhost:..." y extraer solo el error
      const fetchErrorMatch = cleanedMessage.match(/Error fetching.*?:\s*(.+)/);
      if (fetchErrorMatch) {
        cleanedMessage = fetchErrorMatch[1];
      } else {
        // Como último recurso, remover cualquier mención de localhost
        cleanedMessage = cleanedMessage.replace(/localhost:\d+/g, '').replace(/localhost/g, '').trim();
        // Limpiar espacios dobles y caracteres sobrantes
        cleanedMessage = cleanedMessage.replace(/\s+/g, ' ').replace(/^[:\s]+|[:\s]+$/g, '');
      }
    }
  }
  
  return cleanedMessage.trim() || 'Error en la operación';
};

export default request;
