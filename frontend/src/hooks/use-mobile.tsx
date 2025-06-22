import * as React from "react"

// Punto de corte para considerar una pantalla como móvil (en píxeles)
const MOBILE_BREAKPOINT = 768

// Hook personalizado para detectar si la pantalla actual es móvil según el ancho
export function useIsMobile() {
  // Estado que indica si el viewport actual es móvil (true/false) o indefinido inicialmente
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined)

  React.useEffect(() => {
    // Crear un MediaQueryList para el ancho máximo justo antes del breakpoint móvil
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)

    // Función que actualiza el estado cuando cambia la consulta de media (viewport)
    const onChange = () => {
      // Actualiza isMobile según el ancho actual de la ventana
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }

    // Agregar el listener para detectar cambios en la consulta de media
    mql.addEventListener("change", onChange)

    // Inicializar el estado al montar el componente
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)

    // Cleanup: eliminar el listener cuando el componente se desmonte
    return () => mql.removeEventListener("change", onChange)
  }, []) // Solo se ejecuta una vez al montar

  // Retornar un booleano, asegurando que nunca sea undefined (convierte undefined a false)
  return !!isMobile
}
