import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'ordenes_compra' })
export class OrdenCompra {
  @PrimaryGeneratedColumn()
  id: number;

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
}
