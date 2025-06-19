# API de Artículos - Ejemplos de Uso

## Endpoints Disponibles

- POST /articulos - Crear artículo  
- GET /articulos - Obtener todos los artículos
- GET /articulos/:id - Obtener artículo por ID
- PATCH /articulos/:id - Actualizar artículo
- DELETE /articulos/:id - Eliminar artículo (con validaciones)
- POST /articulos/calcular/lote-fijo - Calcular modelo Lote Fijo
- POST /articulos/calcular/intervalo-fijo - Calcular modelo Intervalo Fijo
- POST /articulos/:id/aplicar-calculo/:modelo - Aplicar cálculo a artículo
- **POST /articulos/calcular/cgi - Calcular CGI (Costo de Gestión del Inventario)**
- **POST /articulos/:id/calcular-cgi - Calcular y actualizar CGI de un artículo**

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

## 🆕 Cálculo del CGI (Costo de Gestión del Inventario)

### 7. Calcular CGI (POST /articulos/calcular/cgi)

**¿Qué es el CGI?**  
El CGI (Costo de Gestión del Inventario) es un indicador que representa el costo total anual de gestionar el inventario de un artículo como múltiplo del costo de compra. Un CGI de 1.069 significa que el costo total de gestión es 6.9% más alto que el costo de los productos.

**Endpoint:** `POST http://localhost:3000/articulos/calcular/cgi`

**Body (JSON) - Completo:**
```json
{
  "demanda_anual": 1000,
  "costo_compra": 2.30,
  "costo_almacenamiento": 0.50,
  "costo_pedido": 25.00,
  "lote_optimo": 316,
  "stock_promedio": 158
}
```

**Body (JSON) - Mínimo requerido (se calculan automáticamente lote óptimo y stock promedio):**
```json
{
  "demanda_anual": 1000,
  "costo_compra": 2.30,
  "costo_almacenamiento": 0.50,
  "costo_pedido": 25.00
}
```

**Respuesta exitosa (200):**
```json
{
  "costo_total_anual": 2458.86,
  "costo_pedidos_anuales": 79.11,
  "costo_almacenamiento_anual": 79.06,
  "costo_compra_anual": 2300.00,
  "cgi": 1.069,
  "stock_promedio": 158.11,
  "numero_pedidos_anuales": 3.16,
  "frecuencia_pedidos_dias": 115.4
}
```

**Explicación del resultado:**
- **`costo_total_anual`**: Suma de todos los costos anuales (pedidos + almacenamiento + compra)
- **`costo_pedidos_anuales`**: Costo anual de realizar pedidos (número_pedidos × costo_pedido)
- **`costo_almacenamiento_anual`**: Costo anual de mantener inventario (stock_promedio × costo_almacenamiento)
- **`costo_compra_anual`**: Costo anual de compra de productos (demanda × costo_compra)
- **`cgi`**: Ratio del costo total vs costo de compra (costo_total_anual / costo_compra_anual)
- **`stock_promedio`**: Inventario promedio mantenido (lote_optimo / 2)
- **`numero_pedidos_anuales`**: Frecuencia de pedidos por año (demanda / lote_optimo)
- **`frecuencia_pedidos_dias`**: Cada cuántos días se hace un pedido (365 / numero_pedidos_anuales)

### 8. Calcular y Actualizar CGI de un Artículo (POST /articulos/:id/calcular-cgi)

**Endpoint:** `POST http://localhost:3000/articulos/1/calcular-cgi`

**Descripción:** Calcula el CGI usando los datos del artículo existente (demanda, costos) y actualiza automáticamente el campo `cgi` en la base de datos.

