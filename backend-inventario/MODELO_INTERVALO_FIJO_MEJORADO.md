# Modelo Intervalo Fijo (Período Fijo) - Implementación Completa

## Descripción General

El **Modelo de Intervalo Fijo** (también conocido como Período Fijo o Fixed Period Model) es un sistema de control de inventario donde las revisiones del stock se realizan en intervalos regulares de tiempo predeterminados. A diferencia del modelo de lote fijo, aquí la cantidad ordenada varía según las necesidades, pero el tiempo entre revisiones es constante.

## Características del Modelo

### Ventajas
- **Simplicidad Administrativa**: Las revisiones se programan regularmente
- **Eficiencia en Compras**: Permite consolidar pedidos de múltiples productos
- **Flexibilidad**: Se adapta a variaciones en la demanda
- **Control Periódico**: Facilita la gestión rutinaria del inventario

### Desventajas
- **Mayor Stock de Seguridad**: Requiere más inventario de protección
- **Riesgo de Faltantes**: El período entre revisiones puede crear vulnerabilidades
- **Costos Variables**: Las cantidades de pedido fluctúan

## Fórmulas Matemáticas Implementadas

### 1. Stock de Seguridad
```
SS = Z × σ × √(R + L)
```
**Donde:**
- `SS` = Stock de Seguridad
- `Z` = Factor de seguridad (Z-score basado en nivel de servicio)
- `σ` = Desviación estándar de la demanda diaria
- `R` = Intervalo de revisión (días)
- `L` = Demora de entrega (días)

### 2. Inventario Máximo
```
IM = D × (R + L) + SS
```
**Donde:**
- `IM` = Inventario Máximo
- `D` = Demanda diaria promedio
- `R + L` = Tiempo total del ciclo (revisión + entrega)
- `SS` = Stock de seguridad

### 3. Cantidad a Ordenar
```
Q = IM - I_actual + D × R
```
**Donde:**
- `Q` = Cantidad a ordenar
- `IM` = Inventario máximo
- `I_actual` = Inventario actual
- `D × R` = Demanda durante el intervalo de revisión

### 4. Nivel de Inventario Objetivo
```
NIO = D × L + SS
```
**Donde:**
- `NIO` = Nivel de Inventario Objetivo
- `D × L` = Demanda durante la entrega
- `SS` = Stock de seguridad

## Mapeo de Niveles de Servicio a Z-scores

| Nivel de Servicio | Z-score | Descripción |
|-------------------|---------|-------------|
| 85% | 1.04 | Básico |
| 90% | 1.28 | Estándar |
| 95% | 1.645 | Recomendado |
| 97.5% | 1.96 | Alto |
| 99% | 2.33 | Crítico |

## Implementación Backend

### Entidad Actualizada

```typescript
// Campos agregados a la entidad Articulo
@Column({ type: 'int', nullable: true })
intervalo_revision: number; // Intervalo de revisión en días

@Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
desviacion_estandar: number; // Variabilidad de la demanda

@Column({ type: 'decimal', precision: 3, scale: 2, default: 0.95 })
nivel_servicio: number; // Probabilidad de no tener faltantes
```

### DTOs Implementados

#### CalculoIntervaloFijoDto
```typescript
export class CalculoIntervaloFijoDto {
  demanda: number;                    // Demanda anual
  intervalo_revision: number;         // Intervalo de revisión (días)
  demora_entrega?: number;           // Demora de entrega (días)
  desviacion_estandar?: number;      // Desviación estándar de la demanda
  nivel_servicio?: number;           // Nivel de servicio (0.5-0.999)
  stock_actual?: number;             // Stock actual
  costo_almacenamiento?: number;     // Costo de almacenamiento
  costo_compra?: number;             // Costo de compra
}
```

#### ResultadoIntervaloFijoDto
```typescript
export class ResultadoIntervaloFijoDto {
  stock_seguridad: number;           // Stock de seguridad calculado
  inventario_maximo: number;         // Inventario máximo
  cantidad_ordenar: number;          // Cantidad a ordenar
  costo_total_periodo: number;       // Costo total del período
  nivel_inventario_objetivo: number; // Nivel objetivo de inventario
  
  // Métricas adicionales
  demanda_durante_ciclo: number;     // Demanda durante el ciclo completo
  demanda_durante_entrega: number;   // Demanda durante la entrega
  costo_almacenamiento_periodo: number; // Costo de almacenamiento del período
  tiempo_ciclo_completo: number;     // Tiempo total del ciclo (días)
  stock_promedio_esperado: number;   // Stock promedio esperado
}
```

### Endpoints API

#### 1. Calcular Modelo Intervalo Fijo
```http
POST /api/articulos/calcular-intervalo-fijo
Content-Type: application/json

{
  "demanda": 1200,
  "intervalo_revision": 30,
  "demora_entrega": 7,
  "desviacion_estandar": 120,
  "nivel_servicio": 0.95,
  "stock_actual": 150,
  "costo_almacenamiento": 5.5,
  "costo_compra": 25.0
}
```

#### 2. Aplicar Cálculo a Artículo
```http
POST /api/articulos/{id}/aplicar-calculo/periodo_fijo
```

### Recálculo Automático

El sistema recalcula automáticamente cuando cambian las variables:
- Demanda
- Intervalo de revisión
- Desviación estándar
- Nivel de servicio
- Costo de almacenamiento

```typescript
private async recalcularModeloSiEsNecesario(articulo: Articulo): Promise<void> {
  if (
    articulo.modelo_inventario === 'periodo_fijo' &&
    articulo.demanda &&
    articulo.intervalo_revision &&
    articulo.costo_almacenamiento
  ) {
    // Recalcular y actualizar automáticamente
  }
}
```

