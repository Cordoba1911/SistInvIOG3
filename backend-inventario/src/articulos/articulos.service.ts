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
import { CalculoCgiDto, ResultadoCgiDto } from './dto/calculo-cgi.dto';
import { ProductoFaltanteDto } from './dto/productos-faltantes.dto';
import { AjusteInventarioDto, ResultadoAjusteDto } from './dto/ajuste-inventario.dto';
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

  async reactivarArticulo(
    id: number,
  ): Promise<{ message: string; articulo: ArticuloResponseDto }> {
    const articuloFound = await this.articuloRepository.findOne({
      where: { id },
    });

    if (!articuloFound) {
      throw new HttpException('Artículo no encontrado', HttpStatus.NOT_FOUND);
    }

    if (articuloFound.estado) {
      throw new HttpException(
        'El artículo ya está activo',
        HttpStatus.BAD_REQUEST,
      );
    }

    articuloFound.estado = true;
    articuloFound.fecha_baja = null; // Opcional: limpiar la fecha de baja

    const articuloReactivado =
      await this.articuloRepository.save(articuloFound);

    return {
      message: 'Artículo reactivado exitosamente',
      articulo: this.toArticuloResponseDto(articuloReactivado),
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

  /**
   * Calcular el CGI (Costo de Gestión del Inventario) para un artículo
   * 
   * El CGI representa el costo total anual de gestionar el inventario de un artículo,
   * incluyendo costos de pedido, almacenamiento y compra.
   * 
   * Fórmulas utilizadas:
   * - Lote Óptimo (EOQ): √(2 × D × S / H) si no se proporciona
   * - Número de Pedidos Anuales: D / Q
   * - Costo de Pedidos Anuales: (D / Q) × S
   * - Stock Promedio: Q / 2
   * - Costo de Almacenamiento Anual: (Q / 2) × H
   * - Costo de Compra Anual: D × C
   * - Costo Total Anual: Costo Pedidos + Costo Almacenamiento + Costo Compra
   * - CGI: Costo Total Anual / Costo Compra Anual
   */
  async calcularCgi(datos: CalculoCgiDto): Promise<ResultadoCgiDto> {
    const { demanda_anual, costo_compra, costo_almacenamiento, costo_pedido } = datos;
    
    // Si no se proporciona el lote óptimo, calcularlo usando EOQ
    let lote_optimo = datos.lote_optimo;
    if (!lote_optimo) {
      lote_optimo = Math.sqrt((2 * demanda_anual * costo_pedido) / costo_almacenamiento);
    }

    // Si no se proporciona stock promedio, calcularlo como Q/2
    let stock_promedio = datos.stock_promedio;
    if (!stock_promedio) {
      stock_promedio = lote_optimo / 2;
    }

    // Cálculos del CGI
    const numero_pedidos_anuales = demanda_anual / lote_optimo;
    const costo_pedidos_anuales = numero_pedidos_anuales * costo_pedido;
    const costo_almacenamiento_anual = stock_promedio * costo_almacenamiento;
    const costo_compra_anual = demanda_anual * costo_compra;
    const costo_total_anual = costo_pedidos_anuales + costo_almacenamiento_anual + costo_compra_anual;
    
    // CGI como ratio del costo total sobre el costo de compra
    const cgi = costo_total_anual / costo_compra_anual;
    
    // Frecuencia de pedidos en días (asumiendo 365 días por año)
    const frecuencia_pedidos_dias = 365 / numero_pedidos_anuales;

    return {
      costo_total_anual: Math.round(costo_total_anual * 100) / 100,
      costo_pedidos_anuales: Math.round(costo_pedidos_anuales * 100) / 100,
      costo_almacenamiento_anual: Math.round(costo_almacenamiento_anual * 100) / 100,
      costo_compra_anual: Math.round(costo_compra_anual * 100) / 100,
      cgi: Math.round(cgi * 1000) / 1000, // 3 decimales para mayor precisión
      stock_promedio: Math.round(stock_promedio * 100) / 100,
      numero_pedidos_anuales: Math.round(numero_pedidos_anuales * 100) / 100,
      frecuencia_pedidos_dias: Math.round(frecuencia_pedidos_dias * 10) / 10,
    };
  }

  /**
   * Calcular y actualizar el CGI de un artículo específico
   */
  async calcularYActualizarCgi(articuloId: number): Promise<ArticuloResponseDto> {
    const articulo = await this.articuloRepository.findOne({
      where: { id: articuloId, estado: true },
      relations: ['articulo_proveedor', 'articulo_proveedor.proveedor'],
    });

    if (!articulo) {
      throw new HttpException('Artículo no encontrado', HttpStatus.NOT_FOUND);
    }

    // Validar que el artículo tiene los datos necesarios para calcular CGI
    if (!articulo.demanda || !articulo.costo_compra || !articulo.costo_almacenamiento || !articulo.costo_pedido) {
      throw new HttpException(
        'El artículo debe tener demanda, costo_compra, costo_almacenamiento y costo_pedido para calcular el CGI',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Calcular CGI
    const resultadoCgi = await this.calcularCgi({
      demanda_anual: articulo.demanda,
      costo_compra: articulo.costo_compra,
      costo_almacenamiento: articulo.costo_almacenamiento,
      costo_pedido: articulo.costo_pedido,
      lote_optimo: articulo.lote_optimo || undefined,
    });

    // Actualizar el CGI en el artículo
    articulo.cgi = resultadoCgi.cgi;
    
    const articuloActualizado = await this.articuloRepository.save(articulo);
    return this.toArticuloResponseDto(articuloActualizado);
  }

  /**
   * Obtener listado de productos faltantes
   * Productos que tienen stock actual menor al stock de seguridad definido
   */
  async getProductosFaltantes(): Promise<ProductoFaltanteDto[]> {
    const articulos = await this.articuloRepository
      .createQueryBuilder('articulo')
      .leftJoinAndSelect('articulo.articulo_proveedor', 'ap')
      .leftJoinAndSelect('ap.proveedor', 'proveedor')
      .where('articulo.estado = :estado', { estado: true })
      .andWhere('articulo.stock_seguridad IS NOT NULL')
      .andWhere('articulo.stock_actual < articulo.stock_seguridad')
      .getMany();

    return articulos.map(articulo => {
      // Buscar el proveedor predeterminado
      const proveedorPredeterminado = articulo.articulo_proveedor?.find(
        ap => ap.proveedor_predeterminado === true
      );

      return {
        id: articulo.id,
        codigo: articulo.codigo,
        nombre: articulo.nombre,
        descripcion: articulo.descripcion,
        stock_actual: articulo.stock_actual,
        stock_seguridad: articulo.stock_seguridad,
        diferencia: articulo.stock_seguridad - articulo.stock_actual,
        punto_pedido: articulo.punto_pedido,
        proveedor_predeterminado: proveedorPredeterminado ? {
          id: proveedorPredeterminado.proveedor.id,
          nombre: proveedorPredeterminado.proveedor.nombre,
          telefono: proveedorPredeterminado.proveedor.telefono,
        } : undefined,
      };
    });
  }

  /**
   * Obtener todos los proveedores asociados a un artículo específico
   */
  async getProveedoresPorArticulo(articuloId: number): Promise<ProveedorArticuloResponseDto[]> {
    const articulo = await this.articuloRepository.findOne({
      where: { id: articuloId, estado: true },
      relations: ['articulo_proveedor', 'articulo_proveedor.proveedor'],
    });

    if (!articulo) {
      throw new HttpException('Artículo no encontrado', HttpStatus.NOT_FOUND);
    }

         return articulo.articulo_proveedor
       .filter(ap => ap.proveedor.estado === true) // Solo proveedores activos
       .map(ap => ({
         proveedor_id: ap.proveedor.id,
         nombre: ap.proveedor.nombre,
         telefono: ap.proveedor.telefono,
         email: ap.proveedor.email,
         precio_unitario: ap.precio_unitario,
         demora_entrega: ap.demora_entrega,
         cargos_pedido: ap.cargos_pedido,
         proveedor_predeterminado: ap.proveedor_predeterminado,
       }));
  }

  /**
   * Ajustar inventario de un artículo
   * Esta función ajusta la cantidad sin generar otras acciones como órdenes de compra
   */
  async ajustarInventario(
    articuloId: number, 
    ajuste: AjusteInventarioDto
  ): Promise<ResultadoAjusteDto> {
    const articulo = await this.articuloRepository.findOne({
      where: { id: articuloId, estado: true },
    });

    if (!articulo) {
      throw new HttpException('Artículo no encontrado', HttpStatus.NOT_FOUND);
    }

    // Validar que la nueva cantidad no sea negativa
    if (ajuste.nueva_cantidad < 0) {
      throw new HttpException(
        'La nueva cantidad no puede ser negativa',
        HttpStatus.BAD_REQUEST,
      );
    }

    const stockAnterior = articulo.stock_actual;
    const diferencia = ajuste.nueva_cantidad - stockAnterior;

    // Actualizar el stock
    articulo.stock_actual = ajuste.nueva_cantidad;
    await this.articuloRepository.save(articulo);

    return {
      articulo_id: articulo.id,
      codigo: articulo.codigo,
      nombre: articulo.nombre,
      stock_anterior: stockAnterior,
      stock_nuevo: ajuste.nueva_cantidad,
      diferencia: diferencia,
      motivo: ajuste.motivo,
      fecha_ajuste: new Date(),
    };
  }
}
