import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { DetalleVenta } from './detalle-venta.entity';

@Entity({ name: 'ventas' })
export class Venta {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  fecha_venta: Date;

  @OneToMany(() => DetalleVenta, (detalleVenta) => detalleVenta.venta)
  detalle_venta: DetalleVenta[];
}
