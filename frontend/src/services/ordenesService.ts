import request from "./api";
import type { OrdenCompra, CreateOrdenCompraDto } from "../types/ordenCompra";

const ORDENES_BASE_URL = "/ordenes_compra";

export const ordenesService = {
  // Obtener todas las órdenes de compra
  async getAll(): Promise<OrdenCompra[]> {
    return request<OrdenCompra[]>(ORDENES_BASE_URL);
  },

  // Obtener orden de compra por ID
  async getById(id: number): Promise<OrdenCompra> {
    return request<OrdenCompra>(`${ORDENES_BASE_URL}/${id}`);
  },

  // Crear nueva orden de compra
  async create(orden: CreateOrdenCompraDto): Promise<OrdenCompra> {
    return request<OrdenCompra>(ORDENES_BASE_URL, {
      method: "POST",
      body: JSON.stringify(orden),
    });
  },

  // Actualizar orden de compra
  async update(
    id: number,
    orden: Partial<CreateOrdenCompraDto>
  ): Promise<OrdenCompra> {
    return request<OrdenCompra>(`${ORDENES_BASE_URL}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(orden),
    });
  },

  // Eliminar orden de compra
  async delete(id: number): Promise<{ message: string; orden: OrdenCompra }> {
    return request<{ message: string; orden: OrdenCompra }>(
      `${ORDENES_BASE_URL}/${id}`,
      {
        method: "DELETE",
      }
    );
  },

  // Cambiar estado de la orden
  async cambiarEstado(id: number, estado: string): Promise<OrdenCompra> {
    return request<OrdenCompra>(`${ORDENES_BASE_URL}/${id}/estado`, {
      method: "PATCH",
      body: JSON.stringify({ estado }),
    });
  },

  async cancelar(id: number): Promise<OrdenCompra> {
    return request<OrdenCompra>(`${ORDENES_BASE_URL}/${id}/cancelar`, {
      method: "PATCH",
    });
  },

  async enviar(id: number): Promise<OrdenCompra> {
    return request<OrdenCompra>(`${ORDENES_BASE_URL}/${id}/enviar`, {
      method: "PATCH",
    });
  },

  async finalizar(id: number): Promise<OrdenCompra> {
    return request<OrdenCompra>(`${ORDENES_BASE_URL}/${id}/finalizar`, {
      method: "PATCH",
    });
  },

  // Obtener sugerencias inteligentes para órdenes de compra
  async getSugerencias(): Promise<any[]> {
    return request<any[]>(`${ORDENES_BASE_URL}/sugerencias`);
  },
};
