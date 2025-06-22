// src/services/fixedLotService.ts
import type { FixedLotData } from "../types/inventory"

const API_URL = import.meta.env.VITE_API_URL
const jsonHeaders = { "Content-Type": "application/json" }

export async function saveFixedLotData(
  data: FixedLotData & {
    loteOptimo: number
    puntoPedido: number
    stockSeguridad: number
  }
): Promise<void> {
  const res = await fetch(`${API_URL}/modelo-lote-fijo`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  })

  if (!res.ok) throw new Error("Error al guardar el modelo de lote fijo")
}
