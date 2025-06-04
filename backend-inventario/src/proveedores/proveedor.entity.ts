import { ArticuloProveedor } from 'src/articulo-proveedor/articulo-proveedor.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity({ name: 'Proveedores' })
export class Proveedor {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  nombre: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: true })
  estado: boolean;

  @Column({ nullable: true, type: 'datetime' })
  fecha_baja: Date;

  @OneToMany(
    () => ArticuloProveedor,
    (articuloProveedor) => articuloProveedor.proveedor,
  )
  articulo_proveedor: ArticuloProveedor[]; // Relación con ArticuloProveedor
}
