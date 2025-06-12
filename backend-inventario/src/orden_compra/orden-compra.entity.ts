import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import { Articulo } from 'src/articulos/articulo.entity';
import { Proveedor } from 'src/proveedores/proveedor.entity';
import { Venta } from 'src/ventas/venta.entity';

export enum EstadoOrdenCompra {
  PENDIENTE = 'pendiente',
  ENVIADA = 'enviada',
  FINALIZADA = 'finalizada',
  CANCELADA = 'cancelada',
}

@Entity({ name: 'ordenes_compra' })
export class OrdenCompra {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  articulo_id: number;

  @Column({ type: 'int' })
  proveedor_id: number;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({
    type: 'enum',
    enum: EstadoOrdenCompra,
    default: EstadoOrdenCompra.PENDIENTE,
  })
  estado: EstadoOrdenCompra;

  @CreateDateColumn()
  fecha_creacion: Date;

  @Column({ type: 'datetime', nullable: true })
  fecha_envio: Date;

  @Column({ type: 'datetime', nullable: true })
  fecha_finalizacion: Date;

  // Relaciones
  @ManyToOne(() => Articulo, (articulo) => articulo.ordenes_compra)
  @JoinColumn({ name: 'articulo_id' })
  articulo: Articulo;

  @ManyToOne(() => Proveedor, (proveedor) => proveedor.orden_compra)
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: Proveedor;
}
