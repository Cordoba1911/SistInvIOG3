-- Migración para agregar campos de inventario necesarios para modelos de gestión
-- Base de datos: sistema_inventario_iog3

USE sistema_inventario_iog3;

-- Agregar campos para modelo lote fijo
ALTER TABLE articulos ADD COLUMN desviacion_estandar DECIMAL(5,2) NULL;
ALTER TABLE articulos ADD COLUMN nivel_servicio DECIMAL(3,2) DEFAULT 0.95;

-- Agregar campo para modelo intervalo fijo
ALTER TABLE articulos ADD COLUMN intervalo_revision INT NULL;

-- Verificar que se agregaron correctamente
DESCRIBE articulos; 