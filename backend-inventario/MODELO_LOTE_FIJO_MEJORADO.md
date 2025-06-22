# Modelo Lote Fijo - Implementación Completa y Recálculo Automático

## 📋 Resumen de Mejoras Implementadas

### 1. Campos Adicionales para Cálculos Precisos

Se agregaron nuevos campos a la entidad `Articulo` para mejorar la precisión de los cálculos:

- **`desviacion_estandar`**: Variabilidad de la demanda (DECIMAL 5,2)
- **`nivel_servicio`**: Probabilidad de no tener faltantes (DECIMAL 3,2, default: 0.95)

### 2. Fórmulas Implementadas

#### Lote Óptimo (EOQ)
```
EOQ = √(2 × D × S / H)
```
- D = Demanda anual
- S = Costo de pedido
- H = Costo de almacenamiento

#### Stock de Seguridad
```
SS = Z × σ × √L
```
- Z = Z-score según nivel de servicio
- σ = Desviación estándar de la demanda
- L = Tiempo de entrega (en fracción de año)

#### Punto de Pedido
```
PP = (D × L) + SS
```
- D = Demanda anual
- L = Tiempo de entrega
- SS = Stock de seguridad

#### Costos Asociados
- **Costo de Pedidos Anuales**: (D/Q) × S
- **Costo de Almacenamiento Anual**: (Q/2) × H
- **Costo Total Anual**: Costo Pedidos + Costo Almacenamiento + (D × C)

### 3. Niveles de Servicio y Z-Scores

| Nivel de Servicio | Z-Score | Descripción |
|-------------------|---------|-------------|
| 85% | 1.04 | Básico |
| 90% | 1.28 | Estándar |
| 95% | 1.645 | Recomendado |
| 97.5% | 1.96 | Alto |
| 99% | 2.33 | Premium |

### 4. Recálculo Automático

#### Cuándo se Recalcula
El sistema recalcula automáticamente los parámetros cuando se actualiza cualquiera de estas variables:
- Demanda
- Costo de almacenamiento
- Costo de pedido
- Costo de compra
- Desviación estándar
- Nivel de servicio
- Datos del proveedor predeterminado (demora de entrega)

#### Cómo Funciona
1. **Detección de Cambios**: Al actualizar un artículo, se verifica si cambió alguna variable relevante
2. **Validación**: Se confirma que el artículo tiene modelo lote fijo y datos necesarios
3. **Recálculo**: Se ejecutan las fórmulas con los nuevos valores
4. **Actualización Selectiva**: Solo se actualizan los campos que realmente cambiaron
5. **Manejo de Errores**: Los errores de cálculo no afectan la operación principal

## 🔧 Endpoints API

### Calcular Modelo Lote Fijo
```http
POST /articulos/calcular/lote-fijo
Content-Type: application/json

{
  "demanda": 1000,
  "costo_almacenamiento": 2.5,
  "costo_pedido": 50,
  "costo_compra": 10,
  "demora_entrega": 7,
  "desviacion_estandar": 100,
  "nivel_servicio": 0.95
}
```

**Respuesta:**
```json
{
  "lote_optimo": 200,
  "punto_pedido": 119,
  "stock_seguridad": 100,
  "costo_total_anual": 10750.00,
  "tiempo_reposicion": 73.0,
  "numero_pedidos_anuales": 5.00,
  "costo_pedidos_anuales": 250.00,
  "costo_almacenamiento_anual": 250.00,
  "stock_promedio": 100
}
```

### Aplicar Cálculo a Artículo
```http
POST /articulos/{id}/aplicar-calculo/lote_fijo
```

## 💻 Frontend - Calculadora Avanzada

### Características de la Calculadora

1. **Selección de Artículos**: Lista filtrada de artículos con modelo lote fijo
2. **Parámetros Editables**: Todos los campos de cálculo son modificables
3. **Comparación Visual**: Muestra valores actuales vs calculados con badges de estado
4. **Aplicación Directa**: Botón para aplicar resultados al artículo
5. **Métricas Detalladas**: Costos, frecuencias y tiempos calculados

### Estados de Comparación

- 🟢 **Verde**: Diferencia < 5% (valores óptimos)
- 🟡 **Amarillo**: Diferencia 5-15% (requiere atención)
- 🔴 **Rojo**: Diferencia > 15% (requiere recálculo)

## 📊 Casos de Uso

### Ejemplo 1: Artículo de Alta Rotación
```
Demanda: 5000 unidades/año
Costo Almacenamiento: $1.50/unidad/año
Costo Pedido: $100/pedido
Demora Entrega: 3 días
Nivel Servicio: 97.5%

Resultados:
- Lote Óptimo: 816 unidades
- Punto Pedido: 81 unidades
- Stock Seguridad: 40 unidades
- Pedidos/Año: 6.1
```

### Ejemplo 2: Artículo de Baja Rotación
```
Demanda: 500 unidades/año
Costo Almacenamiento: $3.00/unidad/año
Costo Pedido: $25/pedido
Demora Entrega: 14 días
Nivel Servicio: 95%

Resultados:
- Lote Óptimo: 65 unidades
- Punto Pedido: 39 unidades
- Stock Seguridad: 20 unidades
- Pedidos/Año: 7.7
```

## ⚙️ Configuración y Validaciones

### Validaciones Implementadas
- Demanda > 0
- Costo almacenamiento > 0
- Costo pedido > 0
- Nivel servicio: 0.5 - 0.999
- Demora entrega ≥ 1 día

### Valores por Defecto
- Demora entrega: 7 días
- Desviación estándar: 10% de la demanda
- Nivel servicio: 95%

## 🔄 Flujo de Trabajo Recomendado

1. **Configuración Inicial**:
   - Crear artículo con datos básicos
   - Asignar proveedores con tiempos de entrega
   - Establecer modelo inventario = "lote_fijo"

2. **Cálculo de Parámetros**:
   - Usar la calculadora para experimentar con diferentes valores
   - Aplicar resultados óptimos al artículo
   - Verificar que los valores se actualizaron correctamente

3. **Mantenimiento Automático**:
   - Los parámetros se recalculan automáticamente al cambiar datos
   - Monitorear productos a reponer y faltantes
   - Ajustar niveles de servicio según necesidades del negocio

## 🚀 Beneficios de la Implementación

- **Automatización**: Recálculo automático elimina errores manuales
- **Precisión**: Fórmulas científicamente validadas
- **Flexibilidad**: Parámetros ajustables según contexto del negocio
- **Visibilidad**: Comparación clara entre valores actuales y óptimos
- **Eficiencia**: Reducción de costos de inventario
- **Confiabilidad**: Niveles de servicio configurables

## 📝 Notas Técnicas

- Los cálculos se realizan en el backend para garantizar consistencia
- Los valores se redondean apropiadamente (enteros para cantidades, 2 decimales para costos)
- El sistema maneja graciosamente errores de cálculo sin afectar operaciones críticas
- La base de datos mantiene historial de cambios para auditoría 