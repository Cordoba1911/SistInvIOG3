# Configuración de Base de Datos - Sistema de Inventario IOG3

Este directorio contiene los scripts necesarios para configurar y poblar la base de datos MySQL del Sistema de Inventario IOG3.

## 📁 Archivos Incluidos

- **`create-database.sql`** - Script para crear la estructura completa de la base de datos
- **`populate-database.sql`** - Script para poblar la base de datos con datos de ejemplo
- **`setup-mysql.ps1`** - Script de PowerShell para automatizar todo el proceso
- **`migration-add-inventory-fields.sql`** - Migración adicional para campos de inventario

## 🚀 Configuración Automática (Recomendado)

### Opción 1: Script de PowerShell (Windows)

```powershell
# Navegar al directorio backend
cd backend-inventario

# Ejecutar el script de configuración
.\setup-mysql.ps1
```

El script te guiará paso a paso:
1. ✅ Verificará que MySQL esté instalado
2. 🔐 Solicitará las credenciales de MySQL
3. 🔗 Probará la conexión
4. 🏗️ Creará la base de datos y tablas
5. 📊 Opcionalmente poblará con datos de ejemplo
6. 🔄 Aplicará migraciones adicionales

## 🛠️ Configuración Manual

### Paso 1: Crear la Base de Datos

```bash
# Conectar a MySQL
mysql -u root -p

# Ejecutar el script de creación
mysql -u root -p < create-database.sql
```

### Paso 2: Poblar con Datos de Ejemplo (Opcional)

```bash
# Poblar la base de datos
mysql -u root -p sistema_inventario_iog3 < populate-database.sql
```

### Paso 3: Aplicar Migraciones Adicionales

```bash
# Aplicar campos adicionales de inventario
mysql -u root -p sistema_inventario_iog3 < migration-add-inventory-fields.sql
```

## 📊 Estructura de la Base de Datos

### Tablas Principales

- **`proveedores`** - Información de proveedores
- **`articulos`** - Artículos con campos para modelos de inventario
- **`articulo_proveedor`** - Relación muchos a muchos entre artículos y proveedores
- **`ordenes_compra`** - Órdenes de compra del sistema
- **`ventas`** - Registro de ventas
- **`detalle_venta`** - Detalle de artículos vendidos

### Campos Especiales para Modelos de Inventario

- **Modelo Lote Fijo**: `lote_optimo`, `punto_pedido`, `stock_seguridad`
- **Modelo Período Fijo**: `inventario_maximo`, `intervalo_revision`
- **Campos Comunes**: `demanda`, `costo_compra`, `costo_pedido`, `costo_almacenamiento`

## 🔧 Configuración del Backend

Después de configurar la base de datos, actualiza tu archivo `.env` en el backend:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=tu_contraseña
DB_DATABASE=sistema_inventario_iog3
```

## 📋 Datos de Ejemplo Incluidos

El script de población incluye:

- **5 Proveedores** con información de contacto
- **9 Artículos** con diferentes modelos de inventario:
  - 4 artículos con modelo **Lote Fijo**
  - 3 artículos con modelo **Período Fijo**
  - 2 artículos sin modelo (para comparación)
- **Relaciones artículo-proveedor** con precios y tiempos de entrega
- **Órdenes de compra** de ejemplo en diferentes estados
- **Ventas** con detalles para simular movimientos de stock

## 🧪 Verificación de la Instalación

Para verificar que todo funciona correctamente:

```sql
-- Conectar a la base de datos
USE sistema_inventario_iog3;

-- Verificar tablas creadas
SHOW TABLES;

-- Verificar datos insertados
SELECT COUNT(*) as proveedores FROM proveedores;
SELECT COUNT(*) as articulos FROM articulos;
SELECT COUNT(*) as relaciones FROM articulo_proveedor;
```

## 🚨 Solución de Problemas

### Error: "MySQL no encontrado"
- Instala MySQL Server desde: https://dev.mysql.com/downloads/mysql/
- Asegúrate de que MySQL esté en el PATH del sistema

### Error: "Access denied"
- Verifica las credenciales de MySQL
- Asegúrate de que el servidor MySQL esté ejecutándose

### Error: "Database already exists"
- Si quieres recrear la base de datos, elimínala primero:
  ```sql
  DROP DATABASE IF EXISTS sistema_inventario_iog3;
  ```

## 📞 Soporte

Si encuentras problemas durante la configuración:

1. Verifica que MySQL Server esté instalado y ejecutándose
2. Confirma que las credenciales sean correctas
3. Revisa los logs de error de MySQL
4. Asegúrate de tener permisos para crear bases de datos

---

**¡Configuración completada!** 🎉

Una vez configurada la base de datos, puedes iniciar el backend con:

```bash
cd backend-inventario
npm run start:dev
``` 