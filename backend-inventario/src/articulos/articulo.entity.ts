import { Proveedor } from 'src/proveedores/proveedor.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

export enum ModeloInventario {
  lote_fijo = 'Lote Fijo',
  intervalo_fijo = 'Intervalo Fijo',
}

@Entity({ name: 'Articulos' })
export class Articulo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  codigo: number;

  @Column({ unique: true })
  descripcion: string;

  @Column('float', { nullable: true })
  demanda: number;

  @Column('float', { nullable: true })
  costo_almacenamiento: number;

  @Column('float', { nullable: true })
  costo_pedido: number;

  @Column('float', { nullable: true })
  costo_compra: number;

  @Column({
    type: 'enum',
    enum: ModeloInventario,
    nullable: true,
  })
  modelo_inventario: ModeloInventario;

  @Column('float', { nullable: true })
  lote_optimo: number;

  @Column('float', { nullable: true })
  punto_pedido: number;

  @Column('float', { nullable: true })
  stock_seguridad: number;

  @Column('float', { nullable: true })
  inventario_maximo: number;

  @Column('float', { nullable: true })
  cgi: number;

  @Column('float', { nullable: true })
  stock_actual: number;

  @Column({ nullable: true, default: true })
  estado: boolean;

  @Column({ type: 'datetime', nullable: true })
  fecha_baja: Date;

  @Column({ nullable: true })
  proveedor_predeterminado_id: number;

  // Relación con proveedor predeterminado
  @ManyToOne(() => Proveedor, { nullable: true })
  @JoinColumn({ name: 'proveedor_predeterminado_id' })
  proveedor_predeterminado: Proveedor;
}
