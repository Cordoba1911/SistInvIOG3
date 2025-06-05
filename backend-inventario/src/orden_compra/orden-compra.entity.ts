import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Articulo } from 'src/articulos/articulo.entity';
import { Proveedor } from 'src/proveedores/proveedor.entity';

@Entity({ name: 'ordenes_compra' })
export class OrdenCompra {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  articulo_id: number;

  @Column()
  proveedor_id: number;

  @Column()
  cantidad: number;

  @Column({
    type: 'enum',
    enum: ['pendiente', 'enviada', 'cancelada', 'finalizada'],
  })
  estado: 'pendiente' | 'enviada' | 'cancelada' | 'finalizada';

  @Column({ type: 'datetime' })
  fecha_creacion: Date;

  @Column({ type: 'datetime', nullable: true })
  fecha_envio: Date;

  @Column({ type: 'datetime', nullable: true })
  fecha_finalizacion: Date;

  // Relaciones
  @ManyToOne(() => Articulo)
  @JoinColumn({ name: 'articulo_id' })
  articulo: Articulo;

  @ManyToOne(() => Proveedor)
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: Proveedor;
}
