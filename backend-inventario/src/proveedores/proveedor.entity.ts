import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column({ nullable: true })
  estado: boolean;

  @Column({ nullable: true, type: 'datetime' })
  fecha_baja: Date;
}
