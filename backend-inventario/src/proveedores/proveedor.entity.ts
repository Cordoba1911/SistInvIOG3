import { ArticuloProveedor } from 'src/articulo-proveedor/articulo-proveedor.entity';
import { OrdenCompra } from 'src/orden_compra/orden-compra.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'proveedores' })
export class Proveedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telefono: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  email: string;

  @Column({ type: 'boolean', default: true })
  estado: boolean;

  @Column({ type: 'datetime', nullable: true })
  fecha_baja: Date | null;

  @OneToMany(
    () => ArticuloProveedor,
    (articuloProveedor) => articuloProveedor.proveedor,
  )
  articulo_proveedor: ArticuloProveedor[]; // Relación con ArticuloProveedor

  @OneToMany(() => OrdenCompra, (ordenCompra) => ordenCompra.proveedor)
  orden_compra: OrdenCompra[]; // Relación con OrdenCompra
}
