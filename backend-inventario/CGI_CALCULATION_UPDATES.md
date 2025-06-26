# Actualización del Cálculo CGI - Diferenciación por Modelo de Inventario

## Resumen de Cambios

Se ha actualizado el cálculo del CGI (Costo de Gestión del Inventario) para que sea diferenciado según el modelo de inventario utilizado:

### **Antes (Cálculo Único)**
- Se utilizaba la misma fórmula para ambos modelos de inventario
- Basado únicamente en EOQ (Economic Order Quantity)
- No consideraba las diferencias entre lote fijo y período fijo

### **Después (Cálculo Diferenciado)**

#### **1. Modelo Lote Fijo (EOQ)**
- **Fórmula tradicional**: Basada en EOQ
- **Stock promedio**: Q/2 (lote óptimo dividido por 2)
- **Número de pedidos**: Demanda anual / Lote óptimo
- **Frecuencia**: Variable según el lote óptimo calculado

#### **2. Modelo Período Fijo (Lead Time)**
- **Fórmula actualizada**: Basada en lead time (demora de entrega)
- **Stock promedio**: (Inventario máximo / 2) + Stock de seguridad
- **Número de pedidos**: Basado en frecuencia de revisión (ej: mensual = 12 pedidos/año)
- **Frecuencia**: Fija según el período de revisión

## Cambios Técnicos Implementados

### **Backend (NestJS)**

#### **1. DTO Actualizado (`calculo-cgi.dto.ts`)**
```typescript
export class CalculoCgiDto {
  // Campos existentes...
  modelo_inventario?: ModeloInventario;  // Nuevo
  demora_entrega?: number;               // Nuevo
  inventario_maximo?: number;            // Nuevo
}

export class ResultadoCgiDto {
  // Campos existentes...
  modelo_utilizado: string;              // Nuevo
  observaciones?: string;                // Nuevo
}
```

#### **2. Servicio Actualizado (`articulos.service.ts`)**
- **Método `calcularCgi()`**: Lógica diferenciada por modelo
- **Método `calcularYActualizarCgi()`**: Incluye validación de demora de entrega
- **Método `calcularFormulasInventario()`**: Usa el nuevo cálculo diferenciado

#### **3. Validaciones Agregadas**
- Para período fijo: Demora de entrega obligatoria
- Para lote fijo: Demora de entrega opcional
- Validación de modelo de inventario válido

### **Frontend (React)**

#### **1. Formulario Actualizado (`CalculoModelosForm.tsx`)**
- Campos específicos para cada modelo
- Selector de modelo de inventario
- Campo de demora de entrega con validación
- Campos opcionales según el modelo

#### **2. Mensajes Informativos**
- Indica el modelo utilizado en el cálculo
- Muestra observaciones sobre cálculos automáticos
- Información sobre proveedor predeterminado

## Fórmulas Implementadas

### **Lote Fijo (EOQ)**
```
Lote Óptimo = √((2 × Demanda Anual × Costo Pedido) / Costo Almacenamiento)
Stock Promedio = Lote Óptimo / 2
Número de Pedidos = Demanda Anual / Lote Óptimo
```

### **Período Fijo (Lead Time)**
```
Inventario Máximo = Demanda Período + Demanda Lead Time
Stock Promedio = (Inventario Máximo / 2) + Stock Seguridad
Número de Pedidos = 365 / Período Revisión
```

## Beneficios de la Actualización

1. **Precisión**: Cálculos más precisos según el modelo real utilizado
2. **Flexibilidad**: Soporte para diferentes estrategias de inventario
3. **Información**: Mayor transparencia sobre el modelo utilizado
4. **Validación**: Mejor control de datos requeridos por modelo
5. **Mantenibilidad**: Código más organizado y específico

## Compatibilidad

- **Retrocompatible**: Los artículos existentes mantienen su funcionalidad
- **Migración automática**: Los cálculos se actualizan automáticamente
- **Validación gradual**: Se valida la demora de entrega solo cuando es necesaria

## Próximos Pasos

1. **Testing**: Validar cálculos con datos reales
2. **Documentación**: Actualizar manuales de usuario
3. **UI/UX**: Mejorar la interfaz para mostrar diferencias entre modelos
4. **Métricas**: Agregar comparativas entre modelos 