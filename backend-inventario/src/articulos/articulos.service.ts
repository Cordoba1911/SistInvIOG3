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

  /**
   * Calcular automáticamente las fórmulas de inventario según el modelo seleccionado
   * @param articulo - El artículo con los datos necesarios para el cálculo
   * @returns El artículo actualizado con los cálculos aplicados y un flag indicando si se aplicaron cambios
   */
  private async calcularFormulasInventario(articulo: Articulo): Promise<{ articulo: Articulo; calculosAplicados: boolean }> {
    console.log('🔍 Iniciando cálculo automático para artículo:', articulo.id);
    console.log('📊 Datos del artículo:', {
      demanda: articulo.demanda,
      costo_almacenamiento: articulo.costo_almacenamiento,
      costo_pedido: articulo.costo_pedido,
      costo_compra: articulo.costo_compra,
      modelo_inventario: articulo.modelo_inventario,
      nivel_servicio: articulo.nivel_servicio,
      desviacion_estandar: articulo.desviacion_estandar,
      intervalo_revision: articulo.intervalo_revision
    });

    // Verificar que tenga los datos mínimos necesarios para calcular
    if (!articulo.demanda || !articulo.costo_almacenamiento || !articulo.costo_pedido || !articulo.costo_compra) {
      console.log('⚠️ Faltan datos necesarios para el cálculo');
      return { articulo, calculosAplicados: false };
    }

    // Verificar que tenga un modelo de inventario definido
    if (!articulo.modelo_inventario) {
      console.log('⚠️ No hay modelo de inventario definido');
      return { articulo, calculosAplicados: false };
    }

    // Obtener demora_entrega del proveedor predeterminado
    const proveedorPredeterminado = articulo.articulo_proveedor?.find(ap => ap.proveedor_predeterminado);
    const demora_entrega = proveedorPredeterminado?.demora_entrega;
    console.log('🚚 Demora de entrega del proveedor predeterminado:', demora_entrega);

    let calculosAplicados = false;

    try {
      if (articulo.modelo_inventario === ModeloInventario.lote_fijo) {
        console.log('📦 Aplicando modelo de Lote Fijo');
        
        const resultado = await this.calcularLoteFijo({
          demanda: articulo.demanda,
          costo_almacenamiento: articulo.costo_almacenamiento,
          costo_pedido: articulo.costo_pedido,
          costo_compra: articulo.costo_compra,
          demora_entrega: demora_entrega,
          nivel_servicio: articulo.nivel_servicio,
          desviacion_estandar: articulo.desviacion_estandar,
        });

        console.log('📊 Resultados Lote Fijo:', resultado);

        articulo.lote_optimo = Math.round(resultado.lote_optimo);
        articulo.punto_pedido = Math.round(resultado.punto_pedido);
        articulo.stock_seguridad = Math.round(resultado.stock_seguridad);
        articulo.intervalo_revision = resultado.intervalo_revision;

        // Calcular CGI automáticamente para lote fijo
        const resultadoCgi = await this.calcularCgi({
          demanda_anual: articulo.demanda,
          costo_compra: articulo.costo_compra,
          costo_almacenamiento: articulo.costo_almacenamiento,
          costo_pedido: articulo.costo_pedido,
          modelo_inventario: ModeloInventario.lote_fijo,
          lote_optimo: articulo.lote_optimo,
        });
        articulo.cgi = resultadoCgi.cgi;

        console.log('💰 CGI calculado (Lote Fijo):', resultadoCgi.cgi);
        calculosAplicados = true;

      } else if (articulo.modelo_inventario === ModeloInventario.periodo_fijo) {
        console.log('🔄 Aplicando modelo de Período Fijo');
        
        // Para período fijo, necesitamos intervalo_revision
        if (!articulo.intervalo_revision) {
          console.log('⚠️ Falta intervalo_revision para período fijo');
          return { articulo, calculosAplicados: false };
        }

        const resultado = await this.calcularIntervaloFijo({
          demanda: articulo.demanda,
          intervalo_revision: articulo.intervalo_revision,
          demora_entrega: demora_entrega,
          nivel_servicio: articulo.nivel_servicio,
          desviacion_estandar: articulo.desviacion_estandar,
        });

        console.log('📊 Resultados Período Fijo:', resultado);

        articulo.stock_seguridad = Math.round(resultado.stock_seguridad);
        articulo.inventario_maximo = Math.round(resultado.inventario_maximo);

        // Calcular CGI automáticamente para período fijo
        const resultadoCgi = await this.calcularCgi({
          demanda_anual: articulo.demanda,
          costo_compra: articulo.costo_compra,
          costo_almacenamiento: articulo.costo_almacenamiento,
          costo_pedido: articulo.costo_pedido,
          modelo_inventario: ModeloInventario.periodo_fijo,
          intervalo_revision: articulo.intervalo_revision,
          inventario_maximo: articulo.inventario_maximo,
        });
        articulo.cgi = resultadoCgi.cgi;

        console.log('💰 CGI calculado (Período Fijo):', resultadoCgi.cgi);
        calculosAplicados = true;
      }
    } catch (error) {
      // Si hay algún error en los cálculos, no fallar la operación
      // Solo registrar el error y continuar
      console.error('❌ Error al calcular fórmulas de inventario:', error.message);
    }

    console.log('✅ Cálculo automático completado. Cálculos aplicados:', calculosAplicados);
    return { articulo, calculosAplicados };
  }

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

    // Recargar el artículo con las relaciones para poder calcular las fórmulas
    const articuloConRelaciones = await this.articuloRepository.findOne({
      where: { id: savedArticulo.id },
      relations: ['articulo_proveedor', 'articulo_proveedor.proveedor'],
    });

    if (!articuloConRelaciones) {
      throw new HttpException('Error al recargar el artículo creado', HttpStatus.INTERNAL_SERVER_ERROR);
    }

    // Aplicar cálculos automáticos si corresponde
    const resultado = await this.calcularFormulasInventario(articuloConRelaciones);
    
    // Guardar los cálculos si se aplicaron
    if (resultado.calculosAplicados) {
      await this.articuloRepository.save(resultado.articulo);
    }

    return this.toArticuloResponseDto(resultado.articulo);
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

  // Nuevo método para obtener TODOS los artículos (activos e inactivos)
  async getAllArticulos(): Promise<ArticuloResponseDto[]> {
    const articulos = await this.articuloRepository.find({
      relations: ['articulo_proveedor', 'articulo_proveedor.proveedor'],
      order: { id: 'ASC' }, // Ordenar por ID para consistencia
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
    const articuloGuardado = await this.articuloRepository.save(updateArticulo);

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
          articulo: articuloGuardado,
          proveedor: proveedor,
          precio_unitario: proveedorData.precio_unitario,
          demora_entrega: proveedorData.demora_entrega || 0,
          cargos_pedido: proveedorData.cargos_pedido || 0,
          proveedor_predeterminado: esPredeterminado,
        });

        await this.articuloProveedorRepository.save(articuloProveedor);
      }
    }

    // Recargar el artículo con las relaciones para poder aplicar cálculos
    const articuloFinal = await this.articuloRepository.findOne({
      where: { id },
      relations: ['articulo_proveedor', 'articulo_proveedor.proveedor'],
    });

    if (!articuloFinal) {
      throw new HttpException('Artículo no encontrado después de actualizar', HttpStatus.NOT_FOUND);
    }

    // Comprobar si se actualizaron campos que afectan los cálculos de inventario
    const camposRelevantes = [
      'demanda', 'costo_almacenamiento', 'costo_pedido', 'costo_compra', 
      'modelo_inventario', 'nivel_servicio', 'desviacion_estandar', 'intervalo_revision'
    ];
    const necesitaRecalculo = camposRelevantes.some(campo => campo in articulo);

    if (necesitaRecalculo) {
      // Aplicar cálculos automáticos si corresponde
      const resultado = await this.calcularFormulasInventario(articuloFinal);
      
      // Guardar los cálculos si se aplicaron
      if (resultado.calculosAplicados) {
        await this.articuloRepository.save(resultado.articulo);
        return this.toArticuloResponseDto(resultado.articulo);
      }
    }

    return this.toArticuloResponseDto(articuloFinal);
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
      nivel_servicio: articulo.nivel_servicio,
      desviacion_estandar: articulo.desviacion_estandar,
      intervalo_revision: articulo.intervalo_revision,
      cgi: articulo.cgi,
      stock_actual: articulo.stock_actual,
      estado: articulo.estado,
      fecha_baja: articulo.fecha_baja,
      proveedores: proveedores,
    };
  }

  /**
   * Helper para obtener el valor Z (puntuación Z) para un nivel de servicio dado.
   * La puntuación Z se usa para calcular el stock de seguridad.
   * @param nivel_servicio - Nivel de servicio como un porcentaje (ej. 95 para 95%).
   * @returns El valor Z correspondiente.
   */
  private getZScore(nivel_servicio: number): number {
    // Mapeo de niveles de servicio comunes a valores Z
    // Estos valores se obtienen de tablas de distribución normal estándar.
    const z_scores = {
      90: 1.28,
      95: 1.645,
      97: 1.88,
      98: 2.05,
      99: 2.33,
    };

    const ns = Math.round(nivel_servicio * 100);
    return z_scores[ns] || 0; // Devuelve 0 si el nivel no está en la tabla
  }

  /**
   * Calcular parámetros del modelo de inventario de Lote Fijo
   */
  async calcularLoteFijo(datos: CalculoLoteFijoDto): Promise<ResultadoLoteFijoDto> {
    const {
      demanda,
      costo_almacenamiento,
      costo_pedido,
      costo_compra,
      demora_entrega,
      desviacion_estandar,
      nivel_servicio,
    } = datos;

    // 1. Lote Óptimo (EOQ - Economic Order Quantity)
    const lote_optimo = Math.sqrt((2 * demanda * costo_pedido) / costo_almacenamiento);

    // 2. Stock de Seguridad (SS)
    let stock_seguridad = 0;
    if (nivel_servicio && desviacion_estandar && demora_entrega) {
      const z_score = this.getZScore(nivel_servicio);
      // Asumimos que la desviación estándar es la de la demanda DIARIA
      // σL = σd * √L
      const desviacion_demanda_lead_time = desviacion_estandar * Math.sqrt(demora_entrega);
      stock_seguridad = z_score * desviacion_demanda_lead_time;
    }

    // 3. Punto de Pedido (ROP - Reorder Point)
    const demanda_diaria = demanda / 365;
    let punto_pedido = demanda_diaria * (demora_entrega || 0);
    punto_pedido += stock_seguridad;

    // 4. Costo Total Anual
    const costo_ordenes_anual = (demanda / lote_optimo) * costo_pedido;
    const costo_almacenamiento_anual = (lote_optimo / 2) * costo_almacenamiento;
    const costo_compra_anual = demanda * costo_compra;
    const costo_total_anual = costo_ordenes_anual + costo_almacenamiento_anual + costo_compra_anual;

    // 5. Tiempo de Reposición (o ciclo de pedido) en días BORRAR
    const intervalo_revision = (lote_optimo / demanda) * 365;
    
    return {
      lote_optimo: Math.round(lote_optimo),
      punto_pedido: Math.round(punto_pedido),
      stock_seguridad: Math.round(stock_seguridad),
      costo_total_anual: parseFloat(costo_total_anual.toFixed(2)),
      intervalo_revision: parseFloat(intervalo_revision.toFixed(2)),
    };
  }

  /**
   * Calcular parámetros del modelo de inventario de Intervalo Fijo
   */
  async calcularIntervaloFijo(datos: CalculoIntervaloFijoDto): Promise<ResultadoIntervaloFijoDto> {
    const {
      demanda,
      intervalo_revision,
      demora_entrega,
      desviacion_estandar,
      nivel_servicio,
    } = datos;

    const demanda_diaria = demanda / 365;

    // 1. Stock de Seguridad: Z × σ × √(R + L)
    let stock_seguridad = 0;
    if (nivel_servicio && desviacion_estandar && demora_entrega && intervalo_revision) {
      const z_score = this.getZScore(nivel_servicio);
      const tiempo_total = intervalo_revision + demora_entrega;
      stock_seguridad = z_score * desviacion_estandar * Math.sqrt(tiempo_total);
    }
    
    // 2. Inventario Máximo: D_diaria × (R + L) + SS
    const demanda_ciclo = demanda_diaria * (intervalo_revision + (demora_entrega || 0));
    const inventario_maximo = demanda_ciclo + stock_seguridad;
    
    return {
      stock_seguridad: Math.round(stock_seguridad),
      inventario_maximo: Math.round(inventario_maximo),
      // Campos no requeridos en esta implementación
      cantidad_pedido: 0,
      nivel_inventario_objetivo: 0,
      costo_total_anual: 0,
      tiempo_ciclo: 0,
      demanda_durante_revision: 0,
      demanda_durante_entrega: 0,
      costo_almacenamiento_anual: 0,
      costo_pedidos_anuales: 0,
      numero_pedidos_anuales: 0,
    };
  }

  /**
   * Aplicar resultados de cálculo a un artículo específico
   */
  async aplicarCalculoAArticulo(articuloId: number, modelo: 'lote_fijo' | 'periodo_fijo'): Promise<ArticuloResponseDto> {
    const articulo = await this.articuloRepository.findOne({
      where: { id: articuloId, estado: true },
      relations: ['articulo_proveedor', 'articulo_proveedor.proveedor'],
    });

    if (!articulo) {
      throw new HttpException('Artículo no encontrado', HttpStatus.NOT_FOUND);
    }

    if (!articulo.demanda || !articulo.costo_almacenamiento || !articulo.costo_pedido || !articulo.costo_compra) {
      throw new HttpException(
        'El artículo debe tener demanda, costo_almacenamiento, costo_pedido y costo_compra para realizar cálculos',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Obtener demora_entrega del proveedor predeterminado
    const proveedorPredeterminado = articulo.articulo_proveedor.find(ap => ap.proveedor_predeterminado);
    const demora_entrega = proveedorPredeterminado?.demora_entrega;

    if (modelo === 'lote_fijo') {
      const resultado = await this.calcularLoteFijo({
        demanda: articulo.demanda,
        costo_almacenamiento: articulo.costo_almacenamiento,
        costo_pedido: articulo.costo_pedido,
        costo_compra: articulo.costo_compra,
        demora_entrega: demora_entrega,
        nivel_servicio: articulo.nivel_servicio,
        desviacion_estandar: articulo.desviacion_estandar,
      });

      articulo.modelo_inventario = ModeloInventario.lote_fijo;
      articulo.lote_optimo = Math.round(resultado.lote_optimo);
      articulo.punto_pedido = Math.round(resultado.punto_pedido);
      articulo.stock_seguridad = Math.round(resultado.stock_seguridad);
      articulo.intervalo_revision = resultado.intervalo_revision;
    } else if (modelo === 'periodo_fijo') {
      const resultado = await this.calcularIntervaloFijo({
        demanda: articulo.demanda,
        intervalo_revision: articulo.intervalo_revision,
        demora_entrega: demora_entrega,
        nivel_servicio: articulo.nivel_servicio,
        desviacion_estandar: articulo.desviacion_estandar,
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
    const { 
      demanda_anual, 
      costo_compra, 
      costo_almacenamiento, 
      costo_pedido,
      modelo_inventario = 'lote_fijo',
      intervalo_revision,
      lote_optimo,
      inventario_maximo
    } = datos;
    
    let stock_promedio = datos.stock_promedio;
    let numero_pedidos_anuales: number;
    let observaciones: string | undefined;

    if (modelo_inventario === ModeloInventario.lote_fijo) {
      // CÁLCULO CGI PARA MODELO LOTE FIJO (EOQ tradicional)
      console.log('📦 Calculando CGI para modelo Lote Fijo');
      
      // Si no se proporciona el lote óptimo, calcularlo usando EOQ
      let lote_optimo_calculado = lote_optimo;
      if (!lote_optimo_calculado) {
        lote_optimo_calculado = Math.sqrt((2 * demanda_anual * costo_pedido) / costo_almacenamiento);
        observaciones = 'Lote óptimo calculado automáticamente usando EOQ';
      }

      // Si no se proporciona stock promedio, calcularlo como Q/2
      if (!stock_promedio) {
        stock_promedio = lote_optimo_calculado / 2;
      }

      numero_pedidos_anuales = demanda_anual / lote_optimo_calculado;

    } else if (modelo_inventario === ModeloInventario.periodo_fijo) {
      // CÁLCULO CGI PARA MODELO PERÍODO FIJO (usando intervalo de revisión)
      console.log('🔄 Calculando CGI para modelo Período Fijo');
      
      if (!intervalo_revision) {
        throw new HttpException(
          'Para el modelo de período fijo, el intervalo de revisión es obligatorio',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Para período fijo, el inventario máximo es el lote de pedido
      let inventario_maximo_calculado = inventario_maximo;
      if (!inventario_maximo_calculado) {
        // Si no se proporciona, calcular basado en la demanda durante el período de revisión
        const demanda_periodo = (demanda_anual / 365) * intervalo_revision;
        inventario_maximo_calculado = demanda_periodo;
        observaciones = `Inventario máximo calculado automáticamente (período: ${intervalo_revision}d)`;
      }

      // Para período fijo, el stock promedio es diferente
      if (!stock_promedio) {
        // Stock promedio = inventario máximo / 2 + stock de seguridad
        // Asumiendo stock de seguridad como 20% del inventario máximo
        const stock_seguridad = inventario_maximo_calculado * 0.2;
        stock_promedio = (inventario_maximo_calculado / 2) + stock_seguridad;
      }

      // Número de pedidos anuales para período fijo
      // Se calcula basado en la frecuencia de revisión
      numero_pedidos_anuales = 365 / intervalo_revision;

    } else {
      throw new HttpException(
        'Modelo de inventario no válido. Debe ser lote_fijo o periodo_fijo',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Cálculos comunes del CGI
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
      modelo_utilizado: modelo_inventario === ModeloInventario.lote_fijo ? 'Lote Fijo (EOQ)' : 'Período Fijo (Intervalo Revisión)',
      observaciones,
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

    // Validar que para período fijo se tenga intervalo de revisión
    if (articulo.modelo_inventario === ModeloInventario.periodo_fijo && !articulo.intervalo_revision) {
      throw new HttpException(
        'Para el modelo de período fijo, el artículo debe tener un intervalo de revisión configurado',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Calcular CGI según el modelo de inventario
    const datosCgi: CalculoCgiDto = {
      demanda_anual: articulo.demanda,
      costo_compra: articulo.costo_compra,
      costo_almacenamiento: articulo.costo_almacenamiento,
      costo_pedido: articulo.costo_pedido,
      modelo_inventario: articulo.modelo_inventario,
      intervalo_revision: articulo.intervalo_revision || undefined,
      lote_optimo: articulo.lote_optimo || undefined,
      inventario_maximo: articulo.inventario_maximo || undefined,
    };

    const resultadoCgi = await this.calcularCgi(datosCgi);

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
