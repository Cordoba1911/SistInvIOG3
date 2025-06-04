import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Proveedor } from '../proveedores/proveedor.entity';
import { Articulo } from 'src/articulos/articulo.entity';

@Entity({ name: 'Articulo-Proveedor' })
export class ArticuloProveedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  demora_entrega: number;

  @Column({ default: true, type: 'decimal', precision: 10, scale: 2 })
  precio_unitario: number;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 })
  cargos_pedido: number;

  @Column()
  proveedor_id: number;

  @ManyToOne(() => Proveedor, (proveedor) => proveedor.articulo_proveedor)
  proveedor: Proveedor;

  @ManyToOne(() => Articulo, (articulo) => articulo.articulo_proveedor)
  articulo: Articulo;
}
