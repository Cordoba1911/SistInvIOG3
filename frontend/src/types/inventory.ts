// Tipos básicos para inventario
export interface StockInfo {
  actual: number;
  minimo: number;
  maximo: number;
  seguridad: number;
}

export interface InventoryMetrics {
  demanda: number;
  costo_almacenamiento: number;
  costo_pedido: number;
  tiempo_entrega: number;
  nivel_servicio: number;
  desviacion_estandar: number;
}
