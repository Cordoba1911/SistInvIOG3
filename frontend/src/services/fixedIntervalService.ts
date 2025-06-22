// src/services/fixedIntervalService.ts
import type { FixedIntervalData } from "../types/inventory"

const API_URL = import.meta.env.VITE_API_URL // ej: "http://localhost:4000/api"
const jsonHeaders = { "Content-Type": "application/json" }

export async function saveFixedIntervalData(
  data: FixedIntervalData & {
    stockSeguridad: number
    inventarioMaximo: number
  }
): Promise<void> {
  const res = await fetch(`${API_URL}/modelo-intervalo-fijo`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    throw new Error("Error al guardar los datos del modelo de intervalo fijo")
  }
}
