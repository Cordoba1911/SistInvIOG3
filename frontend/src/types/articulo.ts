// This file defines the TypeScript types for a Proveedor (Provider) entity.
// It includes the full Proveedor interface and a type for creating new providers without an ID or active status.
export interface Articulo {
  id: string;
  nombre: string;
  precio: number;
  cantidad: number;
  descripcion: string;
  categoria: string;
  proveedor: string;
  imagen?: string; // Imagen opcional
  activo: boolean;
}
