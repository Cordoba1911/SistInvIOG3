import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
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
  venta: Venta;

  @ManyToOne(() => Articulo, (articulo) => articulo.detalle_venta)
  articulo: Articulo;
}
