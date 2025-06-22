# Productos a Reponer - Funcionalidad Implementada

## Descripción
Esta funcionalidad permite obtener un listado de los artículos que han alcanzado el punto de pedido (o están por debajo) y **NO** tienen una orden de compra pendiente o enviada.

## Endpoint

```
GET /articulos/a-reponer
```

## Criterios de Filtrado

1. **Artículo activo**: `estado = true`
2. **Punto de pedido definido**: `punto_pedido IS NOT NULL`
3. **Stock bajo o igual al punto de pedido**: `stock_actual <= punto_pedido`
4. **Sin órdenes de compra activas**: No debe tener órdenes con estado `pendiente` o `enviada`

## Respuesta

La respuesta incluye la siguiente información para cada producto:

```typescript
interface ProductoAReponerDto {
  id: number;
  codigo: string;
  nombre: string;
  descripcion: string;
  stock_actual: number;
  punto_pedido: number;
  diferencia: number; // punto_pedido - stock_actual
  lote_optimo?: number;
  modelo_inventario: string;
  proveedor_predeterminado?: {
    id: number;
    nombre: string;
    telefono: string;
  };
  cantidad_sugerida?: number; // Cantidad que se sugiere ordenar
}
```

## Lógica de Cantidad Sugerida

- Si el artículo tiene `lote_optimo` definido, se usa ese valor
- Si no, se calcula como: `diferencia + stock_seguridad` (o 20% adicional si no hay stock de seguridad)

## Diferencias con `productos-faltantes`

| Criterio | Productos Faltantes | Productos a Reponer |
|----------|-------------------|-------------------|
| Comparación | `stock_actual < stock_seguridad` | `stock_actual <= punto_pedido` |
| Filtro órdenes | No aplica | Excluye productos con órdenes activas |
| Propósito | Identificar déficit general | Identificar productos listos para reordenar |

## Ejemplo de Uso

```bash
curl -X GET http://localhost:3000/articulos/a-reponer
```

## Casos de Uso

1. **Dashboard de compras**: Mostrar productos que requieren reposición inmediata
2. **Generación automática de órdenes**: Crear órdenes de compra para productos críticos
3. **Alertas de inventario**: Notificar al equipo de compras sobre productos por reponer
4. **Planificación de compras**: Programar pedidos basados en punto de pedido

## Estados de Órdenes de Compra Considerados "Activos"

- `pendiente`: Orden creada pero no enviada
- `enviada`: Orden enviada al proveedor pero no recibida

Los estados `finalizada` y `cancelada` NO se consideran activos, por lo que productos con estas órdenes sí aparecerán en el listado si cumplen los demás criterios. 