// src/services/cgiService.ts
import type { CGIItem } from "../types/inventory"

const API_URL = import.meta.env.VITE_API_URL // ej. "http://localhost:4000/api"

const jsonHeaders = { "Content-Type": "application/json" }

/* --- CRUD de artículos -------------------------------------------------- */

export async function fetchItems(): Promise<CGIItem[]> {
  const res = await fetch(`${API_URL}/inventario/cgi`)
  if (!res.ok) throw new Error("Error al obtener items")
  return res.json()
}

export async function addItem(
  data: Omit<CGIItem, "id">
): Promise<CGIItem> {
  const res = await fetch(`${API_URL}/inventario/cgi`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error("Error al agregar item")
  return res.json()
}

export async function deleteItem(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/inventario/cgi/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error("Error al eliminar item")
}

/* --- (Opcional) cálculo en servidor ------------------------------------ */

export async function calculateCGI<T = unknown>(
  items: CGIItem[]
): Promise<T> {
  const res = await fetch(`${API_URL}/inventario/cgi/calculate`, {
    method: "POST",
    headers: jsonHeaders,
    body: JSON.stringify({ items }),
  })
  if (!res.ok) throw new Error("Error al calcular CGI en servidor")
  return res.json()
}
