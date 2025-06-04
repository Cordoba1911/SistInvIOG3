# API de Artículos - Ejemplos de Uso

## Endpoints Disponibles

### 1. Crear Artículo (POST /articulos)

**Endpoint:** `POST http://localhost:3000/articulos`

**Body (JSON) - Completo:**
```json
{
  "codigo": 12345,
  "descripcion": "Tornillo M8x25mm",
  "demanda": 1000,
  "costo_almacenamiento": 0.50,
  "costo_pedido": 25.00,
  "costo_compra": 2.30,
  "proveedor_predeterminado_id": 3
}
```

**Body (JSON) - Sin proveedor predeterminado:**
```json
{
  "codigo": 12346,
  "descripcion": "Tuerca M8",
  "demanda": 500,
  "costo_almacenamiento": 0.30,
  "costo_pedido": 20.00,
  "costo_compra": 1.80
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
  "proveedor_predeterminado_id": 3,
  "proveedor_predeterminado": {
    "id": 3,
    "nombre": "Proveedor XYZ",
    "telefono": "123456789",
    "email": "proveedor@xyz.com",
    "estado": true
  }
}
```

**Errores de Validación (400):**

**Campo faltante:**
```json
{
  "statusCode": 400,
  "message": [
    "El código es obligatorio",
    "La descripción es obligatoria",
    "La demanda es obligatoria"
  ],
  "error": "Bad Request"
}
```

**Tipos incorrectos:**
```json
{
  "statusCode": 400,
  "message": [
    "El código debe ser un número",
    "La demanda debe ser mayor a 0"
  ],
  "error": "Bad Request"
}
```

**Propiedades extra:**
```json
{
  "statusCode": 400,
  "message": [
    "property campo_inexistente should not exist"
  ],
  "error": "Bad Request"
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
    "stock_actual": 0,
    "proveedor_predeterminado_id": 3,
    "proveedor_predeterminado": {
      "id": 3,
      "nombre": "Proveedor XYZ",
      "telefono": "123456789",
      "email": "proveedor@xyz.com",
      "estado": true
    }
  }
]
```

### 3. Obtener Proveedores Disponibles (GET /articulos/proveedores-disponibles)

**Endpoint:** `GET http://localhost:3000/articulos/proveedores-disponibles`

**Respuesta exitosa (200):**
```json
[
  {
    "id": 1,
    "nombre": "Proveedor ABC",
    "telefono": "111222333",
    "email": "abc@proveedor.com",
    "estado": true
  },
  {
    "id": 2,
    "nombre": "Proveedor DEF",
    "telefono": "444555666",
    "email": "def@proveedor.com",
    "estado": true
  },
  {
    "id": 3,
    "nombre": "Proveedor XYZ",
    "telefono": "123456789",
    "email": "proveedor@xyz.com",
    "estado": true
  }
]
```

### 4. Obtener Artículo por ID (GET /articulos/:id)

**Endpoint:** `GET http://localhost:3000/articulos/1`

**Respuesta exitosa (200):** (mismo formato que crear artículo, incluyendo datos del proveedor)

### 5. Actualizar Artículo (PATCH /articulos/:id)

**Endpoint:** `PATCH http://localhost:3000/articulos/1`

**Body (JSON) - Actualización parcial:**
```json
{
  "demanda": 1200,
  "costo_compra": 2.45,
  "descripcion": "Tornillo M8x25mm Galvanizado",
  "proveedor_predeterminado_id": 2
}
```

**Body (JSON) - Remover proveedor predeterminado:**
```json
{
  "proveedor_predeterminado_id": null
}
```

**Respuesta exitosa (200):** (artículo actualizado completo con datos del proveedor)

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

**Error por proveedor inválido (400):**
```json
{
  "statusCode": 400,
  "message": "El proveedor con ID 999 no existe o no está activo"
}
```

## Validaciones Implementadas

### ✅ Validaciones Automáticas (Decoradores)

#### Campos Obligatorios (CREATE)
- **`codigo`**: Número obligatorio y único
- **`descripcion`**: Texto obligatorio y único
- **`demanda`**: Número obligatorio y positivo (> 0)
- **`costo_almacenamiento`**: Número obligatorio y positivo (> 0)
- **`costo_pedido`**: Número obligatorio y positivo (> 0)
- **`costo_compra`**: Número obligatorio y positivo (> 0)

