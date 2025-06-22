-- =============================================================================
-- SISTEMA DE INVENTARIO IOG3 - DATOS DE EJEMPLO
-- =============================================================================
-- Descripción: Script para poblar la base de datos con datos de prueba
-- Fecha: 2025-01-15
-- Uso: mysql -u root -p sistema_inventario_iog3 < populate-database.sql
-- =============================================================================

USE sistema_inventario_iog3;

-- =============================================================================
-- INSERTAR PROVEEDORES
-- =============================================================================
INSERT INTO proveedores (nombre, telefono, email) VALUES
('Pepe', '123-456-7890', 'sruizcucchiarelli@gmail.com'),
('María González', '098-765-4321', 'maria@proveedores.com'),
('Santiago', '555-123-4567', 'sruizcucchiarelli@gmail.com'),
('Distribuidora Central', '444-555-6666', 'ventas@distribuidora.com'),
('Suministros Industriales', '777-888-9999', 'contacto@suministros.com');

-- =============================================================================
-- INSERTAR ARTÍCULOS CON MODELOS DE INVENTARIO
-- =============================================================================

-- Artículos con modelo LOTE FIJO
INSERT INTO articulos (
    codigo, nombre, descripcion, stock_actual, stock_minimo, stock_maximo, precio_unitario,
    modelo_inventario, demanda, costo_compra, costo_pedido, costo_almacenamiento, tiempo_entrega,
    desviacion_estandar, nivel_servicio
) VALUES
('ART001', 'Tornillo M8x25mm', 'Tornillo con rosca métrica', 2, 50, 1000, 2.30,
 'lote_fijo', 2000, 2.00, 50.00, 0.20, 5, 200.00, 0.95),

('AC2312a12', 'Casco MAaC Razora', 'Casco nuevo', 0, 5, 100, 25.00,
 'lote_fijo', 600, 20.00, 100.00, 2.00, 1, 60.00, 0.90),

('ELEC001', 'Cable UTP Cat6', 'Cable de red categoría 6', 50, 20, 500, 1.50,
 'lote_fijo', 1200, 1.20, 30.00, 0.15, 3, 120.00, 0.95),

('FERRE001', 'Tuerca M8', 'Tuerca hexagonal métrica', 100, 200, 2000, 0.80,
 'lote_fijo', 3000, 0.60, 40.00, 0.08, 4, 300.00, 0.98);

-- Artículos con modelo PERÍODO FIJO
INSERT INTO articulos (
    codigo, nombre, descripcion, stock_actual, stock_minimo, stock_maximo, precio_unitario,
    modelo_inventario, demanda, costo_compra, costo_pedido, costo_almacenamiento, tiempo_entrega,
    desviacion_estandar, nivel_servicio, intervalo_revision
) VALUES
('OFICINA001', 'Papel A4 75g', 'Resma de papel blanco', 25, 10, 200, 5.50,
 'periodo_fijo', 800, 4.50, 25.00, 0.50, 2, 80.00, 0.95, 30),

('LIMPIEZA001', 'Detergente Industrial', 'Detergente para limpieza industrial', 8, 5, 50, 12.00,
 'periodo_fijo', 300, 10.00, 35.00, 1.20, 7, 30.00, 0.90, 45),

('HERR001', 'Destornillador Phillips', 'Destornillador punta Phillips #2', 15, 5, 50, 8.75,
 'periodo_fijo', 150, 7.00, 20.00, 0.70, 5, 15.00, 0.85, 60);

-- Artículos sin modelo (para comparación)
INSERT INTO articulos (
    codigo, nombre, descripcion, stock_actual, stock_minimo, stock_maximo, precio_unitario
) VALUES
('VARIOS001', 'Artículo sin modelo', 'Artículo para pruebas sin modelo de inventario', 30, 10, 100, 5.00),
('VARIOS002', 'Otro artículo', 'Otro artículo de ejemplo', 15, 5, 50, 15.00);

-- =============================================================================
-- RELACIONAR ARTÍCULOS CON PROVEEDORES
-- =============================================================================

-- Proveedor Pepe (id=1)
INSERT INTO articulo_proveedor (articulo_id, proveedor_id, precio_unitario, demora_entrega, es_predeterminado) VALUES
(1, 1, 2.30, 5, TRUE),  -- Tornillo M8x25mm
(3, 1, 1.60, 4, FALSE), -- Cable UTP Cat6
(4, 1, 0.85, 3, FALSE); -- Tuerca M8

