# Funcionalidad de Ajuste de Inventario - Backend

## Descripción General

La funcionalidad de **Ajuste de Inventario** en el backend permite modificar las cantidades de stock de los artículos de forma directa, sin generar órdenes de compra u otras acciones automáticas. Esta implementación garantiza la integridad de los datos y proporciona un registro completo de los ajustes realizados.

## Arquitectura y Componentes

### 📁 **Archivos Involucrados**

1. **DTOs**
   - `src/articulos/dto/ajuste-inventario.dto.ts` - Definición de tipos de datos

2. **Controlador**
   - `src/articulos/articulos.controller.ts` - Endpoint PATCH `:id/ajustar-inventario`

3. **Servicio**
   - `src/articulos/articulos.service.ts` - Lógica de negocio del ajuste

4. **Pruebas**
   - `test-ajuste-inventario.http` - Casos de prueba HTTP

## Endpoint Principal

### `PATCH /articulos/:id/ajustar-inventario`

**Descripción:** Ajusta la cantidad de stock de un artículo específico.

**Parámetros:**
- `id` (path): ID del artículo a ajustar

**Body (JSON):**
```typescript
{
  "nueva_cantidad": number,    // Requerido: Nueva cantidad de stock
  "motivo"?: string           // Opcional: Motivo del ajuste
}
```

**Respuesta Exitosa (200):**
```typescript
{
  "articulo_id": number,
  "codigo": string,
  "nombre": string,
  "stock_anterior": number,
  "stock_nuevo": number,
  "diferencia": number,
  "motivo"?: string,
  "fecha_ajuste": Date
}
```

## DTOs (Data Transfer Objects)

### `AjusteInventarioDto`

```typescript
export class AjusteInventarioDto {
  @IsNotEmpty({ message: 'La nueva cantidad es obligatoria' })
  @IsNumber({}, { message: 'La nueva cantidad debe ser un número' })
  nueva_cantidad: number;

  @IsOptional()
  @IsString({ message: 'El motivo debe ser una cadena de texto' })
  motivo?: string;
}
```

**Validaciones:**
- ✅ `nueva_cantidad` es obligatoria y debe ser un número
- ✅ `motivo` es opcional y debe ser una cadena de texto

### `ResultadoAjusteDto`

```typescript
export class ResultadoAjusteDto {
  articulo_id: number;         // ID del artículo ajustado
  codigo: string;              // Código del artículo
  nombre: string;              // Nombre del artículo
  stock_anterior: number;      // Cantidad antes del ajuste
  stock_nuevo: number;         // Cantidad después del ajuste
  diferencia: number;          // Diferencia (nuevo - anterior)
  motivo?: string;             // Motivo del ajuste (si se proporcionó)
  fecha_ajuste: Date;          // Timestamp del ajuste
}
```

## Lógica de Negocio

### Método `ajustarInventario`

```typescript
async ajustarInventario(
  articuloId: number, 
  ajuste: AjusteInventarioDto
): Promise<ResultadoAjusteDto>
```

#### **Validaciones Implementadas:**

1. **Existencia del Artículo**
   - Verifica que el artículo existe y está activo
   - Error 404 si no se encuentra

2. **Validación de Cantidad**
   - La nueva cantidad no puede ser negativa
   - Error 400 si es menor a 0

3. **Integridad de Datos**
   - Actualización atómica del stock
   - Cálculo automático de la diferencia

#### **Proceso de Ajuste:**

1. **Búsqueda del Artículo**
   ```typescript
   const articulo = await this.articuloRepository.findOne({
     where: { id: articuloId, estado: true },
   });
   ```

2. **Validaciones**
   - Artículo existe y está activo
   - Nueva cantidad >= 0

3. **Cálculo de Diferencia**
   ```typescript
   const stockAnterior = articulo.stock_actual;
   const diferencia = ajuste.nueva_cantidad - stockAnterior;
   ```

4. **Actualización del Stock**
   ```typescript
   articulo.stock_actual = ajuste.nueva_cantidad;
   await this.articuloRepository.save(articulo);
   ```

