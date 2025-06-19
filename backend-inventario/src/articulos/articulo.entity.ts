import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ArticuloProveedor } from 'src/articulo-proveedor/articulo-proveedor.entity';
import { OrdenCompra } from 'src/orden_compra/orden-compra.entity';
import { DetalleVenta } from 'src/ventas/detalle-venta.entity';

export enum ModeloInventario {
  lote_fijo = 'lote_fijo',
  periodo_fijo = 'periodo_fijo',
}

@Entity({ name: 'articulos' })
export class Articulo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, unique: true })
  codigo: string;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 255 })
  descripcion: string;

  @Column({ type: 'int', default: 0 })
  demanda: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  costo_almacenamiento: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  costo_pedido: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  costo_compra: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio_venta: number;

  @Column({
    type: 'enum',
    enum: ModeloInventario,
    default: ModeloInventario.lote_fijo,
  })
  modelo_inventario: ModeloInventario;

  @Column({ type: 'int', nullable: true })
  lote_optimo: number;

  @Column({ type: 'int', nullable: true })
  punto_pedido: number;

  @Column({ type: 'int', nullable: true })
  stock_seguridad: number;

  @Column({ type: 'int', nullable: true })
  inventario_maximo: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cgi: number;

  @Column({ type: 'int', default: 0 })
  stock_actual: number;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @Column({ type: 'datetime', nullable: true })
  fecha_baja: Date;

  @OneToMany(
    () => ArticuloProveedor,
    (articuloProveedor) => articuloProveedor.articulo,
  )
  articulo_proveedor: ArticuloProveedor[];

  @OneToMany(() => OrdenCompra, (ordenCompra) => ordenCompra.articulo)
  ordenes_compra: OrdenCompra[];

  @OneToMany(() => DetalleVenta, (detalleVenta) => detalleVenta.articulo)
  detalle_venta: DetalleVenta[];
}
