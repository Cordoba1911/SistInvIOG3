import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdenCompra } from './orden-compra.entity';
import { CreateOrdenCompraDto } from './dto/create-orden-compra.dto';
import { UpdateOrdenCompraDto } from './dto/update-orden-compra.dto';

@Injectable()
export class OrdenCompraService {
  constructor(
    @InjectRepository(OrdenCompra)
    private ordenCompraRepository: Repository<OrdenCompra>,
  ) {}

  // Crear una nueva orden de compra
  async createOrdenCompra(dto: CreateOrdenCompraDto) {
    const nuevaOrden = this.ordenCompraRepository.create({
      cantidad: dto.cantidad,
      estado: 'pendiente',
      fecha_creacion: new Date(),
    });

    return await this.ordenCompraRepository.save(nuevaOrden);
  }

  // Obtener todas las órdenes de compra
  getOrdenesCompra() {
    return this.ordenCompraRepository.find();
  }

  // Obtener una orden por ID
  async getOrdenCompra(id: number) {
    const orden = await this.ordenCompraRepository.findOne({ where: { id } });

    if (!orden) {
      throw new HttpException(
        `Orden de compra con ID ${id} no encontrada`,
        HttpStatus.NOT_FOUND,
      );
    }

    return orden;
  }

  // Actualizar una orden por ID
  async updateOrdenCompra(id: number, dto: UpdateOrdenCompraDto) {
    const orden = await this.ordenCompraRepository.findOne({ where: { id } });

    if (!orden) {
      throw new HttpException(
        `Orden de compra con ID ${id} no encontrada`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Reglas de negocio:
    // Solo se puede modificar si está en estado 'pendiente'
    if (orden.estado !== 'pendiente') {
      throw new HttpException(
        `Solo se puede modificar una orden en estado pendiente`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Si se actualiza a 'enviada', registrar la fecha_envio
    if (dto.estado === 'enviada') {
      orden.fecha_envio = new Date();
    }

    // Si se actualiza a 'finalizada', registrar la fecha_finalizacion
    if (dto.estado === 'finalizada') {
      orden.fecha_finalizacion = new Date();
    }

    const ordenActualizada = Object.assign(orden, dto);
    return await this.ordenCompraRepository.save(ordenActualizada);
  }

  // Cancelar una orden de compra
  async cancelarOrdenCompra(id: number) {
    const orden = await this.ordenCompraRepository.findOne({ where: { id } });

    if (!orden) {
      throw new HttpException(
        `Orden de compra con ID ${id} no encontrada`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (orden.estado !== 'pendiente') {
      throw new HttpException(
        `Solo se puede cancelar una orden en estado pendiente`,
        HttpStatus.BAD_REQUEST,
      );
    }

    orden.estado = 'cancelada';
    return await this.ordenCompraRepository.save(orden);
  }

  // Marcar una orden como enviada
  async enviarOrdenCompra(id: number) {
    const orden = await this.ordenCompraRepository.findOne({ where: { id } });

    if (!orden) {
      throw new HttpException(
        `Orden de compra con ID ${id} no encontrada`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (orden.estado !== 'pendiente') {
      throw new HttpException(
        `Solo se puede enviar una orden en estado pendiente`,
        HttpStatus.BAD_REQUEST,
      );
    }

    orden.estado = 'enviada';
    orden.fecha_envio = new Date();
    return await this.ordenCompraRepository.save(orden);
  }

  // Finalizar una orden de compra
  async finalizarOrdenCompra(id: number) {
    const orden = await this.ordenCompraRepository.findOne({ where: { id } });

    if (!orden) {
      throw new HttpException(
        `Orden de compra con ID ${id} no encontrada`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (orden.estado !== 'enviada') {
      throw new HttpException(
        `Solo se puede finalizar una orden que esté en estado enviada`,
        HttpStatus.BAD_REQUEST,
      );
    }

    orden.estado = 'finalizada';
    orden.fecha_finalizacion = new Date();
    return await this.ordenCompraRepository.save(orden);
  }
}
