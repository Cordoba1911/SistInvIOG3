"use client"

// Inspirado en la librería react-hot-toast
import * as React from "react"
import type { ToastProps } from "react-bootstrap"

// Límite máximo de toasts visibles al mismo tiempo
const TOAST_LIMIT = 1
// Tiempo que tarda en eliminarse un toast después de ser cerrado (en ms)
const TOAST_REMOVE_DELAY = 1000000

// Tipo que extiende las props básicas de un toast, agregando id y posibles elementos adicionales
type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
}

// Definición de tipos de acción para el reducer
const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

// Contador para generar IDs únicos para cada toast
let count = 0

// Función para generar un ID único basado en el contador
function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type ActionType = typeof actionTypes

// Tipos de acciones que se pueden disparar para modificar el estado de los toasts
type Action =
  | {
      type: ActionType["ADD_TOAST"]
      toast: ToasterToast
    }
  | {
      type: ActionType["UPDATE_TOAST"]
      toast: Partial<ToasterToast> // Puede actualizar parcialmente un toast existente
    }
  | {
      type: ActionType["DISMISS_TOAST"]
      toastId?: ToasterToast["id"] // Opcional, puede ser para un toast específico o todos
    }
  | {
      type: ActionType["REMOVE_TOAST"]
      toastId?: ToasterToast["id"]
    }

// Estado que mantiene la lista actual de toasts
interface State {
  toasts: ToasterToast[]
}

// Mapa para guardar los timeouts de eliminación diferida de cada toast
const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

// Añade un toast a la "cola de eliminación" con delay para que desaparezca después
const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    // Ya está en cola para eliminarse, no agregar otra vez
    return
  }

  // Establece un timeout para eliminar el toast después del delay definido
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

// Reducer que maneja las acciones para actualizar el estado global de toasts
export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      // Agrega el nuevo toast al inicio y limita la cantidad de toasts activos
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      // Actualiza un toast existente por ID, mezclando las nuevas props
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      // Efecto secundario: agregar a cola para eliminar después
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        // Si no se especifica ID, poner en cola para eliminar todos los toasts
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      // Marca el/los toast(s) como cerrados (open: false)
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      }
    }
    case "REMOVE_TOAST":
      // Si no hay ID, elimina todos los toasts
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      // Elimina el toast con el ID dado
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

// Lista de listeners (callbacks) que se ejecutan cuando cambia el estado
const listeners: Array<(state: State) => void> = []

// Estado en memoria para mantener el estado global de los toasts
let memoryState: State = { toasts: [] }

// Función para despachar acciones al reducer y notificar a todos los listeners
function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

// Tipo Toast para simplificar la creación de un toast sin el ID
type Toast = Omit<ToasterToast, "id">

// Función para crear y mostrar un nuevo toast
function toast({ ...props }: Toast) {
  const id = genId()

  // Función para actualizar este toast por ID
  const update = (props: ToasterToast) =>
    dispatch({
      type: "UPDATE_TOAST",
      toast: { ...props, id },
    })

  // Función para cerrar (dismiss) este toast por ID
  const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id })

  // Agregar el toast al estado con las props iniciales y open = true
  dispatch({
    type: "ADD_TOAST",
    toast: {
      ...props,
      id,
      open: true,
      // Cuando el toast cambia de estado open a false, se dispara dismiss automático
      onOpenChange: (open: any) => {
        if (!open) dismiss()
      },
    },
  })

  // Retorna el ID y funciones para manipular el toast (cerrar y actualizar)
  return {
    id: id,
    dismiss,
    update,
  }
}

// Hook para usar toasts en componentes React
function useToast() {
  // Estado local sincronizado con el estado global en memoria
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    // Al montar, agregar el setState a los listeners para actualizar al cambiar el estado global
    listeners.push(setState)
    // Al desmontar, remover el listener
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [state])

  // Retorna el estado actual y las funciones para crear o cerrar toasts
  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: "DISMISS_TOAST", toastId }),
  }
}

export { useToast, toast }
