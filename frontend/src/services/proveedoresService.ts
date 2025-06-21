import request from "./api";
import type {
  Proveedor,
  CreateProveedorDto,
  ArticuloProveedorDetalle,
} from "../types/proveedor";

const PROVEEDORES_BASE_URL = "/proveedores";

export const proveedoresService = {
  // Obtener todos los proveedores
  async getAll(): Promise<Proveedor[]> {
    return request<Proveedor[]>(PROVEEDORES_BASE_URL);
  },

  // Obtener solo proveedores activos
  async getActivos(): Promise<Proveedor[]> {
    return request<Proveedor[]>(`${PROVEEDORES_BASE_URL}/activos/lista`);
  },

  // Obtener proveedor por ID
  async getById(id: number): Promise<Proveedor> {
    return request<Proveedor>(`${PROVEEDORES_BASE_URL}/${id}`);
  },

  // Crear nuevo proveedor
  async create(proveedor: CreateProveedorDto): Promise<Proveedor> {
    return request<Proveedor>(PROVEEDORES_BASE_URL, {
      method: "POST",
      body: JSON.stringify(proveedor),
    });
  },

  // Actualizar proveedor
  async update(
    id: number,
    proveedor: Partial<CreateProveedorDto>
  ): Promise<Proveedor> {
    return request<Proveedor>(`${PROVEEDORES_BASE_URL}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(proveedor),
    });
  },

  // Eliminar/Dar de baja un proveedor
  async baja(id: number): Promise<{ message: string; proveedor: Proveedor }> {
    return request<{ message: string; proveedor: Proveedor }>(
      `${PROVEEDORES_BASE_URL}/${id}`,
      {
        method: "DELETE",
      }
    );
  },

  // Reactivar un proveedor
  async reactivar(id: number): Promise<Proveedor> {
    return request<Proveedor>(`${PROVEEDORES_BASE_URL}/${id}/reactivar`, {
      method: "PATCH",
    });
  },

  // Obtener los artículos de un proveedor específico
  async getArticulos(proveedorId: number): Promise<ArticuloProveedorDetalle[]> {
    return request<ArticuloProveedorDetalle[]>(
      `${PROVEEDORES_BASE_URL}/${proveedorId}/articulos`
    );
  },

  // Relacionar artículos con un proveedor
  async relacionarConArticulos(
    proveedorId: number,
    data: { articulos: any[] }
  ): Promise<{ message: string }> {
    return request<{ message: string }>(
      `${PROVEEDORES_BASE_URL}/relacionar/${proveedorId}`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  },
};
