import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Venta } from './venta.entity';
import { Articulo } from 'src/articulos/articulo.entity';

@Entity({ name: 'detalle_venta' })
export class DetalleVenta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  venta_id: number;

  @Column({ type: 'int' })
  articulo_id: number;

  @Column({ type: 'int' })
  cantidad: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  precio_unitario: number;

  @ManyToOne(() => Venta, (venta) => venta.detalle_venta)
  @JoinColumn({ name: 'venta_id' })
  venta: Venta;

  @ManyToOne(() => Articulo, (articulo) => articulo.detalle_venta)
  @JoinColumn({ name: 'articulo_id' })
  articulo: Articulo;
}
