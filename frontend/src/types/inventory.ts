// Tipos para el Modelo de Lote Fijo
export interface FixedLotData {
  demandaAnual: number // Demanda anual en unidades
  costoOrden: number // Costo de ordenar
  costoMantenimiento: number // Costo de mantener inventario (porcentaje)
  costoUnitario: number // Costo unitario del producto
  tiempoEntrega: number // Tiempo de entrega en días
  diasLaborables: number // Días laborables por año
  nivelServicio: number // Nivel de servicio (porcentaje)
  desviacionDemanda: number // Desviación estándar de la demanda diaria
}

export interface FixedLotResults {
  loteOptimo: number // Cantidad económica de pedido (EOQ)
  puntoPedido: number // Punto de reorden
  stockSeguridad: number // Stock de seguridad
}

// Tipos para el Modelo de Intervalo Fijo
export interface FixedIntervalData {
  demandaPromedioDiaria: number // Demanda promedio diaria
  tiempoEntrega: number // Tiempo de entrega en días
  intervaloRevision: number // Intervalo de revisión en días
  nivelServicio: number // Nivel de servicio (porcentaje)
  desviacionDemanda: number // Desviación estándar de la demanda diaria
}

export interface FixedIntervalResults {
  stockSeguridad: number // Stock de seguridad
  inventarioMaximo: number // Nivel de inventario máximo
}

// Tipos para el Cálculo de CGI
export interface CGIItem {
  id: string
  nombre: string
  valorAnual: number // Valor anual de consumo
  clasificacion?: "A" | "B" | "C" // Clasificación resultante
}

export interface CGIResults {
  items: CGIItem[]
  totalValorAnual: number
}
