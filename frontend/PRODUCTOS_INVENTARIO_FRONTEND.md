# Gestión de Inventario - Frontend

## Nuevas Funcionalidades Implementadas

### 🔴 Productos a Reponer
**Ruta:** `/articulos/productos-a-reponer`

**Descripción:** Muestra los productos que han alcanzado el punto de pedido y NO tienen órdenes de compra activas (pendientes o enviadas).

**Características:**
- ✅ Tabla responsiva con información detallada
- ✅ Badges de colores para identificar estados críticos
- ✅ Botón "Ordenar" para crear órdenes de compra (preparado para integración futura)
- ✅ Modal de confirmación para creación de órdenes
- ✅ Cantidad sugerida basada en lote óptimo
- ✅ Información del proveedor predeterminado
- ✅ Actualización en tiempo real
- ✅ Estados de carga y error

**Campos mostrados:**
- Código del producto
- Nombre y descripción
- Stock actual
- Punto de pedido
- Diferencia (punto_pedido - stock_actual)
- Cantidad sugerida
- Modelo de inventario
- Proveedor predeterminado
- Acciones disponibles

### 🟠 Productos Faltantes
**Ruta:** `/articulos/productos-faltantes`

**Descripción:** Muestra los productos cuyo stock actual está por debajo del stock de seguridad definido.

**Características:**
- ✅ Vista de déficit de stock de seguridad
- ✅ Información del proveedor predeterminado
- ✅ Badges de colores según severidad del déficit
- ✅ Actualización en tiempo real
- ✅ Estados de carga y error

**Campos mostrados:**
- Código del producto
- Nombre y descripción
- Stock actual
- Stock de seguridad
- Déficit (stock_seguridad - stock_actual)
- Punto de pedido
- Proveedor predeterminado

## Navegación

### Sidebar - Dropdown Artículos
```
Artículos
├── Agregar artículos
├── Lista de artículos
├── ⚠️ Productos a reponer
└── ❗ Productos faltantes
```

## Integración con Backend

### Endpoints Consumidos
- `GET /articulos/a-reponer` - Productos a reponer
- `GET /articulos/faltantes` - Productos faltantes
- `PATCH /articulos/:id/ajustar-inventario` - Ajustar inventario (preparado)

### Tipos TypeScript
```typescript
interface ProductoAReponer {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  stock_actual: number;
  punto_pedido: number;
  diferencia: number;
  lote_optimo?: number;
  modelo_inventario: string;
  proveedor_predeterminado?: {
    id: number;
    nombre: string;
    telefono: string;
  };
  cantidad_sugerida?: number;
}

interface ProductoFaltante {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  stock_actual: number;
  stock_seguridad: number;
  diferencia: number;
  punto_pedido: number;
  proveedor_predeterminado?: {
    id: number;
    nombre: string;
    telefono: string;
  };
}
```

## Características Técnicas

### Estados de UI
- **Loading**: Spinner mientras carga datos
- **Error**: Alert con botón de reintento
- **Empty**: Mensaje positivo cuando no hay productos críticos
- **Success**: Datos mostrados en tabla responsiva

### Manejo de Errores
- Captura de errores de red
- Mensajes descriptivos al usuario
- Botones de reintento
- Logs detallados en consola

### Responsividad
- Tablas responsivas con scroll horizontal
- Badges adaptativos
- Botones optimizados para móvil
- Cards que se adaptan al contenedor

### Accesibilidad
- Iconos descriptivos
- Colores semánticos (rojo=crítico, amarillo=advertencia, verde=ok)
- Tooltips informativos
- Textos alternativos

## Próximas Mejoras

### 🔄 En Desarrollo
- Integración directa con módulo de órdenes de compra
- Creación automática de órdenes desde productos a reponer
- Notificaciones push para productos críticos
- Filtros avanzados por proveedor, modelo, etc.
- Exportación a Excel/PDF

### 💡 Futuras Funcionalidades
- Dashboard con métricas de inventario
- Gráficos de tendencias de stock
- Alertas configurables por usuario
- Integración con códigos de barras
- Predicción de demanda con IA

## Instalación y Uso

1. **Prerequisitos**: Backend corriendo en puerto 3000
2. **Iniciar frontend**: `npm run dev`
3. **Acceder**: http://localhost:5173
4. **Navegar**: Sidebar > Artículos > Productos a reponer/faltantes

## Configuración

### Variables de Entorno
```env
VITE_API_URL=http://localhost:3000
```

### Dependencias Agregadas
- Tipos TypeScript para nuevas interfaces
- Servicios API para endpoints de inventario
- Componentes React para gestión de productos críticos 