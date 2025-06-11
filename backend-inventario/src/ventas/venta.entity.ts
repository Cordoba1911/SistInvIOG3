import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import { DetalleVenta } from './detalle-venta.entity';

@Entity({ name: 'ventas' })
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'datetime', default: () => 'CURRENT_TIMESTAMP' })
  fecha_venta: Date;

  @OneToMany(() => DetalleVenta, (detalle) => detalle.venta)
  detalle_venta: DetalleVenta[];
} 