**Respuesta exitosa (200):**
```json
{
  "id": 1,
  "codigo": "12345",
  "nombre": "Tornillo",
  "descripcion": "Tornillo M8x25mm",
  "demanda": 1000,
  "costo_almacenamiento": 0.5,
  "costo_pedido": 25,
  "costo_compra": 2.3,
  "precio_venta": 4.50,
  "modelo_inventario": "lote_fijo",
  "lote_optimo": 316,
  "punto_pedido": 83,
  "stock_seguridad": 50,
  "inventario_maximo": null,
  "cgi": 1.069,
  "stock_actual": 0,
  "estado": true,
  "fecha_baja": null,
  "proveedores": [
    {
      "proveedor_id": 3,
      "nombre": "Proveedor XYZ",
      "telefono": "123456789",
      "email": "proveedor@xyz.com",
      "precio_unitario": 2.30,
      "demora_entrega": 7,
      "cargos_pedido": 5.00,
      "proveedor_predeterminado": true
    }
  ]
}
```

**Errores comunes (400):**

**Datos insuficientes:**
```json
{
  "statusCode": 400,
  "message": "El artículo debe tener demanda, costo_compra, costo_almacenamiento y costo_pedido para calcular el CGI",
  "error": "Bad Request"
}
```

**Artículo no encontrado (404):**
```json
{
  "statusCode": 404,
  "message": "Artículo no encontrado",
  "error": "Not Found"
}
```

## Fórmulas Utilizadas para el Cálculo del CGI

### 1. Lote Óptimo (EOQ) - Si no se proporciona:
```
EOQ = √(2 × D × S / H)
```
Donde:
- **D** = Demanda anual
- **S** = Costo de pedido
- **H** = Costo de almacenamiento por unidad

### 2. Número de Pedidos Anuales:
```
N = D / Q
```
Donde:
- **Q** = Lote óptimo

### 3. Costo de Pedidos Anuales:
```
CP = N × S = (D / Q) × S
```

### 4. Stock Promedio:
```
Stock Promedio = Q / 2
```

### 5. Costo de Almacenamiento Anual:
```
CA = Stock Promedio × H = (Q / 2) × H
```

### 6. Costo de Compra Anual:
```
CC = D × C
```
Donde:
- **C** = Costo unitario de compra

### 7. Costo Total Anual:
```
CTA = CP + CA + CC
```

### 8. CGI (Costo de Gestión del Inventario):
```
CGI = CTA / CC
```

### 9. Frecuencia de Pedidos en Días:
```
Frecuencia = 365 / N
```

## Interpretación del CGI

- **CGI = 1.000**: El costo de gestión es igual al costo de los productos
- **CGI = 1.069**: El costo de gestión es 6.9% mayor al costo de los productos  
- **CGI = 1.200**: El costo de gestión es 20% mayor al costo de los productos
- **CGI < 1.100**: Gestión eficiente de inventario
- **CGI > 1.300**: Gestión costosa, revisar parámetros de inventario

## Casos de Uso del CGI

1. **Comparar eficiencia** entre diferentes artículos
2. **Identificar artículos costosos** de gestionar
3. **Optimizar parámetros** de inventario
4. **Evaluar proveedores** por impacto en costos de gestión
5. **Tomar decisiones** sobre políticas de inventario

---

# 🆕 Funciones de Gestión de Inventario

## 9. Listado de Productos Faltantes (GET /articulos/faltantes)

**Descripción:** Obtiene el listado de artículos cuyo stock actual está por debajo del stock de seguridad definido.

**Endpoint:** `GET http://localhost:3000/articulos/faltantes`

**Respuesta exitosa (200):**
```json
[
  {
    "id": 2,
    "codigo": "MOUSE001",
    "nombre": "Mouse Logitech M100",
    "descripcion": "Mouse óptico USB con cable",
    "stock_actual": 3,
    "stock_seguridad": 8,
    "diferencia": 5,
    "punto_pedido": 12,
    "proveedor_predeterminado": {
      "id": 1,
      "nombre": "TechSupply SA",
      "telefono": "+54 11 4567-8900"
    }
  },
  {
    "id": 5,
    "codigo": "TECLADO001",
    "nombre": "Teclado Genius KB-125",
    "descripcion": "Teclado mecánico con cable USB",
    "stock_actual": 1,
    "stock_seguridad": 5,
    "diferencia": 4,
    "punto_pedido": 8,
    "proveedor_predeterminado": {
      "id": 2,
      "nombre": "Distribuidora Norte",
      "telefono": "+54 351 123-4567"
    }
  }
]
```

