/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Articulo } from './articulo.entity';
import { Repository } from 'typeorm';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';
import { ArticuloResponseDto, ProveedorArticuloResponseDto } from './dto/articulo-response.dto';
import { CalculoLoteFijoDto, ResultadoLoteFijoDto } from './dto/calculo-lote-fijo.dto';
import { CalculoIntervaloFijoDto, ResultadoIntervaloFijoDto } from './dto/calculo-intervalo-fijo.dto';
import { OrdenCompraService } from '../orden_compra/orden-compra.service';
import { ProveedorService } from '../proveedores/proveedor.service';
import { ArticuloProveedor } from '../articulo-proveedor/articulo-proveedor.entity';
import { Proveedor } from '../proveedores/proveedor.entity';

@Injectable()
export class ArticulosService {
  constructor(
    @InjectRepository(Articulo)
    private articuloRepository: Repository<Articulo>,
    @InjectRepository(ArticuloProveedor)
    private articuloProveedorRepository: Repository<ArticuloProveedor>,
    @InjectRepository(Proveedor)
    private proveedorRepository: Repository<Proveedor>,
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

    // Validar que el nombre no exista
    const articuloFoundByNombre = await this.articuloRepository.findOne({
      where: {
        nombre: articulo.nombre,
      },
    });

    if (articuloFoundByNombre) {
      throw new HttpException(
        'Ya existe un artículo con este nombre',
        HttpStatus.CONFLICT,
      );
    }

    // Validar que todos los proveedores existen y están activos
    const proveedorIds = articulo.proveedores.map(p => p.proveedor_id);
    const proveedoresUnicos = [...new Set(proveedorIds)];
    
    if (proveedorIds.length !== proveedoresUnicos.length) {
      throw new HttpException(
        'No se puede incluir el mismo proveedor más de una vez',
        HttpStatus.BAD_REQUEST,
      );
    }

    const proveedores = await this.proveedorRepository.find({
      where: proveedorIds.map(id => ({ id, estado: true })),
    });

    if (proveedores.length !== proveedorIds.length) {
      const encontrados = proveedores.map(p => p.id);
      const noEncontrados = proveedorIds.filter(id => !encontrados.includes(id));
      throw new HttpException(
        `Proveedores no encontrados o inactivos: ${noEncontrados.join(', ')}`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Validar que solo haya un proveedor predeterminado
    const predeterminados = articulo.proveedores.filter(p => p.proveedor_predeterminado === true);
    if (predeterminados.length > 1) {
      throw new HttpException(
        'Solo puede haber un proveedor predeterminado por artículo',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Si no se especifica ningún predeterminado, el primero será el predeterminado
    const tieneExplicitoPredeterminado = predeterminados.length === 1;
    
    // Crear el artículo (sin los campos del proveedor)
    const { proveedores: proveedoresData, ...articuloData } = articulo;
    
    const newArticulo = this.articuloRepository.create({
      ...articuloData,
      estado: true, // Por defecto, el artículo está activo
      stock_actual: articulo.stock_actual || 0, // Stock inicial en 0 si no se proporciona
    });

    const savedArticulo = await this.articuloRepository.save(newArticulo);

    // Crear las relaciones con todos los proveedores
    for (let i = 0; i < proveedoresData.length; i++) {
      const proveedorData = proveedoresData[i];
      const proveedor = proveedores.find(p => p.id === proveedorData.proveedor_id);
      
      const esPredeterminado = tieneExplicitoPredeterminado 
        ? proveedorData.proveedor_predeterminado === true
        : i === 0; // Si no hay explícito, el primero es predeterminado

      const articuloProveedor = this.articuloProveedorRepository.create({
        articulo: savedArticulo,
        proveedor: proveedor,
        precio_unitario: proveedorData.precio_unitario,
        demora_entrega: proveedorData.demora_entrega || 0,
        cargos_pedido: proveedorData.cargos_pedido || 0,
        proveedor_predeterminado: esPredeterminado,
      });

      await this.articuloProveedorRepository.save(articuloProveedor);
    }

    return this.toArticuloResponseDto(savedArticulo);
  }

  async getArticulos(): Promise<ArticuloResponseDto[]> {
    const articulos = await this.articuloRepository.find({
      where: {
        estado: true, // Solo artículos activos
      },
      relations: ['articulo_proveedor', 'articulo_proveedor.proveedor'],
    });

    return articulos.map((articulo) => this.toArticuloResponseDto(articulo));
  }

  async getArticulo(id: number): Promise<ArticuloResponseDto> {
    const articuloFound = await this.articuloRepository.findOne({
      where: {
        id,
        estado: true, // Solo artículos activos
      },
      relations: ['articulo_proveedor', 'articulo_proveedor.proveedor'],
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

  private toArticuloResponseDto(articulo: Articulo): ArticuloResponseDto {
    const proveedores: ProveedorArticuloResponseDto[] = articulo.articulo_proveedor?.map(ap => ({
      proveedor_id: ap.proveedor.id,
      nombre: ap.proveedor.nombre,
      telefono: ap.proveedor.telefono,
      email: ap.proveedor.email,
      precio_unitario: ap.precio_unitario,
      demora_entrega: ap.demora_entrega,
      cargos_pedido: ap.cargos_pedido,
      proveedor_predeterminado: ap.proveedor_predeterminado,
    })) || [];

    return {
      id: articulo.id,
      codigo: articulo.codigo,
      nombre: articulo.nombre,
      descripcion: articulo.descripcion,
      demanda: articulo.demanda,
      costo_almacenamiento: articulo.costo_almacenamiento,
      costo_pedido: articulo.costo_pedido,
      costo_compra: articulo.costo_compra,
      precio_venta: articulo.precio_venta,
      modelo_inventario: articulo.modelo_inventario,
      lote_optimo: articulo.lote_optimo,
      punto_pedido: articulo.punto_pedido,
      stock_seguridad: articulo.stock_seguridad,
      inventario_maximo: articulo.inventario_maximo,
      cgi: articulo.cgi,
      stock_actual: articulo.stock_actual,
      estado: articulo.estado,
      fecha_baja: articulo.fecha_baja,
      proveedores: proveedores,
    };
  }

  /**
   * Calcular parámetros del modelo de inventario de Lote Fijo
   */
  async calcularLoteFijo(datos: CalculoLoteFijoDto): Promise<ResultadoLoteFijoDto> {
    // TODO: Implementar fórmulas del modelo Lote Fijo
    // Fórmulas que debes implementar:
    // - Lote Óptimo (EOQ): √(2 × D × S / H)
    // - Punto de Pedido: D × L + SS
    // - Stock de Seguridad: Z × σ × √L
    // - Costo Total Anual: (D/Q)×S + (Q/2)×H + D×C
    
    const lote_optimo = 0; // TODO: Calcular EOQ
    const punto_pedido = 0; // TODO: Calcular punto de pedido
    const stock_seguridad = 0; // TODO: Calcular stock de seguridad
    const costo_total_anual = 0; // TODO: Calcular costo total
    const tiempo_reposicion = 0; // TODO: Calcular tiempo de reposición
    
    return {
      lote_optimo,
      punto_pedido,
      stock_seguridad,
      costo_total_anual,
      tiempo_reposicion,
    };
  }

  /**
   * Calcular parámetros del modelo de inventario de Intervalo Fijo
   */
  async calcularIntervaloFijo(datos: CalculoIntervaloFijoDto): Promise<ResultadoIntervaloFijoDto> {
    // TODO: Implementar fórmulas del modelo Intervalo Fijo
    // Fórmulas que debes implementar:
    // - Stock de Seguridad: Z × σ × √(R + L)
    // - Inventario Máximo: D × (R + L) + SS
    // - Cantidad a Ordenar: IM - I + D × R
    
    const stock_seguridad = 0; // TODO: Calcular stock de seguridad
    const inventario_maximo = 0; // TODO: Calcular inventario máximo
    const cantidad_ordenar = 0; // TODO: Calcular cantidad a ordenar
    const costo_total_periodo = 0; // TODO: Calcular costo total del período
    const nivel_inventario_objetivo = 0; // TODO: Calcular nivel objetivo
    
    return {
      stock_seguridad,
      inventario_maximo,
      cantidad_ordenar,
      costo_total_periodo,
      nivel_inventario_objetivo,
    };
  }

  /**
   * Aplicar resultados de cálculo a un artículo específico
   */
  async aplicarCalculoAArticulo(articuloId: number, modelo: 'lote_fijo' | 'intervalo_fijo'): Promise<ArticuloResponseDto> {
    const articulo = await this.articuloRepository.findOne({
      where: { id: articuloId, estado: true },
    });

    if (!articulo) {
      throw new HttpException('Artículo no encontrado', HttpStatus.NOT_FOUND);
    }

    if (!articulo.demanda || !articulo.costo_almacenamiento || !articulo.costo_pedido) {
      throw new HttpException(
        'El artículo debe tener demanda, costo_almacenamiento y costo_pedido para realizar cálculos',
        HttpStatus.BAD_REQUEST,
      );
    }

    if (modelo === 'lote_fijo') {
      const resultado = await this.calcularLoteFijo({
        demanda: articulo.demanda,
        costo_almacenamiento: articulo.costo_almacenamiento,
        costo_pedido: articulo.costo_pedido,
      });

      articulo.modelo_inventario = 'lote_fijo' as any;
      articulo.lote_optimo = Math.round(resultado.lote_optimo);
      articulo.punto_pedido = Math.round(resultado.punto_pedido);
      articulo.stock_seguridad = Math.round(resultado.stock_seguridad);
      
    } else if (modelo === 'intervalo_fijo') {
      const resultado = await this.calcularIntervaloFijo({
        demanda: articulo.demanda,
        intervalo_revision: 30, // TODO: Este valor podría venir como parámetro
      });

      articulo.modelo_inventario = 'periodo_fijo' as any;
      articulo.stock_seguridad = Math.round(resultado.stock_seguridad);
      articulo.inventario_maximo = Math.round(resultado.inventario_maximo);
    }

    const articuloActualizado = await this.articuloRepository.save(articulo);
    return this.toArticuloResponseDto(articuloActualizado);
  }
}
