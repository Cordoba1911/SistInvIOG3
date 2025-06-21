import request from "./api";
import type { Articulo, CreateArticuloDto, UpdateArticuloInput } from "../types/articulo";

const ARTICULOS_BASE_URL = "/articulos";

export const articulosService = {
  // Obtener todos los artículos
  async getAll(): Promise<Articulo[]> {
    return request<Articulo[]>(ARTICULOS_BASE_URL);
  },

  // Obtener artículo por ID
  async getById(id: number): Promise<Articulo> {
    return request<Articulo>(`${ARTICULOS_BASE_URL}/${id}`);
  },

  // Crear nuevo artículo
  async create(articulo: CreateArticuloDto): Promise<Articulo> {
    return request<Articulo>(ARTICULOS_BASE_URL, {
      method: "POST",
      body: JSON.stringify(articulo),
    });
  },

  // Actualizar artículo
  async update(
    id: number,
    articulo: UpdateArticuloInput
  ): Promise<Articulo> {
    return request<Articulo>(`${ARTICULOS_BASE_URL}/${id}`, {
      method: "PATCH",
      body: JSON.stringify(articulo),
    });
  },

  // Eliminar artículo
  async delete(id: number): Promise<{ message: string; articulo: Articulo }> {
    return request<{ message: string; articulo: Articulo }>(
      `${ARTICULOS_BASE_URL}/${id}`,
      {
        method: "DELETE",
      }
    );
  },

  // Obtener proveedores disponibles
  async getProveedoresDisponibles(): Promise<any[]> {
    return request<any[]>(`${ARTICULOS_BASE_URL}/proveedores-disponibles`);
  },

  // Calcular modelo de lote fijo
  async calcularLoteFijo(datos: any): Promise<any> {
    return request<any>(`${ARTICULOS_BASE_URL}/calcular/lote-fijo`, {
      method: "POST",
      body: JSON.stringify(datos),
    });
  },

  // Calcular modelo de intervalo fijo
  async calcularIntervaloFijo(datos: any): Promise<any> {
    return request<any>(`${ARTICULOS_BASE_URL}/calcular/intervalo-fijo`, {
      method: "POST",
      body: JSON.stringify(datos),
    });
  },

  // Calcular CGI
  async calcularCGI(datos: any): Promise<any> {
    return request<any>(`${ARTICULOS_BASE_URL}/calcular/cgi`, {
      method: "POST",
      body: JSON.stringify(datos),
    });
  },

  // Aplicar cálculo a artículo
  async aplicarCalculo(id: number, modelo: string): Promise<Articulo> {
    return request<Articulo>(
      `${ARTICULOS_BASE_URL}/${id}/aplicar-calculo/${modelo}`,
      {
        method: "POST",
      }
    );
  },

  async reactivar(id: number): Promise<any> {
    return request(`${ARTICULOS_BASE_URL}/${id}/reactivar`, {
      method: "PATCH",
    });
  },
};
