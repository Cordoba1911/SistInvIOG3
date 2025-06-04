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

### 4. Actualizar Artículo (PATCH /articulos/:id)

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

### 5. Eliminar Artículo (DELETE /articulos/:id)

**Endpoint:** `DELETE http://localhost:3000/articulos/1`

**Respuesta exitosa (200):**
```json
{
  "id": 1,
  "codigo": 12345,
  "descripcion": "Tornillo M8x25mm",
  "estado": false,
  "fecha_baja": "2024-01-15T10:30:00.000Z"
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

## Códigos de Error

### 400 - Bad Request
- Valores numéricos negativos o cero
- Datos de entrada inválidos

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