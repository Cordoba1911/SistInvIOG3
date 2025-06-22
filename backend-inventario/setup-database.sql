-- =============================================================================
-- SCRIPT DE CONFIGURACIÓN COMPLETA - SISTEMA DE INVENTARIO IOG3
-- =============================================================================
-- Descripción: Crea la base de datos completa con todas las tablas y relaciones
-- Fecha: 2025-01-15
-- Versión: 1.0
-- =============================================================================

-- Crear la base de datos si no existe
CREATE DATABASE IF NOT EXISTS sistema_inventario_iog3;
USE sistema_inventario_iog3;

-- =============================================================================
-- TABLA: proveedores
-- =============================================================================
CREATE TABLE IF NOT EXISTS proveedores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_nombre (nombre),
    INDEX idx_email (email)
) ENGINE=InnoDB COMMENT='Tabla de proveedores del sistema';

-- =============================================================================
-- TABLA: articulos
-- =============================================================================
CREATE TABLE IF NOT EXISTS articulos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    stock_actual INT DEFAULT 0,
    stock_minimo INT DEFAULT 0,
    stock_maximo INT DEFAULT 0,
    precio_unitario DECIMAL(10,2) DEFAULT 0.00,
    
    -- Campos para modelos de inventario
    modelo_inventario ENUM('lote_fijo', 'periodo_fijo') DEFAULT NULL,
    demanda DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Demanda anual estimada',
    costo_compra DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Costo unitario de compra',
    costo_pedido DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Costo fijo por pedido',
    costo_almacenamiento DECIMAL(10,2) DEFAULT 0.00 COMMENT 'Costo de almacenamiento por unidad/año',
    tiempo_entrega INT DEFAULT 0 COMMENT 'Tiempo de entrega en días',
    
    -- Campos calculados automáticamente
    punto_pedido DECIMAL(10,2) DEFAULT NULL COMMENT 'Punto de reorden calculado',
    stock_seguridad DECIMAL(10,2) DEFAULT NULL COMMENT 'Stock de seguridad calculado',
    lote_optimo DECIMAL(10,2) DEFAULT NULL COMMENT 'Lote económico (EOQ) para modelo lote fijo',
    inventario_maximo DECIMAL(10,2) DEFAULT NULL COMMENT 'Inventario máximo para modelo período fijo',
    cgi DECIMAL(10,2) DEFAULT NULL COMMENT 'Costo de Gestión de Inventario',
    
    -- Campos adicionales para cálculos
    desviacion_estandar DECIMAL(5,2) DEFAULT NULL COMMENT 'Desviación estándar de la demanda',
    nivel_servicio DECIMAL(3,2) DEFAULT 0.95 COMMENT 'Nivel de servicio deseado (0.5 a 0.999)',
    intervalo_revision INT DEFAULT NULL COMMENT 'Intervalo de revisión en días (para período fijo)',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_codigo (codigo),
    INDEX idx_nombre (nombre),
    INDEX idx_modelo (modelo_inventario),
    INDEX idx_stock (stock_actual)
) ENGINE=InnoDB COMMENT='Tabla de artículos con campos para modelos de inventario';

-- =============================================================================
-- TABLA: articulo_proveedor (relación muchos a muchos)
-- =============================================================================
CREATE TABLE IF NOT EXISTS articulo_proveedor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    articulo_id INT NOT NULL,
    proveedor_id INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    demora_entrega INT DEFAULT 0 COMMENT 'Tiempo de entrega en días',
    es_predeterminado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (articulo_id) REFERENCES articulos(id) ON DELETE CASCADE,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE,
    UNIQUE KEY unique_articulo_proveedor (articulo_id, proveedor_id),
    INDEX idx_articulo (articulo_id),
    INDEX idx_proveedor (proveedor_id)
) ENGINE=InnoDB COMMENT='Relación entre artículos y proveedores';

-- =============================================================================
-- TABLA: ordenes_compra
-- =============================================================================
CREATE TABLE IF NOT EXISTS ordenes_compra (
    id INT AUTO_INCREMENT PRIMARY KEY,
    articulo_id INT NOT NULL,
    proveedor_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    total DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    estado ENUM('pendiente', 'enviada', 'recibida', 'cancelada') DEFAULT 'pendiente',
    fecha_pedido TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_esperada DATE DEFAULT NULL,
    fecha_recibida DATE DEFAULT NULL,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (articulo_id) REFERENCES articulos(id) ON DELETE RESTRICT,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE RESTRICT,
    INDEX idx_estado (estado),
    INDEX idx_fecha_pedido (fecha_pedido),
    INDEX idx_articulo (articulo_id),
    INDEX idx_proveedor (proveedor_id)
) ENGINE=InnoDB COMMENT='Órdenes de compra del sistema';

-- =============================================================================
-- TABLA: ventas
-- =============================================================================
CREATE TABLE IF NOT EXISTS ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_fecha (fecha_venta)
) ENGINE=InnoDB COMMENT='Registro de ventas';

-- =============================================================================
-- TABLA: detalle_venta
-- =============================================================================
CREATE TABLE IF NOT EXISTS detalle_venta (
    id INT AUTO_INCREMENT PRIMARY KEY,
    venta_id INT NOT NULL,
    articulo_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (venta_id) REFERENCES ventas(id) ON DELETE CASCADE,
    FOREIGN KEY (articulo_id) REFERENCES articulos(id) ON DELETE RESTRICT,
    INDEX idx_venta (venta_id),
    INDEX idx_articulo (articulo_id)
) ENGINE=InnoDB COMMENT='Detalle de artículos vendidos';

-- =============================================================================
-- CONFIGURACIÓN INICIAL
-- =============================================================================

-- Configurar el modo SQL para evitar problemas con GROUP BY
SET sql_mode = 'STRICT_TRANS_TABLES,NO_ZERO_DATE,NO_ZERO_IN_DATE,ERROR_FOR_DIVISION_BY_ZERO';

-- Mostrar información de la base de datos creada
SELECT 'Base de datos configurada exitosamente' as mensaje;
SHOW TABLES; 