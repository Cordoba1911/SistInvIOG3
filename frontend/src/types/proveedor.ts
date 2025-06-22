// This file defines the TypeScript types for a Proveedor (Provider) entity.
// It includes the full Proveedor interface and a type for creating new providers without an ID or active status.
export interface Proveedor {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  activo: boolean;
}

export type ProveedorSinID = Omit<Proveedor, 'id' | 'activo'>;