-- Proveedor María González (id=2)
INSERT INTO articulo_proveedor (articulo_id, proveedor_id, precio_unitario, demora_entrega, es_predeterminado) VALUES
(5, 2, 5.20, 2, TRUE),  -- Papel A4 75g
(6, 2, 11.50, 6, TRUE), -- Detergente Industrial
(3, 2, 1.45, 5, TRUE);  -- Cable UTP Cat6 (proveedor predeterminado)

-- Santiago (id=3)
INSERT INTO articulo_proveedor (articulo_id, proveedor_id, precio_unitario, demora_entrega, es_predeterminado) VALUES
(2, 3, 2.00, 1, TRUE),  -- Casco MAaC Razora
(7, 3, 8.50, 4, TRUE),  -- Destornillador Phillips
(4, 3, 0.75, 5, TRUE);  -- Tuerca M8 (proveedor predeterminado)

-- Distribuidora Central (id=4)
INSERT INTO articulo_proveedor (articulo_id, proveedor_id, precio_unitario, demora_entrega, es_predeterminado) VALUES
(1, 4, 2.40, 7, FALSE), -- Tornillo M8x25mm
(8, 4, 4.80, 3, TRUE),  -- Artículo sin modelo
(9, 4, 14.50, 2, TRUE); -- Otro artículo

-- Suministros Industriales (id=5)
INSERT INTO articulo_proveedor (articulo_id, proveedor_id, precio_unitario, demora_entrega, es_predeterminado) VALUES
(2, 5, 24.00, 3, FALSE), -- Casco MAaC Razora
(6, 5, 12.50, 8, FALSE), -- Detergente Industrial
(7, 5, 9.00, 6, FALSE);  -- Destornillador Phillips

-- =============================================================================
-- INSERTAR ALGUNAS ÓRDENES DE COMPRA DE EJEMPLO
-- =============================================================================
INSERT INTO ordenes_compra (articulo_id, proveedor_id, cantidad, precio_unitario, estado, fecha_esperada, observaciones) VALUES
(5, 2, 50, 5.20, 'pendiente', DATE_ADD(CURDATE(), INTERVAL 2 DAY), 'Pedido urgente de papel'),
(6, 2, 10, 11.50, 'enviada', DATE_ADD(CURDATE(), INTERVAL 6 DAY), 'Detergente para limpieza mensual'),
(8, 4, 20, 4.80, 'recibida', CURDATE(), 'Pedido completado');

-- =============================================================================
-- INSERTAR ALGUNAS VENTAS DE EJEMPLO
-- =============================================================================
INSERT INTO ventas (fecha_venta, total, observaciones) VALUES
(DATE_SUB(CURDATE(), INTERVAL 1 DAY), 150.50, 'Venta a cliente regular'),
(DATE_SUB(CURDATE(), INTERVAL 3 DAY), 89.25, 'Venta al contado'),
(DATE_SUB(CURDATE(), INTERVAL 7 DAY), 245.00, 'Venta con descuento');

-- Detalles de las ventas
INSERT INTO detalle_venta (venta_id, articulo_id, cantidad, precio_unitario) VALUES
-- Venta 1
(1, 1, 10, 2.30),  -- Tornillos
(1, 3, 5, 1.50),   -- Cables
(1, 4, 20, 0.80),  -- Tuercas
-- Venta 2
(2, 2, 2, 25.00),  -- Cascos
(2, 7, 4, 8.75),   -- Destornilladores
-- Venta 3
(3, 5, 15, 5.50),  -- Papel
(3, 6, 8, 12.00);  -- Detergente

-- =============================================================================
-- MOSTRAR RESUMEN DE DATOS INSERTADOS
-- =============================================================================
SELECT 'Datos de ejemplo insertados exitosamente' as mensaje;

SELECT 'PROVEEDORES:' as tabla, COUNT(*) as total FROM proveedores
UNION ALL
SELECT 'ARTÍCULOS:', COUNT(*) FROM articulos
UNION ALL
SELECT 'RELACIONES ARTÍCULO-PROVEEDOR:', COUNT(*) FROM articulo_proveedor
UNION ALL
SELECT 'ÓRDENES DE COMPRA:', COUNT(*) FROM ordenes_compra
UNION ALL
SELECT 'VENTAS:', COUNT(*) FROM ventas
UNION ALL
SELECT 'DETALLES DE VENTA:', COUNT(*) FROM detalle_venta; 