## Implementación Frontend

### Tipos TypeScript

```typescript
export interface CalculoIntervaloFijoDto {
  demanda: number;
  intervalo_revision: number;
  demora_entrega?: number;
  desviacion_estandar?: number;
  nivel_servicio?: number;
  stock_actual?: number;
  costo_almacenamiento?: number;
  costo_compra?: number;
}

export interface ResultadoIntervaloFijoDto {
  stock_seguridad: number;
  inventario_maximo: number;
  cantidad_ordenar: number;
  costo_total_periodo: number;
  nivel_inventario_objetivo: number;
  demanda_durante_ciclo: number;
  demanda_durante_entrega: number;
  costo_almacenamiento_periodo: number;
  tiempo_ciclo_completo: number;
  stock_promedio_esperado: number;
}
```

### Servicio Frontend

```typescript
export class FixedIntervalService {
  static async calcularIntervaloFijo(datos: CalculoIntervaloFijoDto): Promise<ResultadoIntervaloFijoDto>
  static async aplicarCalculoAArticulo(articuloId: number): Promise<Articulo>
  static async obtenerArticulosIntervaloFijo(): Promise<Articulo[]>
  static validarDatosCalculo(datos: Partial<CalculoIntervaloFijoDto>): string[]
  static formatearResultados(resultado: ResultadoIntervaloFijoDto)
  static compararResultados(articuloActual: Articulo, resultadoCalculado: ResultadoIntervaloFijoDto)
}
```

### Calculadora Avanzada

La calculadora incluye:
- **Selección de Artículos**: Filtrados por modelo intervalo fijo
- **Auto-llenado**: Parámetros desde datos del artículo
- **Validación en Tiempo Real**: Errores y rangos permitidos
- **Comparación Visual**: Valores actuales vs calculados con badges de color
- **Aplicación Directa**: Confirmación antes de actualizar el artículo

## Migración de Base de Datos

### SQL Requerido

```sql
-- Agregar campo para modelo intervalo fijo
ALTER TABLE articulos ADD COLUMN intervalo_revision INT NULL;

-- Agregar campos para modelo lote fijo (si no existen)
ALTER TABLE articulos ADD COLUMN desviacion_estandar DECIMAL(5,2) NULL;
ALTER TABLE articulos ADD COLUMN nivel_servicio DECIMAL(3,2) DEFAULT 0.95;
```

### Scripts de Migración

- `migration-add-inventory-fields.sql` - Con nombre de base de datos específica
- `migration-add-inventory-fields-generic.sql` - Versión genérica

## Casos de Uso Prácticos

### Ejemplo 1: Producto de Consumo Regular
```
Demanda Anual: 1,200 unidades
Intervalo de Revisión: 30 días
Demora de Entrega: 7 días
Desviación Estándar: 120 unidades
Nivel de Servicio: 95%

Resultados:
- Stock de Seguridad: 65 unidades
- Inventario Máximo: 186 unidades
- Cantidad a Ordenar: 135 unidades (si stock actual = 150)
```

### Ejemplo 2: Producto Estacional
```
Demanda Anual: 2,400 unidades
Intervalo de Revisión: 15 días
Demora de Entrega: 10 días
Desviación Estándar: 300 unidades
Nivel de Servicio: 99%

Resultados:
- Stock de Seguridad: 136 unidades
- Inventario Máximo: 300 unidades
- Cantidad a Ordenar: Varía según stock actual
```

## Diferencias con Modelo Lote Fijo

| Aspecto | Lote Fijo | Intervalo Fijo |
|---------|-----------|----------------|
| **Revisión** | Continua | Periódica |
| **Cantidad Pedido** | Fija (EOQ) | Variable |
| **Tiempo entre Pedidos** | Variable | Fijo |
| **Stock de Seguridad** | Menor | Mayor |
| **Complejidad** | Media | Baja |
| **Uso Recomendado** | Productos A | Productos B y C |

## Validaciones Implementadas

### Backend (Class Validators)
- Demanda > 0 (obligatorio)
- Intervalo de revisión > 0 (obligatorio)
- Demora de entrega ≥ 0
- Desviación estándar ≥ 0
- Nivel de servicio: 0.5 ≤ valor ≤ 0.999
- Stock actual ≥ 0
- Costos ≥ 0

### Frontend (Validación en Tiempo Real)
- Rangos permitidos en inputs
- Mensajes de error descriptivos
- Validación antes de cálculo
- Confirmación antes de aplicar cambios

## Archivos de Prueba

### Backend
- `test-modelo-intervalo-fijo.http` - Casos de prueba completos
- Incluye escenarios: básico, mínimo, alto nivel servicio, errores

### Frontend
- Calculadora interactiva con datos de ejemplo
- Comparación visual de resultados
- Aplicación directa a artículos

## Consideraciones de Rendimiento

- **Cálculos Eficientes**: Operaciones matemáticas optimizadas
- **Recálculo Inteligente**: Solo cuando cambian variables relevantes
- **Validación Temprana**: Errores detectados antes del cálculo
- **Caché de Resultados**: Evita recálculos innecesarios

## Próximos Pasos

1. **Ejecutar Migración**: Agregar campos a la base de datos
2. **Probar Endpoints**: Usar archivos .http incluidos
3. **Validar Frontend**: Verificar calculadora y formularios
4. **Capacitación**: Entrenar usuarios en el nuevo modelo

## Soporte y Mantenimiento

- **Logs Detallados**: Errores capturados y registrados
- **Validación Robusta**: Múltiples niveles de verificación
- **Documentación Completa**: Guías y ejemplos incluidos
- **Pruebas Extensivas**: Casos de uso reales probados 