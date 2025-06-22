-- =============================================================================
-- SISTEMA DE INVENTARIO IOG3 - CREACIÓN DE BASE DE DATOS
-- =============================================================================
-- Descripción: Script para crear la estructura completa de la base de datos
-- Fecha: 2025-01-15
-- Uso: mysql -u root -p < create-database.sql
-- =============================================================================

-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS sistema_inventario_iog3 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

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
    INDEX idx_nombre (nombre)
) ENGINE=InnoDB;

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
    demanda DECIMAL(10,2) DEFAULT 0.00,
    costo_compra DECIMAL(10,2) DEFAULT 0.00,
    costo_pedido DECIMAL(10,2) DEFAULT 0.00,
    costo_almacenamiento DECIMAL(10,2) DEFAULT 0.00,
    tiempo_entrega INT DEFAULT 0,
    
    -- Campos calculados automáticamente
    punto_pedido DECIMAL(10,2) DEFAULT NULL,
    stock_seguridad DECIMAL(10,2) DEFAULT NULL,
    lote_optimo DECIMAL(10,2) DEFAULT NULL,
    inventario_maximo DECIMAL(10,2) DEFAULT NULL,
    cgi DECIMAL(10,2) DEFAULT NULL,
    
    -- Campos adicionales para cálculos
    desviacion_estandar DECIMAL(5,2) DEFAULT NULL,
    nivel_servicio DECIMAL(3,2) DEFAULT 0.95,
    intervalo_revision INT DEFAULT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_codigo (codigo),
    INDEX idx_nombre (nombre),
    INDEX idx_modelo (modelo_inventario)
) ENGINE=InnoDB;

-- =============================================================================
-- TABLA: articulo_proveedor
-- =============================================================================
CREATE TABLE IF NOT EXISTS articulo_proveedor (
    id INT AUTO_INCREMENT PRIMARY KEY,
    articulo_id INT NOT NULL,
    proveedor_id INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    demora_entrega INT DEFAULT 0,
    es_predeterminado BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (articulo_id) REFERENCES articulos(id) ON DELETE CASCADE,
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE CASCADE,
    UNIQUE KEY unique_articulo_proveedor (articulo_id, proveedor_id)
) ENGINE=InnoDB;

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
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =============================================================================
-- TABLA: ventas
-- =============================================================================
CREATE TABLE IF NOT EXISTS ventas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fecha_venta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    observaciones TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

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
    FOREIGN KEY (articulo_id) REFERENCES articulos(id) ON DELETE RESTRICT
) ENGINE=InnoDB;

-- =============================================================================
-- MENSAJE DE CONFIRMACIÓN
-- =============================================================================
SELECT 'Base de datos creada exitosamente' as mensaje;
SHOW TABLES; 