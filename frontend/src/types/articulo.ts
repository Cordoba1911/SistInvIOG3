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