**Campos de respuesta:**
- **`diferencia`**: Cantidad faltante para alcanzar el stock de seguridad (stock_seguridad - stock_actual)
- **`proveedor_predeterminado`**: Datos del proveedor marcado como predeterminado para facilitar la reposición

## 10. Proveedores por Artículo (GET /articulos/:id/proveedores)

**Descripción:** Obtiene todos los proveedores asociados a un artículo específico con sus condiciones comerciales.

**Endpoint:** `GET http://localhost:3000/articulos/1/proveedores`

**Respuesta exitosa (200):**
```json
[
  {
    "proveedor_id": 1,
    "nombre": "TechSupply SA",
    "telefono": "+54 11 4567-8900",
    "email": "ventas@techsupply.com",
    "precio_unitario": 800.0,
    "demora_entrega": 7,
    "cargos_pedido": 25.0,
    "proveedor_predeterminado": true
  },
  {
    "proveedor_id": 3,
    "nombre": "MegaTech Distribuidora",
    "telefono": "+54 341 987-6543",
    "email": "compras@megatech.com",
    "precio_unitario": 820.0,
    "demora_entrega": 10,
    "cargos_pedido": 30.0,
    "proveedor_predeterminado": false
  }
]
```

**Uso típico:** Esta función es útil para:
- Comparar condiciones entre proveedores
- Seleccionar el mejor proveedor para una orden de compra
- Revisar configuraciones de proveedores por artículo

## 11. Ajuste de Inventario (PATCH /articulos/:id/ajustar-inventario)

**Descripción:** Ajusta el stock actual de un artículo sin generar órdenes de compra ni otras acciones automáticas. Ideal para correcciones de inventario físico.

**Endpoint:** `PATCH http://localhost:3000/articulos/1/ajustar-inventario`

**Body (JSON):**
```json
{
  "nueva_cantidad": 25,
  "motivo": "Inventario físico - diferencia encontrada en depósito A"
}
```

**Campos del body:**
- **`nueva_cantidad`** (obligatorio): Nueva cantidad de stock que tendrá el artículo
- **`motivo`** (opcional): Descripción del motivo del ajuste

**Respuesta exitosa (200):**
```json
{
  "articulo_id": 1,
  "codigo": "LAPTOP001",
  "nombre": "Laptop Dell Inspiron 15",
  "stock_anterior": 12,
  "stock_nuevo": 25,
  "diferencia": 13,
  "motivo": "Inventario físico - diferencia encontrada en depósito A",
  "fecha_ajuste": "2024-01-15T10:30:00.000Z"
}
```

**Campos de respuesta:**
- **`diferencia`**: Cambio en el stock (positivo = aumento, negativo = disminución)
- **`fecha_ajuste`**: Timestamp del momento del ajuste

**Errores comunes:**

**Cantidad negativa (400):**
```json
{
  "message": "La nueva cantidad no puede ser negativa",
  "error": "Bad Request",
  "statusCode": 400
}
```

**Artículo no encontrado (404):**
```json
{
  "message": "Artículo no encontrado",
  "error": "Not Found",
  "statusCode": 404
}
```

## Casos de Uso de las Nuevas Funciones

### Productos Faltantes
- **Monitoreo diario** de artículos que necesitan reposición
- **Alertas automáticas** para equipos de compras
- **Priorización** de órdenes de compra según urgencia

### Proveedores por Artículo
- **Comparación de precios** entre proveedores
- **Selección de proveedor** para órdenes de compra
- **Análisis de condiciones** comerciales (demoras, cargos)

### Ajuste de Inventario
- **Corrección de inventarios físicos** vs sistema
- **Ajustes por mermas** o productos dañados
- **Sincronización** después de auditorías
- **Corrección de errores** de carga manual

## Flujo Recomendado de Gestión

1. **Monitoreo diario** con `/articulos/faltantes`
2. **Análisis de proveedores** con `/articulos/:id/proveedores` 
3. **Creación de órdenes** de compra basadas en la información obtenida
4. **Ajustes de inventario** cuando sea necesario con `/articulos/:id/ajustar-inventario` 