#### Campos Opcionales (CREATE/UPDATE)
- **`proveedor_predeterminado_id`**: ID de proveedor activo existente (opcional)

#### Validaciones de Tipo
- **Números**: Se valida que sean valores numéricos válidos
- **Textos**: Se valida que sean strings
- **Positivos**: Se valida que los números sean mayores a 0

#### Validaciones de Entrada
- **Propiedades Extra**: Se rechazan campos no definidos en el DTO
- **Campos Vacíos**: Se valida que los campos obligatorios no estén vacíos
- **Transformación**: Los tipos se convierten automáticamente

### ✅ Validaciones de Negocio (Servicio)
- El código debe ser único en el sistema
- La descripción debe ser única en el sistema
- No se pueden actualizar artículos inactivos
- El stock inicial se establece en 0 automáticamente
- **Proveedor predeterminado debe existir y estar activo**

### ✅ Validaciones de Proveedor Predeterminado
1. **Existencia**: El proveedor debe existir en el sistema
2. **Estado activo**: El proveedor debe estar activo (no dado de baja)
3. **Opcional**: Es posible crear/actualizar artículos sin proveedor predeterminado
4. **Removible**: Se puede quitar el proveedor predeterminado enviando `null`

### ✅ Validaciones de Baja (DELETE)
1. **Stock en cero**: El artículo no puede tener unidades en stock
2. **Sin órdenes activas**: No puede tener órdenes de compra en estado "pendiente" o "enviada"
3. **Estado activo**: Solo se pueden dar de baja artículos activos

## Códigos de Error

### 400 - Bad Request
- **Validaciones automáticas**:
  - Campos obligatorios faltantes
  - Tipos de datos incorrectos
  - Valores negativos o cero en campos numéricos
  - Propiedades extra no permitidas
- **Validaciones de negocio**:
  - Intento de baja con stock > 0
  - Intento de baja con órdenes de compra activas
  - Intento de baja de artículo ya inactivo
  - Proveedor predeterminado inválido o inactivo

### 404 - Not Found
- Artículo no existe o está inactivo

### 409 - Conflict
- Código ya existe
- Descripción ya existe

## Características Especiales

1. **Validaciones Automáticas**: DTOs con decoradores que validan entrada automáticamente
2. **Mensajes de Error Claros**: Información específica sobre cada campo inválido
3. **Soft Delete**: Los artículos eliminados se marcan como inactivos
4. **Validación de Unicidad**: Código y descripción deben ser únicos
5. **Estado por Defecto**: Los artículos nuevos se crean activos con stock en 0
6. **Filtrado Automático**: Solo se muestran artículos activos en las consultas
7. **Validaciones de Baja Robustas**: Control estricto contra stock y órdenes activas
8. **Proveedor Predeterminado**: Gestión completa de proveedores asignados a artículos
9. **Relaciones Cargadas**: Los datos del proveedor se incluyen automáticamente
10. **Limpieza de Datos**: Propiedades extra se eliminan automáticamente

## Flujo Recomendado para Gestión de Artículos

### Para Crear un Artículo:
1. **Obtener proveedores**: `GET /articulos/proveedores-disponibles`
2. **Crear artículo**: `POST /articulos` con **todos los campos obligatorios**
   - Los campos se validarán automáticamente
   - Se rechazarán campos faltantes o inválidos

### Para Actualizar Proveedor:
1. **Obtener proveedores**: `GET /articulos/proveedores-disponibles`
2. **Actualizar artículo**: `PATCH /articulos/{id}` con nuevo `proveedor_predeterminado_id`
3. **Remover proveedor**: `PATCH /articulos/{id}` con `proveedor_predeterminado_id: null`

### Para Baja de Artículos (Enfoque Simplificado):
1. **Intentar eliminación**: `DELETE /articulos/{id}`
2. **Si es exitosa**: Mostrar mensaje de confirmación
3. **Si falla**: El mensaje de error contiene información específica sobre qué corregir
4. **Corregir impedimentos** y volver a intentar

### Ejemplo de Manejo de Errores en Frontend:
```javascript
try {
  const result = await createArticulo(data);
  showSuccessMessage('Artículo creado exitosamente');
} catch (error) {
  if (error.status === 400) {
    // error.message es un array con todos los errores de validación
    const errors = Array.isArray(error.message) ? error.message : [error.message];
    showValidationErrors(errors);
  }
}
``` 