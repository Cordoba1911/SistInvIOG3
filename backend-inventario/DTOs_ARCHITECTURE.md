# Arquitectura de DTOs - Sistema de Inventario

## Estructura de DTOs Implementada

### Principios de Diseño

1. **Separación de Responsabilidades**: Las entidades de base de datos no se exponen directamente en la API
2. **Control de Información**: Solo se expone la información necesaria para cada endpoint
3. **Consistencia**: Todos los endpoints usan DTOs tipados para respuestas
4. **Seguridad**: Se evita la exposición accidental de campos sensibles

## DTOs por Módulo

### 📦 Artículos

#### Input DTOs (Entrada)
- **`CreateArticuloDto`**: Para crear nuevos artículos
- **`UpdateArticuloDto`**: Para actualizar artículos existentes

#### Output DTOs (Respuesta)
- **`ArticuloResponseDto`**: Respuesta estándar para artículos
  - Incluye todos los campos del artículo
  - Incluye `ProveedorResponseDto` cuando hay proveedor predeterminado

### 🏢 Proveedores

#### Output DTOs (Respuesta)
- **`ProveedorResponseDto`**: Respuesta estándar para proveedores
  - Solo campos públicos (id, nombre, telefono, email, estado)
  - Se usa tanto standalone como dentro de `ArticuloResponseDto`

## Transformaciones Implementadas

### En ArticulosService

```typescript
// Método principal de transformación
private toArticuloResponseDto(articulo: Articulo): ArticuloResponseDto {
  return {
    id: articulo.id,
    codigo: articulo.codigo,
    descripcion: articulo.descripcion,
    // ... otros campos
    proveedor_predeterminado: articulo.proveedor_predeterminado 
      ? this.toProveedorResponseDto(articulo.proveedor_predeterminado)
      : undefined
  };
}

// Transformación de proveedor
private toProveedorResponseDto(proveedor: any): ProveedorResponseDto {
  return {
    id: proveedor.id,
    nombre: proveedor.nombre,
    telefono: proveedor.telefono,
    email: proveedor.email,
    estado: proveedor.estado
  };
}
```

## Endpoints con DTOs

### GET /articulos
**Respuesta**: `ArticuloResponseDto[]`
```json
[
  {
    "id": 1,
    "codigo": 12345,
    "descripcion": "Tornillo M8x25mm",
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

### GET /articulos/:id
**Respuesta**: `ArticuloResponseDto`
```json
{
  "id": 1,
  "codigo": 12345,
  "descripcion": "Tornillo M8x25mm",
  "demanda": 1000,
  "costo_almacenamiento": 0.5,
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

### GET /articulos/proveedores-disponibles
**Respuesta**: `ProveedorResponseDto[]`
```json
[
  {
    "id": 1,
    "nombre": "Proveedor ABC",
    "telefono": "111222333",
    "email": "abc@proveedor.com",
    "estado": true
  }
]
```

### POST /articulos
**Entrada**: `CreateArticuloDto`
**Respuesta**: `ArticuloResponseDto`

### PATCH /articulos/:id
**Entrada**: `UpdateArticuloDto`
**Respuesta**: `ArticuloResponseDto`

### DELETE /articulos/:id
**Respuesta**: `{ message: string; articulo: ArticuloResponseDto }`

## Beneficios de esta Arquitectura

### 🔒 Seguridad
- No se exponen campos internos de las entidades
- Control granular sobre qué información se devuelve
- Prevención de información sensible en respuestas

### 📊 Consistencia
- Todas las respuestas tienen estructura predecible
- Tipos TypeScript garantizan consistencia
- Documentación automática de la estructura de datos

### 🔄 Mantenibilidad
- Cambios en entidades no afectan la API
- Fácil evolución de la estructura de respuestas
- Separación clara entre modelo de datos y API

### 🚀 Performance
- Solo se cargan y transforman los datos necesarios
- Control sobre las relaciones que se incluyen
- Optimización de consultas de base de datos

## Flujo de Datos

```
1. Request  → Controller
2. Controller → Service (con DTOs de entrada)
3. Service → Repository (entidades)
4. Repository → Database
5. Database → Repository (entidades)
6. Repository → Service (entidades)
7. Service → toResponseDto() (transformación)
8. Service → Controller (DTOs de respuesta)
9. Controller → Response (JSON)
```

## Convenciones de Nomenclatura

- **Input DTOs**: `Create{Entity}Dto`, `Update{Entity}Dto`
- **Output DTOs**: `{Entity}ResponseDto`
- **Métodos de transformación**: `to{Entity}ResponseDto()`
- **Campos opcionales**: Usar `?:` en TypeScript
- **Relaciones**: Incluir DTO anidado cuando corresponda

Esta arquitectura asegura que el API sea robusto, seguro y fácil de mantener mientras proporciona exactamente la información necesaria para cada caso de uso. 