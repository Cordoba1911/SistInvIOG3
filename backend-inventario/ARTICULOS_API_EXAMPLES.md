# API de Artículos - Ejemplos de Uso

## Endpoints Disponibles

### 1. Crear Artículo (POST /articulos)

**Endpoint:** `POST http://localhost:3000/articulos`

**Body (JSON):**
```json
{
  "codigo": 12345,
  "descripcion": "Tornillo M8x25mm",
  "demanda": 1000,
  "costo_almacenamiento": 0.50,
  "costo_pedido": 25.00,
  "costo_compra": 2.30
}
```

**Respuesta exitosa (201):**
```json
{
  "id": 1,
  "codigo": 12345,
  "descripcion": "Tornillo M8x25mm",
  "demanda": 1000,
  "costo_almacenamiento": 0.5,
  "costo_pedido": 25,
  "costo_compra": 2.3,
  "modelo_inventario": null,
  "lote_optimo": null,
  "punto_pedido": null,
  "stock_seguridad": null,
  "inventario_maximo": null,
  "cgi": null,
  "stock_actual": 0,
  "estado": true,
  "fecha_baja": null,
  "proveedor_predeterminado_id": null
}
```

### 2. Obtener Todos los Artículos (GET /articulos)

**Endpoint:** `GET http://localhost:3000/articulos`

**Respuesta exitosa (200):**
```json
[
  {
    "id": 1,
    "codigo": 12345,
    "descripcion": "Tornillo M8x25mm",
    "demanda": 1000,
    "costo_almacenamiento": 0.5,
    "costo_pedido": 25,
    "costo_compra": 2.3,
    "estado": true,
    "stock_actual": 0
  }
]
```

### 3. Obtener Artículo por ID (GET /articulos/:id)

**Endpoint:** `GET http://localhost:3000/articulos/1`

**Respuesta exitosa (200):** (mismo formato que crear artículo)

### 4. Verificar Posibilidad de Baja (GET /articulos/:id/verificar-baja)

**Endpoint:** `GET http://localhost:3000/articulos/1/verificar-baja`

**Respuesta cuando PUEDE ser dado de baja (200):**
```json
{
  "puedeSerDadoDeBaja": true,
  "impedimentos": [],
  "stockActual": 0,
  "ordenesActivas": 0
}
```

**Respuesta cuando NO PUEDE ser dado de baja (200):**
```json
{
  "puedeSerDadoDeBaja": false,
  "impedimentos": [
    "El artículo tiene 25 unidades en stock",
    "El artículo tiene 2 órdenes de compra activas: ID: 101 (pendiente), ID: 102 (enviada)"
  ],
  "stockActual": 25,
  "ordenesActivas": 2
}
```

### 5. Actualizar Artículo (PATCH /articulos/:id)

**Endpoint:** `PATCH http://localhost:3000/articulos/1`

**Body (JSON) - Actualización parcial:**
```json
{
  "demanda": 1200,
  "costo_compra": 2.45,
  "descripcion": "Tornillo M8x25mm Galvanizado"
}
```

**Respuesta exitosa (200):** (artículo actualizado completo)

### 6. Eliminar Artículo con Validaciones (DELETE /articulos/:id)

**Endpoint:** `DELETE http://localhost:3000/articulos/1`

**Respuesta exitosa (200):**
```json
{
  "message": "Artículo dado de baja exitosamente",
  "articulo": {
    "id": 1,
    "codigo": 12345,
    "descripcion": "Tornillo M8x25mm",
    "estado": false,
    "fecha_baja": "2024-01-15T10:30:00.000Z",
    "stock_actual": 0
  }
}
```

**Error por stock (400):**
```json
{
  "statusCode": 400,
  "message": "No se puede dar de baja el artículo porque tiene 25 unidades en stock. Debe reducir el stock a 0 antes de darlo de baja."
}
```

**Error por órdenes activas (400):**
```json
{
  "statusCode": 400,
  "message": "No se puede dar de baja el artículo porque tiene órdenes de compra activas: ID: 101 (pendiente), ID: 102 (enviada). Debe cancelar o finalizar todas las órdenes antes de dar de baja el artículo."
}
```

## Validaciones Implementadas

### Campos Obligatorios (CREATE)
- `codigo`: Número único
- `descripcion`: Texto único
- `demanda`: Número positivo
- `costo_almacenamiento`: Número positivo
- `costo_pedido`: Número positivo
- `costo_compra`: Número positivo

### Validaciones de Negocio
- El código debe ser único en el sistema
- La descripción debe ser única en el sistema
- Todos los costos y demanda deben ser valores positivos (> 0)
- No se pueden actualizar artículos inactivos
- El stock inicial se establece en 0 automáticamente

### Validaciones de Baja (DELETE)
1. **Stock en cero**: El artículo no puede tener unidades en stock
2. **Sin órdenes activas**: No puede tener órdenes de compra en estado "pendiente" o "enviada"
3. **Estado activo**: Solo se pueden dar de baja artículos activos

## Códigos de Error

### 400 - Bad Request
- Valores numéricos negativos o cero
- Datos de entrada inválidos
- **NUEVO**: Intento de baja con stock > 0
- **NUEVO**: Intento de baja con órdenes de compra activas
- **NUEVO**: Intento de baja de artículo ya inactivo

### 404 - Not Found
- Artículo no existe o está inactivo

### 409 - Conflict
- Código ya existe
- Descripción ya existe

## Características Especiales

1. **Soft Delete**: Los artículos eliminados se marcan como inactivos en lugar de eliminarse físicamente
2. **Validación de Unicidad**: Código y descripción deben ser únicos
3. **Estado por Defecto**: Los artículos nuevos se crean activos con stock en 0
4. **Filtrado Automático**: Solo se muestran artículos activos en las consultas
5. **🆕 Validaciones de Baja Robustas**: Control estricto contra stock y órdenes activas
6. **🆕 Endpoint de Verificación**: Permite consultar impedimentos antes de intentar la baja
7. **🆕 Mensajes Detallados**: Información específica sobre las razones de rechazo

## Flujo Recomendado para Baja de Artículos

1. **Consultar estado**: `GET /articulos/{id}/verificar-baja`
2. **Si hay impedimentos**: 
   - Reducir stock a 0 (si aplica)
   - Cancelar/finalizar órdenes activas (si aplica)
3. **Realizar baja**: `DELETE /articulos/{id}`
4. **Confirmar resultado**: Verificar respuesta y mensaje de éxito 