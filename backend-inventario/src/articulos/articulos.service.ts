/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Articulo } from './articulo.entity';
import { Repository } from 'typeorm';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';
import { ArticuloResponseDto } from './dto/articulo-response.dto';
import { OrdenCompraService } from '../orden_compra/orden-compra.service';
import { ProveedorService } from '../proveedores/proveedor.service';
import { ProveedorResponseDto } from '../proveedores/dto/proveedor-response.dto';

@Injectable()
export class ArticulosService {
  constructor(
    @InjectRepository(Articulo)
    private articuloRepository: Repository<Articulo>,
    private ordenCompraService: OrdenCompraService,
    private proveedorService: ProveedorService,
  ) {}

  async createArticulo(
    articulo: CreateArticuloDto,
  ): Promise<ArticuloResponseDto> {
    // Validar que el código no exista
    const articuloFoundByCodigo = await this.articuloRepository.findOne({
      where: {
        codigo: articulo.codigo,
      },
    });

    if (articuloFoundByCodigo) {
      throw new HttpException(
        'Ya existe un artículo con este código',
        HttpStatus.CONFLICT,
      );
    }

    // Validar que la descripción no exista
    const articuloFoundByDescripcion = await this.articuloRepository.findOne({
      where: {
        descripcion: articulo.descripcion,
      },
    });

    if (articuloFoundByDescripcion) {
      throw new HttpException(
        'Ya existe un artículo con esta descripción',
        HttpStatus.CONFLICT,
      );
    }

    const newArticulo = this.articuloRepository.create({
      ...articulo,
      estado: true, // Por defecto, el artículo está activo
      stock_actual: 0, // Stock inicial en 0
    });

    const savedArticulo = await this.articuloRepository.save(newArticulo);

    return this.toArticuloResponseDto(savedArticulo);
  }

  async getArticulos(): Promise<ArticuloResponseDto[]> {
    const articulos = await this.articuloRepository.find({
      where: {
        estado: true, // Solo artículos activos
      },
    });

    return articulos.map((articulo) => this.toArticuloResponseDto(articulo));
  }

  async getArticulo(id: number): Promise<ArticuloResponseDto> {
    const articuloFound = await this.articuloRepository.findOne({
      where: {
        id,
        estado: true, // Solo artículos activos
      },
    });

    if (!articuloFound) {
      throw new HttpException('Artículo no encontrado', HttpStatus.NOT_FOUND);
    }

    return this.toArticuloResponseDto(articuloFound);
  }

  async deleteArticulo(
    id: number,
  ): Promise<{ message: string; articulo: ArticuloResponseDto }> {
    const articuloFound = await this.articuloRepository.findOne({
      where: { id },
    });

    if (!articuloFound) {
      throw new HttpException('Artículo no encontrado', HttpStatus.NOT_FOUND);
    }

    if (!articuloFound.estado) {
      throw new HttpException(
        'El artículo ya está dado de baja',
        HttpStatus.BAD_REQUEST,
      );
    }

    // VALIDACIÓN 1: Verificar si tiene stock actual
    if (articuloFound.stock_actual > 0) {
      throw new HttpException(
        `No se puede dar de baja el artículo porque tiene ${articuloFound.stock_actual} unidades en stock. Debe reducir el stock a 0 antes de darlo de baja.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // VALIDACIÓN 2: Verificar si tiene órdenes de compra pendientes o enviadas
    const tieneOrdenesActivas =
      await this.ordenCompraService.tieneOrdenesActivas(id);

    if (tieneOrdenesActivas) {
      // Obtener las órdenes activas para mostrar información detallada
      const ordenesActivas =
        await this.ordenCompraService.getOrdenesActivasPorArticulo(id);
      const estadosOrdenes = ordenesActivas
        .map((orden) => `ID: ${orden.id} (${orden.estado})`)
        .join(', ');

      throw new HttpException(
        `No se puede dar de baja el artículo porque tiene órdenes de compra activas: ${estadosOrdenes}. Debe cancelar o finalizar todas las órdenes antes de dar de baja el artículo.`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Si pasa todas las validaciones, proceder con la baja (soft delete)
    articuloFound.estado = false;
    articuloFound.fecha_baja = new Date();

    const articuloDadoDeBaja =
      await this.articuloRepository.save(articuloFound);

    return {
      message: 'Artículo dado de baja exitosamente',
      articulo: this.toArticuloResponseDto(articuloDadoDeBaja),
    };
  }

  async updateArticulo(
    id: number,
    articulo: UpdateArticuloDto,
  ): Promise<ArticuloResponseDto> {
    const articuloFound = await this.articuloRepository.findOne({
      where: {
        id,
        estado: true,
      },
    });

    if (!articuloFound) {
      throw new HttpException('Artículo no encontrado', HttpStatus.NOT_FOUND);
    }

    // Validar código único si se está actualizando
    if (articulo.codigo && articulo.codigo !== articuloFound.codigo) {
      const existingArticulo = await this.articuloRepository.findOne({
        where: {
          codigo: articulo.codigo,
        },
      });

      if (existingArticulo) {
        throw new HttpException(
          'Ya existe un artículo con este código',
          HttpStatus.CONFLICT,
        );
      }
    }

    // Validar descripción única si se está actualizando
    if (
      articulo.descripcion &&
      articulo.descripcion !== articuloFound.descripcion
    ) {
      const existingArticulo = await this.articuloRepository.findOne({
        where: {
          descripcion: articulo.descripcion,
        },
      });

      if (existingArticulo) {
        throw new HttpException(
          'Ya existe un artículo con esta descripción',
          HttpStatus.CONFLICT,
        );
      }
    }

    const updateArticulo = Object.assign(articuloFound, articulo);
    const articuloActualizado =
      await this.articuloRepository.save(updateArticulo);

    return this.toArticuloResponseDto(articuloActualizado);
  }

  /**
   * Obtener todos los proveedores activos disponibles para selección
   */
  async getProveedoresDisponibles(): Promise<ProveedorResponseDto[]> {
    try {
      const proveedores = await this.proveedorService.getProveedores();
      return proveedores.map((proveedor) =>
        this.toProveedorResponseDto(proveedor),
      );
    } catch (error) {
      throw new HttpException(
        'Error al obtener proveedores',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * Convertir entidad Articulo a ArticuloResponseDto
   */
  private toArticuloResponseDto(articulo: Articulo): ArticuloResponseDto {
    return {
      id: articulo.id,
      codigo: articulo.codigo,
      nombre: articulo.nombre,
      descripcion: articulo.descripcion,
      demanda: articulo.demanda,
      costo_almacenamiento: articulo.costo_almacenamiento,
      costo_pedido: articulo.costo_pedido,
      costo_compra: articulo.costo_compra,
      modelo_inventario: articulo.modelo_inventario,
      lote_optimo: articulo.lote_optimo,
      punto_pedido: articulo.punto_pedido,
      stock_seguridad: articulo.stock_seguridad,
      inventario_maximo: articulo.inventario_maximo,
      cgi: articulo.cgi,
      stock_actual: articulo.stock_actual,
      estado: articulo.estado,
      fecha_baja: articulo.fecha_baja,
    };
  }

  /**
   * Convertir entidad Proveedor a ProveedorResponseDto
   */
  private toProveedorResponseDto(proveedor: any): ProveedorResponseDto {
    return {
      id: proveedor.id,
      nombre: proveedor.nombre,
      telefono: proveedor.telefono,
      email: proveedor.email,
      estado: proveedor.estado,
    };
  }
}
