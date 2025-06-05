import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { OrdenCompra } from './orden-compra.entity';
import { CreateOrdenCompraDto } from './dto/create-orden-compra.dto';
import { UpdateOrdenCompraDto } from './dto/update-orden-compra.dto';
import { Articulo } from 'src/articulos/articulo.entity';
import { Proveedor } from 'src/proveedores/proveedor.entity';

@Injectable()
export class OrdenCompraService {
  constructor(
    @InjectRepository(OrdenCompra)
    private ordenCompraRepository: Repository<OrdenCompra>,

    @InjectRepository(Articulo)
    private readonly articuloRepository: Repository<Articulo>,

    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
  ) {}

  // Crear una nueva orden de compra
  // Cambiar los errores por HttpException
  //chequeo que los id de los artículos y proveedores del dto existan
  async createOrdenCompra(dto: CreateOrdenCompraDto): Promise<OrdenCompra> {
    const articulo = await this.articuloRepository.findOneBy({
      id: dto.articulo_id,
    });
    if (!articulo) throw new Error('Artículo no encontrado');

    const proveedor = await this.proveedorRepository.findOneBy({
      id: dto.proveedor_id,
    });
    if (!proveedor) throw new Error('Proveedor no encontrado');

    const ordenCompra = this.ordenCompraRepository.create({
      articulo,
      proveedor,
      cantidad: dto.cantidad,
      estado: 'pendiente', // Estado inicial
      fecha_creacion: new Date(),
    });

    return this.ordenCompraRepository.save(ordenCompra);
  }
  // async createOrdenCompra(dto: CreateOrdenCompraDto) {
  //   const nuevaOrden = this.ordenCompraRepository.create({
  //     cantidad: dto.cantidad,
  //     estado: 'pendiente',
  //     fecha_creacion: new Date(),
  //   });

  //   return await this.ordenCompraRepository.save(nuevaOrden);
  // }

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

  // Verificar si un artículo tiene órdenes de compra activas (pendientes o enviadas)
  async tieneOrdenesActivas(articuloId: number): Promise<boolean> {
    const ordenesActivas = await this.ordenCompraRepository.find({
      where: {
        articulo_id: articuloId,
        estado: In(['pendiente', 'enviada'])
      }
    });

    return ordenesActivas.length > 0;
  }

  // Obtener órdenes activas de un artículo para información detallada
  async getOrdenesActivasPorArticulo(articuloId: number): Promise<OrdenCompra[]> {
    return await this.ordenCompraRepository.find({
      where: {
        articulo_id: articuloId,
        estado: In(['pendiente', 'enviada'])
      },
      order: {
        fecha_creacion: 'DESC'
      }
    });
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
