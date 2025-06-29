import request from "./api";
import type { 
  Articulo, 
  CreateArticuloDto, 
  UpdateArticuloInput, 
  ProductoFaltante, 
  ProductoAReponer 
} from "../types/articulo";

const ARTICULOS_BASE_URL = "/articulos";

export const articulosService = {
  // Obtener todos los artículos
  async getAll(): Promise<Articulo[]> {
    return request<Articulo[]>(ARTICULOS_BASE_URL);
  },

  // Obtener TODOS los artículos (activos e inactivos) para administración
  async getAllForAdmin(): Promise<Articulo[]> {
    return request<Articulo[]>(`${ARTICULOS_BASE_URL}/admin/todos`);
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

  // Calcular y actualizar CGI de un artículo específico
  async calcularCGIArticulo(id: number): Promise<Articulo> {
    return request<Articulo>(
      `${ARTICULOS_BASE_URL}/${id}/calcular-cgi`,
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

  // Obtener productos faltantes
  async getProductosFaltantes(): Promise<ProductoFaltante[]> {
    return request<ProductoFaltante[]>(`${ARTICULOS_BASE_URL}/faltantes`);
  },

  // Obtener productos a reponer
  async getProductosAReponer(): Promise<ProductoAReponer[]> {
    return request<ProductoAReponer[]>(`${ARTICULOS_BASE_URL}/a-reponer`);
  },

  // Ajustar inventario de un artículo
  async ajustarInventario(id: number, nuevaCantidad: number, motivo: string): Promise<any> {
    return request(`${ARTICULOS_BASE_URL}/${id}/ajustar-inventario`, {
      method: "PATCH",
      body: JSON.stringify({
        nueva_cantidad: nuevaCantidad,
        motivo: motivo,
      }),
    });
  },

  // Obtener proveedores de un artículo específico
  async getProveedoresPorArticulo(articuloId: number): Promise<any[]> {
    return request<any[]>(`${ARTICULOS_BASE_URL}/${articuloId}/proveedores`);
  },
};
