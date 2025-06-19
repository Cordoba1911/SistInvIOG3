import type { OrdenCompra } from "../routes/OrdenCompraRoutes";

let ordenes: OrdenCompra[] = [];

export const obtenerOrdenes = (): OrdenCompra[] => ordenes;

export const agregarOrden = (orden: OrdenCompra) => {
  ordenes.push(orden);
};

export const modificarOrden = (id: string, nuevosDatos: Partial<OrdenCompra>) => {
  const index = ordenes.findIndex((o) => o.id === id);
  if (index !== -1) {
    ordenes[index] = { ...ordenes[index], ...nuevosDatos };
  }
};

export const eliminarOrden = (id: string) => {
  ordenes = ordenes.filter((o) => o.id !== id);
};
