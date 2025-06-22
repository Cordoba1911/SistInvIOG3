# Migración de Base de Datos - Campos de Inventario

## 🚨 **IMPORTANTE: Debes ejecutar esta migración para que funcione el modelo lote fijo**

### ❌ **Error que estás viendo:**
```
500 Internal Server Error
```

### ✅ **Solución:**
Ejecutar el script SQL para agregar los nuevos campos a la tabla `articulos`.

## 📋 **Instrucciones de Migración**

### Opción 1: Usando MySQL Workbench / phpMyAdmin
1. Abre tu cliente de MySQL (Workbench, phpMyAdmin, etc.)
2. Conecta a tu base de datos
3. Ejecuta el contenido del archivo: `migration-add-inventory-fields-generic.sql`

### Opción 2: Usando línea de comandos
```bash
# Conectar a MySQL
mysql -u tu_usuario -p

# Seleccionar la base de datos
USE tu_base_de_datos;

# Ejecutar los comandos:
ALTER TABLE articulos 
ADD COLUMN desviacion_estandar DECIMAL(5,2) NULL 
COMMENT 'Variabilidad de la demanda para cálculos de stock de seguridad';

ALTER TABLE articulos 
ADD COLUMN nivel_servicio DECIMAL(3,2) DEFAULT 0.95 
COMMENT 'Probabilidad de no tener faltantes (0.5 a 0.999)';

# Verificar que se agregaron
DESCRIBE articulos;
```

### Opción 3: Ejecutar archivo SQL completo
```bash
mysql -u tu_usuario -p tu_base_de_datos < migration-add-inventory-fields-generic.sql
```

## 🔍 **Verificación**

Después de ejecutar la migración, deberías ver estos nuevos campos en la tabla `articulos`:

| Campo | Tipo | Nulo | Predeterminado | Comentario |
|-------|------|------|----------------|------------|
| `desviacion_estandar` | DECIMAL(5,2) | SÍ | NULL | Variabilidad de la demanda |
| `nivel_servicio` | DECIMAL(3,2) | NO | 0.95 | Probabilidad de no tener faltantes |

## 🎯 **Después de la Migración**

1. **Reinicia el servidor backend**
2. **Verifica que no hay errores 500**
3. **Prueba crear/editar artículos** con los nuevos campos
4. **Usa la calculadora de lote fijo** en el frontend

## 📝 **Campos Agregados**

### `desviacion_estandar`
- **Tipo:** DECIMAL(5,2) 
- **Permite NULL:** Sí
- **Propósito:** Almacena la variabilidad de la demanda para cálculos de stock de seguridad
- **Ejemplo:** 15.50 (para una demanda con desviación estándar de 15.5 unidades)

### `nivel_servicio`
- **Tipo:** DECIMAL(3,2)
- **Valor por defecto:** 0.95 (95%)
- **Rango válido:** 0.50 a 0.999
- **Propósito:** Define la probabilidad de no tener faltantes
- **Ejemplos:** 
  - 0.95 = 95% de confiabilidad
  - 0.99 = 99% de confiabilidad

## 🚀 **Beneficios Después de la Migración**

- ✅ **Formularios funcionando** con todos los campos de inventario
- ✅ **Calculadora de lote fijo** completamente operativa
- ✅ **Recálculo automático** cuando cambien las variables
- ✅ **Cálculos precisos** de stock de seguridad y punto de pedido
- ✅ **Sin errores 500** en el backend

## ⚠️ **Notas Importantes**

- **Backup:** Recomendado hacer backup antes de ejecutar la migración
- **Datos existentes:** Los artículos existentes tendrán `nivel_servicio = 0.95` por defecto
- **Compatibilidad:** Los campos son opcionales, no rompen funcionalidad existente
- **Rollback:** Para deshacer, ejecutar:
  ```sql
  ALTER TABLE articulos DROP COLUMN desviacion_estandar;
  ALTER TABLE articulos DROP COLUMN nivel_servicio;
  ``` 