# Funcionalidad de Ajuste de Inventario - Frontend

## Descripción General

La funcionalidad de **Ajuste de Inventario** permite modificar las cantidades de stock de los artículos de forma directa, sin generar órdenes de compra u otras acciones automáticas. Esta herramienta es esencial para mantener la precisión del inventario y corregir discrepancias.

## Características Principales

### 🎯 **Funcionalidades Implementadas**

1. **Lista de Artículos**
   - Visualización de todos los artículos activos
   - Búsqueda en tiempo real por código, nombre o descripción
   - Información clave: stock actual, stock de seguridad, punto de pedido

2. **Modal de Ajuste**
   - Formulario intuitivo para ajustar cantidades
   - Campo opcional para motivo del ajuste
   - Resumen visual del ajuste antes de confirmar
   - Validaciones de entrada (no permite cantidades negativas)

3. **Confirmación y Resultado**
   - Modal de confirmación con detalles del ajuste realizado
   - Información completa del antes y después
   - Registro de fecha y hora del ajuste
   - Visualización del motivo (si se proporcionó)

### 🎨 **Interfaz de Usuario**

#### **Tabla Principal**
- **Código**: Identificador único del artículo
- **Nombre**: Denominación del artículo
- **Descripción**: Detalle del artículo
- **Stock Actual**: Cantidad actual con códigos de color:
  - 🔴 Rojo: Stock en cero
  - 🟡 Amarillo: Por debajo del stock de seguridad
  - 🔵 Azul: En punto de pedido
  - 🟢 Verde: Stock normal
- **Stock Seguridad**: Cantidad mínima recomendada
- **Punto Pedido**: Nivel que activa reposición
- **Acciones**: Botón "Ajustar" para cada artículo

#### **Modal de Ajuste**
- **Información del artículo**: Código y stock actual
- **Nueva Cantidad**: Campo numérico para ingresar la nueva cantidad
- **Motivo del Ajuste**: Campo de texto opcional para documentar el motivo
- **Resumen**: Vista previa del cambio con diferencia calculada

#### **Modal de Resultado**
- **Confirmación**: Mensaje de éxito
- **Detalles del Artículo**: ID, código, nombre
- **Detalles del Ajuste**: Stock anterior, nuevo, diferencia
- **Motivo**: Si se proporcionó
- **Registro**: Fecha y hora del ajuste

### 🔧 **Funcionalidades Técnicas**

#### **Validaciones**
- ✅ Cantidad no puede ser negativa
- ✅ Artículo debe existir y estar activo
- ✅ Campos obligatorios validados

#### **Estados de Carga**
- ✅ Loading spinner durante carga inicial
- ✅ Spinner en botón durante procesamiento
- ✅ Deshabilitación de controles durante operaciones

#### **Manejo de Errores**
- ✅ Alertas informativas para errores
- ✅ Mensajes descriptivos del backend
- ✅ Recuperación automática de errores

### 🛠 **Casos de Uso**

1. **Conteo Físico**
   - Ajustar cantidades después de inventarios físicos
   - Corregir discrepancias encontradas durante auditorías

2. **Registro de Mermas**
   - Documentar pérdidas por vencimiento, daños, etc.
   - Mantener registros de motivos para auditoría

3. **Correcciones de Sistema**
   - Ajustar errores de carga inicial
   - Corregir movimientos mal registrados

4. **Recepciones Directas**
   - Registrar mercadería recibida fuera del sistema de órdenes
   - Ajustar por entregas parciales o diferencias

### 📍 **Navegación**

**Acceso:** Artículos → "Ajuste de inventario"

**Ruta:** `/articulos/ajuste-inventario`

**Icono:** 📝 (Editar)

### 🔄 **Flujo de Trabajo**

1. **Selección de Artículo**
   - Buscar artículo usando filtros
   - Revisar información actual
   - Hacer clic en "Ajustar"

2. **Configuración del Ajuste**
   - Ingresar nueva cantidad
   - Agregar motivo (opcional pero recomendado)
   - Revisar resumen del cambio

3. **Confirmación**
   - Verificar datos antes de confirmar
   - Confirmar ajuste

4. **Resultado**
   - Revisar confirmación del ajuste
   - Verificar que los cambios se reflejen en la tabla

### ⚠️ **Consideraciones Importantes**

#### **Seguridad**
- Esta función modifica directamente el stock
- No genera órdenes de compra automáticas
- Cambios son inmediatos e irreversibles

#### **Auditoría**
- Todos los ajustes se registran con fecha/hora
- Se recomienda siempre proporcionar un motivo
- Los cambios se reflejan inmediatamente en el sistema

#### **Mejores Prácticas**
- ✅ Siempre documentar el motivo del ajuste
- ✅ Verificar la cantidad antes de confirmar
- ✅ Realizar conteos físicos regulares
- ✅ Mantener registros de los ajustes realizados

### 🔗 **Integración con Otras Funcionalidades**

- **Productos a Reponer**: Los ajustes afectan los cálculos de reposición
- **Productos Faltantes**: Cambios en stock pueden resolver alertas
- **Órdenes de Compra**: Stock actualizado afecta necesidades de compra
- **Reportes**: Los ajustes se reflejan en todos los reportes de inventario

### 📊 **Información Técnica**

#### **Endpoints Utilizados**
- `GET /articulos` - Obtener lista de artículos
- `PATCH /articulos/:id/ajustar-inventario` - Realizar ajuste

#### **Tipos TypeScript**
```typescript
interface AjusteInventarioDto {
  nueva_cantidad: number;
  motivo?: string;
}

interface ResultadoAjusteDto {
  articulo_id: number;
  codigo: string;
  nombre: string;
  stock_anterior: number;
  stock_nuevo: number;
  diferencia: number;
  motivo?: string;
  fecha_ajuste: Date;
}
```

## Conclusión

La funcionalidad de Ajuste de Inventario proporciona una herramienta esencial para mantener la precisión del inventario, permitiendo correcciones rápidas y documentadas sin generar acciones automáticas no deseadas. 