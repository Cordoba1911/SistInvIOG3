import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Articulo } from './articulo.entity';
import { Repository } from 'typeorm';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';
import { OrdenCompraService } from '../orden_compra/orden-compra.service';

@Injectable()
export class ArticulosService {
  constructor(
    @InjectRepository(Articulo)
    private articuloRepository: Repository<Articulo>,
    private ordenCompraService: OrdenCompraService,
  ) { }

  async createArticulo(articulo: CreateArticuloDto) {
    // Validar que el código no exista
    const articuloFoundByCodigo = await this.articuloRepository.findOne({
      where: {
        codigo: articulo.codigo
      }
    });

    if (articuloFoundByCodigo) {
      throw new HttpException('Ya existe un artículo con este código', HttpStatus.CONFLICT);
    }

    // Validar que la descripción no exista
    const articuloFoundByDescripcion = await this.articuloRepository.findOne({
      where: {
        descripcion: articulo.descripcion
      }
    });

    if (articuloFoundByDescripcion) {
      throw new HttpException('Ya existe un artículo con esta descripción', HttpStatus.CONFLICT);
    }

    // Validar que los valores numéricos sean positivos
    this.validatePositiveNumbers(articulo);

    const newArticulo = this.articuloRepository.create({
      ...articulo,
      estado: true, // Por defecto, el artículo está activo
      stock_actual: 0 // Stock inicial en 0
    });
    
    return this.articuloRepository.save(newArticulo);
  }

  getArticulos() {
    return this.articuloRepository.find({
      where: {
        estado: true // Solo artículos activos
      }
    });
  }

  async getArticulo(id: number) {
    const articuloFound = await this.articuloRepository.findOne({
      where: {
        id,
        estado: true // Solo artículos activos
      }
    });

    if (!articuloFound) {
      throw new HttpException('Artículo no encontrado', HttpStatus.NOT_FOUND);
    }

    return articuloFound;
  }

  /**
   * Verificar si un artículo puede ser dado de baja
   * Devuelve información detallada sobre impedimentos
   */
  async verificarPosibilidadBaja(id: number): Promise<{
    puedeSerDadoDeBaja: boolean;
    impedimentos: string[];
    stockActual?: number;
    ordenesActivas?: number;
  }> {
    const articuloFound = await this.articuloRepository.findOne({
      where: { id }
    });

    if (!articuloFound) {
      throw new HttpException('Artículo no encontrado', HttpStatus.NOT_FOUND);
    }

    if (!articuloFound.estado) {
      throw new HttpException('El artículo ya está dado de baja', HttpStatus.BAD_REQUEST);
    }

    const impedimentos: string[] = [];
    let puedeSerDadoDeBaja = true;

    // Verificar stock
    if (articuloFound.stock_actual > 0) {
      impedimentos.push(`El artículo tiene ${articuloFound.stock_actual} unidades en stock`);
      puedeSerDadoDeBaja = false;
    }

    // Verificar órdenes de compra activas
    const tieneOrdenesActivas = await this.ordenCompraService.tieneOrdenesActivas(id);
    let cantidadOrdenesActivas = 0;
    
    if (tieneOrdenesActivas) {
      const ordenesActivas = await this.ordenCompraService.getOrdenesActivasPorArticulo(id);
      cantidadOrdenesActivas = ordenesActivas.length;
      const estadosOrdenes = ordenesActivas.map(orden => `ID: ${orden.id} (${orden.estado})`).join(', ');
      impedimentos.push(`El artículo tiene ${cantidadOrdenesActivas} órdenes de compra activas: ${estadosOrdenes}`);
      puedeSerDadoDeBaja = false;
    }

    return {
      puedeSerDadoDeBaja,
      impedimentos,
      stockActual: articuloFound.stock_actual,
      ordenesActivas: cantidadOrdenesActivas
    };
  }

  async deleteArticulo(id: number) {
    const articuloFound = await this.articuloRepository.findOne({
      where: { id }
    });

    if (!articuloFound) {
      throw new HttpException('Artículo no encontrado', HttpStatus.NOT_FOUND);
    }

    if (!articuloFound.estado) {
      throw new HttpException('El artículo ya está dado de baja', HttpStatus.BAD_REQUEST);
    }

    // VALIDACIÓN 1: Verificar si tiene stock actual
    if (articuloFound.stock_actual > 0) {
      throw new HttpException(
        `No se puede dar de baja el artículo porque tiene ${articuloFound.stock_actual} unidades en stock. Debe reducir el stock a 0 antes de darlo de baja.`,
        HttpStatus.BAD_REQUEST
      );
    }

    // VALIDACIÓN 2: Verificar si tiene órdenes de compra pendientes o enviadas
    const tieneOrdenesActivas = await this.ordenCompraService.tieneOrdenesActivas(id);
    
    if (tieneOrdenesActivas) {
      // Obtener las órdenes activas para mostrar información detallada
      const ordenesActivas = await this.ordenCompraService.getOrdenesActivasPorArticulo(id);
      const estadosOrdenes = ordenesActivas.map(orden => `ID: ${orden.id} (${orden.estado})`).join(', ');
      
      throw new HttpException(
        `No se puede dar de baja el artículo porque tiene órdenes de compra activas: ${estadosOrdenes}. Debe cancelar o finalizar todas las órdenes antes de dar de baja el artículo.`,
        HttpStatus.BAD_REQUEST
      );
    }

    // Si pasa todas las validaciones, proceder con la baja (soft delete)
    articuloFound.estado = false;
    articuloFound.fecha_baja = new Date();
    
    const articuloDadoDeBaja = await this.articuloRepository.save(articuloFound);

    return {
      message: 'Artículo dado de baja exitosamente',
      articulo: articuloDadoDeBaja
    };
  }

  async updateArticulo(id: number, articulo: UpdateArticuloDto) {
    const articuloFound = await this.articuloRepository.findOne({
      where: {
        id,
        estado: true
      }
    });

    if (!articuloFound) {
      throw new HttpException('Artículo no encontrado', HttpStatus.NOT_FOUND);
    }

    // Validar código único si se está actualizando
    if (articulo.codigo && articulo.codigo !== articuloFound.codigo) {
      const existingArticulo = await this.articuloRepository.findOne({
        where: {
          codigo: articulo.codigo
        }
      });

      if (existingArticulo) {
        throw new HttpException('Ya existe un artículo con este código', HttpStatus.CONFLICT);
      }
    }

    // Validar descripción única si se está actualizando
    if (articulo.descripcion && articulo.descripcion !== articuloFound.descripcion) {
      const existingArticulo = await this.articuloRepository.findOne({
        where: {
          descripcion: articulo.descripcion
        }
      });

      if (existingArticulo) {
        throw new HttpException('Ya existe un artículo con esta descripción', HttpStatus.CONFLICT);
      }
    }

    // Validar valores numéricos positivos
    this.validatePositiveNumbers(articulo);

    const updateArticulo = Object.assign(articuloFound, articulo);
    return this.articuloRepository.save(updateArticulo);
  }

  private validatePositiveNumbers(articulo: Partial<CreateArticuloDto | UpdateArticuloDto>) {
    const numericFields = ['demanda', 'costo_almacenamiento', 'costo_pedido', 'costo_compra'];
    
    for (const field of numericFields) {
      if (articulo[field] !== undefined && articulo[field] <= 0) {
        throw new HttpException(`El campo ${field} debe ser mayor a 0`, HttpStatus.BAD_REQUEST);
      }
    }
  }
}
