-- Migración: Agregar campos de inventario para modelo lote fijo
-- Fecha: 2025-06-21
-- Descripción: Agrega campos desviacion_estandar y nivel_servicio a la tabla articulos
-- INSTRUCCIONES: Ejecutar este script en la base de datos correspondiente

-- Agregar campo desviacion_estandar
ALTER TABLE articulos 
ADD COLUMN desviacion_estandar DECIMAL(5,2) NULL 
COMMENT 'Variabilidad de la demanda para cálculos de stock de seguridad';

-- Agregar campo nivel_servicio con valor por defecto 0.95 (95%)
ALTER TABLE articulos 
ADD COLUMN nivel_servicio DECIMAL(3,2) DEFAULT 0.95 
COMMENT 'Probabilidad de no tener faltantes (0.5 a 0.999)';

-- Agregar campo para modelo intervalo fijo
ALTER TABLE articulos ADD COLUMN intervalo_revision INT NULL;

-- Verificar que los campos se agregaron correctamente
DESCRIBE articulos;

-- Ejemplo de actualización de datos existentes (opcional)
-- UPDATE articulos SET nivel_servicio = 0.95 WHERE nivel_servicio IS NULL;
-- UPDATE articulos SET desviacion_estandar = demanda * 0.1 WHERE desviacion_estandar IS NULL AND demanda > 0; 