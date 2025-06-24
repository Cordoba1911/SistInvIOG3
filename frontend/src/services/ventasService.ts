import request from "./api";
import type { Venta, CreateVentaDto } from "../types/venta";

const VENTAS_BASE_URL = "/ventas";

export const ventasService = {
  // Obtener todas las ventas
  async getAll(): Promise<Venta[]> {
    return request<Venta[]>(VENTAS_BASE_URL);
  },

  // Obtener venta por ID
  async getById(id: number): Promise<Venta> {
    return request<Venta>(`${VENTAS_BASE_URL}/${id}`);
  },

  // Crear nueva venta
  async create(venta: CreateVentaDto): Promise<Venta> {
    return request<Venta>(VENTAS_BASE_URL, {
      method: "POST",
      body: JSON.stringify(venta),
    });
  },

  // Actualizar venta
  async update(id: number, venta: Partial<CreateVentaDto>): Promise<Venta> {
    return request<Venta>(`${VENTAS_BASE_URL}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(venta),
    });
  },

  // Eliminar venta
  async delete(id: number): Promise<{ message: string; venta: Venta }> {
    return request<{ message: string; venta: Venta }>(
      `${VENTAS_BASE_URL}/${id}`,
      {
        method: "DELETE",
      }
    );
  },
};