5. **Generación del Resultado**
   - Información completa del ajuste realizado
   - Timestamp automático del ajuste

## Manejo de Errores

### **Errores Comunes y Respuestas**

1. **Artículo No Encontrado (404)**
   ```json
   {
     "statusCode": 404,
     "message": "Artículo no encontrado"
   }
   ```

2. **Cantidad Negativa (400)**
   ```json
   {
     "statusCode": 400,
     "message": "La nueva cantidad no puede ser negativa"
   }
   ```

3. **Validación de Entrada (400)**
   ```json
   {
     "statusCode": 400,
     "message": ["La nueva cantidad es obligatoria"]
   }
   ```

## Casos de Prueba

### **Pruebas Incluidas en `test-ajuste-inventario.http`**

1. ✅ **Incrementar Stock**
   - Aumentar cantidad con motivo

2. ✅ **Reducir Stock**
   - Disminuir cantidad con motivo

3. ✅ **Ajuste Sin Motivo**
   - Cambio de cantidad sin especificar motivo

4. ✅ **Stock a Cero**
   - Ajustar cantidad a 0

5. ❌ **Cantidad Negativa**
   - Prueba de validación (debe fallar)

6. ❌ **Artículo Inexistente**
   - Prueba con ID inválido (debe fallar)

7. ✅ **Motivo Detallado**
   - Ajuste con descripción extensa

## Características Técnicas

### **Principios de Diseño**

1. **Atomicidad**
   - Operación completa o no se realiza
   - No hay estados inconsistentes

2. **Trazabilidad**
   - Registro completo del ajuste
   - Información antes y después

3. **Validación Robusta**
   - Múltiples niveles de validación
   - Mensajes de error descriptivos

4. **Simplicidad**
   - Una operación, un propósito
   - No genera efectos secundarios

### **Seguridad y Auditoría**

- ✅ Validación de entrada con class-validator
- ✅ Verificación de existencia del artículo
- ✅ Registro automático de timestamp
- ✅ Preservación del motivo del ajuste
- ✅ Cálculo automático de diferencias

### **Performance**

- ✅ Operación directa en base de datos
- ✅ Una sola consulta de búsqueda
- ✅ Una sola operación de actualización
- ✅ Respuesta inmediata con resultado completo

## Integración con Otras Funcionalidades

### **Impacto en el Sistema**

1. **Productos a Reponer**
   - Los ajustes afectan los cálculos de reposición
   - Stock actualizado modifica las alertas

2. **Productos Faltantes**
   - Cambios pueden resolver o generar alertas
   - Recálculo automático en próximas consultas

3. **Órdenes de Compra**
   - Stock actualizado afecta necesidades futuras
   - No cancela órdenes existentes

4. **Reportes de Inventario**
   - Cambios se reflejan inmediatamente
   - Histórico mantiene integridad

### **Lo que NO hace esta funcionalidad**

- ❌ No genera órdenes de compra automáticas
- ❌ No cancela órdenes existentes
- ❌ No envía notificaciones automáticas
- ❌ No actualiza precios o costos
- ❌ No modifica configuraciones del artículo

## Ejemplos de Uso

### **1. Conteo Físico**
```http
PATCH /articulos/1/ajustar-inventario
{
  "nueva_cantidad": 150,
  "motivo": "Conteo físico anual - diferencia encontrada en sector A"
}
```

### **2. Registro de Merma**
```http
PATCH /articulos/2/ajustar-inventario
{
  "nueva_cantidad": 75,
  "motivo": "Merma por productos vencidos - lote ABC123"
}
```

### **3. Corrección de Error**
```http
PATCH /articulos/3/ajustar-inventario
{
  "nueva_cantidad": 100,
  "motivo": "Corrección por error en carga inicial del sistema"
}
```

## Conclusión

La implementación del ajuste de inventario en el backend proporciona una herramienta robusta, segura y trazable para mantener la precisión del inventario. Su diseño simple pero completo garantiza la integridad de los datos mientras proporciona la flexibilidad necesaria para diversos casos de uso empresariales. 