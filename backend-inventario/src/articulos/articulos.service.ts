/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Articulo, ModeloInventario } from './articulo.entity';
import { Repository } from 'typeorm';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';
import { ArticuloResponseDto, ProveedorArticuloResponseDto } from './dto/articulo-response.dto';
import { CalculoLoteFijoDto, ResultadoLoteFijoDto } from './dto/calculo-lote-fijo.dto';
import { CalculoIntervaloFijoDto, ResultadoIntervaloFijoDto } from './dto/calculo-intervalo-fijo.dto';
import { CalculoCgiDto, ResultadoCgiDto } from './dto/calculo-cgi.dto';
import { ProductoFaltanteDto, ProductoAReponerDto } from './dto/productos-faltantes.dto';
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
      relations: ['articulo_proveedor', 'articulo_proveedor.proveedor'],
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

    // Separar los datos de proveedores del resto de los datos del artículo
    const { proveedores: proveedoresData, ...articuloData } = articulo;

    // Actualizar los campos del artículo
    const updateArticulo = Object.assign(articuloFound, articuloData);
    const articuloActualizado = await this.articuloRepository.save(updateArticulo);

    // Si se proporcionaron proveedores, actualizar las relaciones
    if (proveedoresData && proveedoresData.length > 0) {
      // Validar que todos los proveedores existen y están activos
      const proveedorIds = proveedoresData.map(p => p.proveedor_id);
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
      const predeterminados = proveedoresData.filter(p => p.proveedor_predeterminado === true);
      if (predeterminados.length > 1) {
        throw new HttpException(
          'Solo puede haber un proveedor predeterminado por artículo',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Si no se especifica ningún predeterminado, el primero será el predeterminado
      const tieneExplicitoPredeterminado = predeterminados.length === 1;

      // Eliminar todas las relaciones existentes
      await this.articuloProveedorRepository.delete({ articulo: { id } });

      // Crear las nuevas relaciones con todos los proveedores
      for (let i = 0; i < proveedoresData.length; i++) {
        const proveedorData = proveedoresData[i];
        const proveedor = proveedores.find(p => p.id === proveedorData.proveedor_id);
        
        const esPredeterminado = tieneExplicitoPredeterminado 
          ? proveedorData.proveedor_predeterminado === true
          : i === 0; // Si no hay explícito, el primero es predeterminado

        const articuloProveedor = this.articuloProveedorRepository.create({
          articulo: articuloActualizado,
          proveedor: proveedor,
          precio_unitario: proveedorData.precio_unitario,
          demora_entrega: proveedorData.demora_entrega || 0,
          cargos_pedido: proveedorData.cargos_pedido || 0,
          proveedor_predeterminado: esPredeterminado,
        });

        await this.articuloProveedorRepository.save(articuloProveedor);
      }
    }

    // Recargar el artículo con las relaciones actualizadas
    const articuloFinal = await this.articuloRepository.findOne({
      where: { id },
      relations: ['articulo_proveedor', 'articulo_proveedor.proveedor'],
    });

    if (!articuloFinal) {
      throw new HttpException('Error al recargar el artículo actualizado', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Recalcular automáticamente si cambió alguna variable del modelo lote fijo
    await this.recalcularModeloSiEsNecesario(articuloFinal);

    return this.toArticuloResponseDto(articuloFinal);
  }

  /**
   * Recalcular automáticamente el modelo de inventario si cambiaron variables relevantes
   */
  private async recalcularModeloSiEsNecesario(articulo: Articulo): Promise<void> {
    // Solo recalcular si el artículo tiene modelo lote fijo y las variables necesarias
    if (
      articulo.modelo_inventario === 'lote_fijo' &&
      articulo.demanda &&
      articulo.costo_almacenamiento &&
      articulo.costo_pedido
    ) {
      try {
        // Obtener datos del proveedor predeterminado
        const proveedorPredeterminado = articulo.articulo_proveedor?.find(
          ap => ap.proveedor_predeterminado === true
        );

        // Recalcular parámetros del modelo lote fijo
        const resultado = await this.calcularLoteFijo({
          demanda: articulo.demanda,
          costo_almacenamiento: articulo.costo_almacenamiento,
          costo_pedido: articulo.costo_pedido,
          costo_compra: articulo.costo_compra,
          demora_entrega: proveedorPredeterminado?.demora_entrega || 7,
          desviacion_estandar: articulo.desviacion_estandar,
          nivel_servicio: articulo.nivel_servicio,
        });

        // Actualizar solo si los valores calculados son diferentes
        const valoresActualizados: Partial<Articulo> = {};
        
        if (articulo.lote_optimo !== Math.round(resultado.lote_optimo)) {
          valoresActualizados.lote_optimo = Math.round(resultado.lote_optimo);
        }
        
        if (articulo.punto_pedido !== Math.round(resultado.punto_pedido)) {
          valoresActualizados.punto_pedido = Math.round(resultado.punto_pedido);
        }
        
        if (articulo.stock_seguridad !== Math.round(resultado.stock_seguridad)) {
          valoresActualizados.stock_seguridad = Math.round(resultado.stock_seguridad);
        }

        // Solo actualizar si hay cambios
        if (Object.keys(valoresActualizados).length > 0) {
          await this.articuloRepository.update(articulo.id, valoresActualizados);
          
          // Actualizar el objeto en memoria también
          Object.assign(articulo, valoresActualizados);
        }
      } catch (error) {
        // Log del error pero no fallar la operación principal
        console.warn(`Error al recalcular modelo lote fijo para artículo ${articulo.id}:`, error);
      }
    }
    
    // Recalcular si el artículo tiene modelo intervalo fijo y las variables necesarias
    else if (
      articulo.modelo_inventario === 'periodo_fijo' &&
      articulo.demanda &&
      articulo.intervalo_revision &&
      articulo.costo_almacenamiento
    ) {
      try {
        // Obtener datos del proveedor predeterminado
        const proveedorPredeterminado = articulo.articulo_proveedor?.find(
          ap => ap.proveedor_predeterminado === true
        );

        // Recalcular parámetros del modelo intervalo fijo
        const resultado = await this.calcularIntervaloFijo({
          demanda: articulo.demanda,
          intervalo_revision: articulo.intervalo_revision,
          demora_entrega: proveedorPredeterminado?.demora_entrega || 7,
          desviacion_estandar: articulo.desviacion_estandar,
          nivel_servicio: articulo.nivel_servicio,
          stock_actual: articulo.stock_actual,
          costo_almacenamiento: articulo.costo_almacenamiento,
          costo_compra: articulo.costo_compra,
        });

        // Actualizar solo si los valores calculados son diferentes
        const valoresActualizados: Partial<Articulo> = {};
        
        if (articulo.stock_seguridad !== Math.round(resultado.stock_seguridad)) {
          valoresActualizados.stock_seguridad = Math.round(resultado.stock_seguridad);
        }
        
        if (articulo.inventario_maximo !== Math.round(resultado.inventario_maximo)) {
          valoresActualizados.inventario_maximo = Math.round(resultado.inventario_maximo);
        }

        // Solo actualizar si hay cambios
        if (Object.keys(valoresActualizados).length > 0) {
          await this.articuloRepository.update(articulo.id, valoresActualizados);
          
          // Actualizar el objeto en memoria también
          Object.assign(articulo, valoresActualizados);
        }
      } catch (error) {
        // Log del error pero no fallar la operación principal
        console.warn(`Error al recalcular modelo intervalo fijo para artículo ${articulo.id}:`, error);
      }
    }
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
      desviacion_estandar: articulo.desviacion_estandar,
      nivel_servicio: articulo.nivel_servicio,
      intervalo_revision: articulo.intervalo_revision,
      estado: articulo.estado,
      fecha_baja: articulo.fecha_baja,
      proveedores: proveedores,
    };
  }

  /**
   * Calcular parámetros del modelo de inventario de Lote Fijo
   * 
   * Fórmulas implementadas:
   * - Lote Óptimo (EOQ): √(2 × D × S / H)
   * - Punto de Pedido: (D × L) + SS
   * - Stock de Seguridad: Z × σ × √L
   * - Costo Total Anual: (D/Q)×S + (Q/2)×H + D×C
   */
  async calcularLoteFijo(datos: CalculoLoteFijoDto): Promise<ResultadoLoteFijoDto> {
    const {
      demanda,
      costo_almacenamiento,
      costo_pedido,
      demora_entrega = 7, // días por defecto
      desviacion_estandar = demanda * 0.1, // 10% de la demanda si no se proporciona
      nivel_servicio = 0.95, // 95% por defecto
      costo_compra = 0
    } = datos;

    // 1. Calcular Lote Óptimo (EOQ): √(2 × D × S / H)
    const lote_optimo = Math.sqrt((2 * demanda * costo_pedido) / costo_almacenamiento);

    // 2. Calcular Stock de Seguridad: Z × σ × √L
    // Convertir nivel de servicio a Z-score (aproximación)
    let z_score: number;
    if (nivel_servicio >= 0.99) z_score = 2.33;
    else if (nivel_servicio >= 0.975) z_score = 1.96;
    else if (nivel_servicio >= 0.95) z_score = 1.645;
    else if (nivel_servicio >= 0.90) z_score = 1.28;
    else if (nivel_servicio >= 0.85) z_score = 1.04;
    else z_score = 0.84;

    // Convertir demora de entrega de días a fracción de año
    const demora_entrega_anual = demora_entrega / 365;
    
    // Desviación estándar durante el tiempo de entrega
    const desviacion_tiempo_entrega = desviacion_estandar * Math.sqrt(demora_entrega_anual);
    
    const stock_seguridad = z_score * desviacion_tiempo_entrega;

    // 3. Calcular Punto de Pedido: (D × L) + SS
    const demanda_durante_entrega = demanda * demora_entrega_anual;
    const punto_pedido = demanda_durante_entrega + stock_seguridad;

    // 4. Calcular costos
    const numero_pedidos_anuales = demanda / lote_optimo;
    const costo_pedidos_anuales = numero_pedidos_anuales * costo_pedido;
    const stock_promedio = lote_optimo / 2;
    const costo_almacenamiento_anual = stock_promedio * costo_almacenamiento;
    
    let costo_total_anual = costo_pedidos_anuales + costo_almacenamiento_anual;
    if (costo_compra > 0) {
      costo_total_anual += demanda * costo_compra;
    }

    // 5. Tiempo de reposición (en días)
    const tiempo_reposicion = lote_optimo / (demanda / 365);

    return {
      lote_optimo: Math.round(lote_optimo),
      punto_pedido: Math.round(punto_pedido),
      stock_seguridad: Math.round(stock_seguridad),
      costo_total_anual: Math.round(costo_total_anual * 100) / 100,
      tiempo_reposicion: Math.round(tiempo_reposicion * 10) / 10,
      numero_pedidos_anuales: Math.round(numero_pedidos_anuales * 100) / 100,
      costo_pedidos_anuales: Math.round(costo_pedidos_anuales * 100) / 100,
      costo_almacenamiento_anual: Math.round(costo_almacenamiento_anual * 100) / 100,
      stock_promedio: Math.round(stock_promedio),
    };
  }

  /**
   * Calcular parámetros del modelo de inventario de Intervalo Fijo
   * 
   * El modelo de Intervalo Fijo (Período Fijo) es un sistema de control de inventario
   * donde las revisiones se realizan en intervalos fijos de tiempo.
   * 
   * Fórmulas utilizadas:
   * - Stock de Seguridad: Z × σ × √(R + L)
   * - Inventario Máximo: D × (R + L) + SS
   * - Cantidad a Ordenar: IM - I_actual + D × R
   * - Demanda durante ciclo: D × R
   * - Demanda durante entrega: D × L
   * 
   * Donde:
   * - D = Demanda anual
   * - R = Intervalo de revisión (en días)
   * - L = Demora de entrega (en días)
   * - σ = Desviación estándar de la demanda
   * - Z = Factor de seguridad (basado en el nivel de servicio)
   * - SS = Stock de seguridad
   * - IM = Inventario máximo
   * - I_actual = Inventario actual
   */
  async calcularIntervaloFijo(datos: CalculoIntervaloFijoDto): Promise<ResultadoIntervaloFijoDto> {
    const {
      demanda,
      intervalo_revision,
      demora_entrega = 7, // días por defecto
      desviacion_estandar = demanda * 0.1, // 10% de la demanda si no se proporciona
      nivel_servicio = 0.95, // 95% por defecto
      stock_actual = 0,
      costo_almacenamiento = 0,
      costo_pedido = 0,
      costo_compra = 0
    } = datos;

    // Convertir demanda anual a demanda diaria
    const demanda_diaria = demanda / 365;

    // 1. Calcular Stock de Seguridad: Z × σ × √(R + L)
    // Convertir nivel de servicio a Z-score
    let z_score: number;
    if (nivel_servicio >= 0.99) z_score = 2.33;
    else if (nivel_servicio >= 0.975) z_score = 1.96;
    else if (nivel_servicio >= 0.95) z_score = 1.645;
    else if (nivel_servicio >= 0.90) z_score = 1.28;
    else if (nivel_servicio >= 0.85) z_score = 1.04;
    else z_score = 0.84;

    // Desviación estándar diaria
    const desviacion_diaria = desviacion_estandar / Math.sqrt(365);
    
    // Tiempo total del ciclo (revisión + entrega)
    const tiempo_ciclo_completo = intervalo_revision + demora_entrega;
    
    const stock_seguridad = z_score * desviacion_diaria * Math.sqrt(tiempo_ciclo_completo);

    // 2. Calcular Inventario Máximo: D × (R + L) + SS
    const demanda_durante_ciclo = demanda_diaria * tiempo_ciclo_completo;
    const inventario_maximo = demanda_durante_ciclo + stock_seguridad;

    // 3. Calcular Cantidad a Ordenar: IM - I_actual + D × R
    // Incluir la demanda durante el intervalo de revisión
    const demanda_durante_revision = demanda_diaria * intervalo_revision;
    const cantidad_ordenar = Math.max(0, inventario_maximo - stock_actual + demanda_durante_revision);

    // 4. Calcular métricas adicionales
    const demanda_durante_entrega = demanda_diaria * demora_entrega;
    
    // Stock promedio esperado durante el ciclo
    const stock_promedio_esperado = (inventario_maximo + stock_seguridad) / 2;
    
    // Nivel de inventario objetivo (punto donde se debe hacer el pedido)
    const nivel_inventario_objetivo = demanda_durante_entrega + stock_seguridad;

    // 5. Calcular costos del período y anuales
    let costo_almacenamiento_periodo = 0;
    
    if (costo_almacenamiento > 0) {
      // Costo de almacenamiento durante el intervalo de revisión
      costo_almacenamiento_periodo = stock_promedio_esperado * costo_almacenamiento * (intervalo_revision / 365);
    }
    
    // Calcular métricas anuales
    const numero_pedidos_anuales = 365 / intervalo_revision; // Pedidos por año
    const costo_pedidos_anuales = numero_pedidos_anuales * costo_pedido;
    const costo_almacenamiento_anual = stock_promedio_esperado * costo_almacenamiento;
    const costo_total_anual = costo_pedidos_anuales + costo_almacenamiento_anual + (cantidad_ordenar * costo_compra);

    return {
      stock_seguridad: Math.round(stock_seguridad),
      inventario_maximo: Math.round(inventario_maximo),
      cantidad_pedido: Math.round(cantidad_ordenar), // Cambiado nombre
      nivel_inventario_objetivo: Math.round(nivel_inventario_objetivo),
      costo_total_anual: Math.round(costo_total_anual * 100) / 100, // Cambiado nombre
      tiempo_ciclo: tiempo_ciclo_completo, // Cambiado nombre
      demanda_durante_revision: Math.round(demanda_durante_ciclo * 10) / 10, // Cambiado nombre
      demanda_durante_entrega: Math.round(demanda_durante_entrega * 10) / 10,
      costo_almacenamiento_anual: Math.round(costo_almacenamiento_anual * 100) / 100, // Cambiado nombre
      costo_pedidos_anuales: Math.round(costo_pedidos_anuales * 100) / 100, // Nuevo campo
      numero_pedidos_anuales: Math.round(numero_pedidos_anuales * 10) / 10, // Nuevo campo
    };
  }

  /**
   * Aplicar resultados de cálculo a un artículo específico
   */
  async aplicarCalculoAArticulo(articuloId: number, modelo: 'lote_fijo' | 'periodo_fijo'): Promise<ArticuloResponseDto> {
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
      // Obtener datos del proveedor predeterminado para cálculos más precisos
      const proveedorPredeterminado = articulo.articulo_proveedor?.find(
        ap => ap.proveedor_predeterminado === true
      );

      const resultado = await this.calcularLoteFijo({
        demanda: articulo.demanda,
        costo_almacenamiento: articulo.costo_almacenamiento,
        costo_pedido: articulo.costo_pedido,
        costo_compra: articulo.costo_compra,
        demora_entrega: proveedorPredeterminado?.demora_entrega || 7,
        // Se pueden agregar más parámetros según sea necesario
      });

      articulo.modelo_inventario = 'lote_fijo' as any;
      articulo.lote_optimo = Math.round(resultado.lote_optimo);
      articulo.punto_pedido = Math.round(resultado.punto_pedido);
      articulo.stock_seguridad = Math.round(resultado.stock_seguridad);
      
    } else if (modelo === 'periodo_fijo') {
      // Obtener datos del proveedor predeterminado para cálculos más precisos
      const proveedorPredeterminado = articulo.articulo_proveedor?.find(
        ap => ap.proveedor_predeterminado === true
      );

      const resultado = await this.calcularIntervaloFijo({
        demanda: articulo.demanda,
        intervalo_revision: articulo.intervalo_revision || 30, // Usar valor del artículo o 30 días por defecto
        demora_entrega: proveedorPredeterminado?.demora_entrega || 7,
        desviacion_estandar: articulo.desviacion_estandar,
        nivel_servicio: articulo.nivel_servicio,
        stock_actual: articulo.stock_actual,
        costo_almacenamiento: articulo.costo_almacenamiento,
        costo_compra: articulo.costo_compra,
      });

      articulo.modelo_inventario = ModeloInventario.periodo_fijo;
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
   * Obtener listado de productos a reponer
   * Productos que han alcanzado el punto de pedido (o están por debajo) 
   * y no tienen una orden de compra pendiente o enviada
   */
  async getProductosAReponer(): Promise<ProductoAReponerDto[]> {
    // Obtener todos los artículos activos que tienen punto de pedido definido
    // y cuyo stock actual es menor o igual al punto de pedido
    const articulos = await this.articuloRepository
      .createQueryBuilder('articulo')
      .leftJoinAndSelect('articulo.articulo_proveedor', 'ap')
      .leftJoinAndSelect('ap.proveedor', 'proveedor')
      .where('articulo.estado = :estado', { estado: true })
      .andWhere('articulo.punto_pedido IS NOT NULL')
      .andWhere('articulo.stock_actual <= articulo.punto_pedido')
      .getMany();

    // Filtrar artículos que NO tienen órdenes de compra activas
    const productosAReponer: ProductoAReponerDto[] = [];
    
    for (const articulo of articulos) {
      const tieneOrdenesActivas = await this.ordenCompraService.tieneOrdenesActivas(articulo.id);
      
      if (!tieneOrdenesActivas) {
        // Buscar el proveedor predeterminado
        const proveedorPredeterminado = articulo.articulo_proveedor?.find(
          ap => ap.proveedor_predeterminado === true
        );

        // Calcular cantidad sugerida
        let cantidadSugerida = articulo.lote_optimo;
        if (!cantidadSugerida) {
          // Si no hay lote óptimo, sugerir la diferencia hasta alcanzar el punto de pedido + un buffer
          const diferencia = articulo.punto_pedido - articulo.stock_actual;
          cantidadSugerida = diferencia + (articulo.stock_seguridad || Math.ceil(diferencia * 0.2));
        }

        productosAReponer.push({
          id: articulo.id,
          codigo: articulo.codigo,
          nombre: articulo.nombre,
          descripcion: articulo.descripcion,
          stock_actual: articulo.stock_actual,
          punto_pedido: articulo.punto_pedido,
          diferencia: articulo.punto_pedido - articulo.stock_actual,
          lote_optimo: articulo.lote_optimo,
          modelo_inventario: articulo.modelo_inventario || 'lote_fijo',
          cantidad_sugerida: cantidadSugerida,
          proveedor_predeterminado: proveedorPredeterminado ? {
            id: proveedorPredeterminado.proveedor.id,
            nombre: proveedorPredeterminado.proveedor.nombre,
            telefono: proveedorPredeterminado.proveedor.telefono,
          } : undefined,
        });
      }
    }

    return productosAReponer;
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
