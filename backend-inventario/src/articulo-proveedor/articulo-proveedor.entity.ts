import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Proveedor } from '../proveedores/proveedor.entity';
import { Articulo } from 'src/articulos/articulo.entity';

@Entity({ name: 'articulo_proveedor' })
export class ArticuloProveedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  demora_entrega: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  precio_unitario: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  cargos_pedido: number;

  @Column({ type: 'boolean', default: true })
  proveedor_predeterminado: boolean;

  @ManyToOne(() => Proveedor, (proveedor) => proveedor.articulo_proveedor)
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: Proveedor;

  @ManyToOne(() => Articulo, (articulo) => articulo.articulo_proveedor)
  @JoinColumn({ name: 'articulo_id' })
  articulo: Articulo;
}
