import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { OrdenCompra, EstadoOrdenCompra } from './orden-compra.entity';
import { CreateOrdenCompraDto } from './dto/create-orden-compra.dto';
import { UpdateOrdenCompraDto } from './dto/update-orden-compra.dto';
import { SugerenciaOrdenCompraDto } from './dto/sugerencia-orden-compra.dto';
import { Articulo, ModeloInventario } from 'src/articulos/articulo.entity';
import { Proveedor } from 'src/proveedores/proveedor.entity';
import { ArticuloProveedor } from 'src/articulo-proveedor/articulo-proveedor.entity';

@Injectable()
export class OrdenCompraService {
  constructor(
    @InjectRepository(OrdenCompra)
    private ordenCompraRepository: Repository<OrdenCompra>,

    @InjectRepository(Articulo)
    private readonly articuloRepository: Repository<Articulo>,

    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,

    @InjectRepository(ArticuloProveedor)
    private readonly articuloProveedorRepository: Repository<ArticuloProveedor>,
  ) {}

  // Crear una nueva orden de compra
  async createOrdenCompra(dto: CreateOrdenCompraDto): Promise<OrdenCompra> {
    // Buscar el artículo
    const articulo = await this.articuloRepository.findOne({
      where: { id: dto.articulo_id },
    });

    if (!articulo) {
      throw new HttpException('Artículo no encontrado', HttpStatus.NOT_FOUND);
    }

    //Verificar si el artículo tiene órdenes de compra activas
    const ocActiva = await this.ordenCompraRepository.findOne({
      where: {
        articulo_id: dto.articulo_id,
        estado: In(['pendiente', 'enviada']),
      },
    });

    if (ocActiva) {
      throw new HttpException(
        `Ya existe una orden de compra activa (ID: ${ocActiva.id}) para este artículo.`,
        HttpStatus.CONFLICT,
      );
    }

    let proveedorId = dto.proveedor_id;

    // Si no se proporcionó un proveedor, buscar el proveedor predeterminado
    if (!proveedorId) {
      const proveedorPredeterminado =
        await this.articuloProveedorRepository.findOne({
          where: {
            articulo: { id: dto.articulo_id },
            proveedor_predeterminado: true,
          },
          relations: ['proveedor'],
        });

      if (!proveedorPredeterminado) {
        throw new HttpException(
          'No se proporcionó un proveedor y el artículo no tiene un proveedor predeterminado',
          HttpStatus.BAD_REQUEST,
        );
      }

      proveedorId = proveedorPredeterminado.proveedor.id;
    }

    const proveedor = await this.proveedorRepository.findOneBy({
      id: proveedorId,
    });

    if (!proveedor) {
      throw new HttpException('Proveedor no encontrado', HttpStatus.NOT_FOUND);
    }

    if (!proveedor.estado) {
      throw new HttpException(
        'No se puede crear una orden de compra para un proveedor que está dado de baja',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Verificar si el proveedor está relacionado con el artículo
    const relacion = await this.articuloProveedorRepository.findOne({
      where: {
        articulo: { id: articulo.id },
        proveedor: { id: proveedorId },
      },
    });

    if (!relacion) {
      throw new HttpException(
        'El proveedor no está relacionado con el artículo solicitado',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Determinar la cantidad: usar la del dto o sugerir lote óptimo
    const cantidad = dto.cantidad ?? articulo.lote_optimo;

    if (!cantidad || cantidad <= 0) {
      throw new HttpException(
        'La cantidad no es válida ni se puede sugerir un lote óptimo',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Crear la orden
    const ordenCompra = this.ordenCompraRepository.create({
      articulo_id: articulo.id,
      proveedor_id: proveedor.id,
      cantidad,
      estado: EstadoOrdenCompra.PENDIENTE,
    });

    return this.ordenCompraRepository.save(ordenCompra);
  }

  // Obtener todas las órdenes de compra
  getOrdenesCompra() {
    return this.ordenCompraRepository.find({
      relations: ["articulo", "proveedor"],
    });
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
        estado: In([EstadoOrdenCompra.PENDIENTE, EstadoOrdenCompra.ENVIADA]),
      },
    });

    return ordenesActivas.length > 0;
  }

  // Obtener órdenes activas de un artículo para información detallada
  async getOrdenesActivasPorArticulo(
    articuloId: number,
  ): Promise<OrdenCompra[]> {
    return await this.ordenCompraRepository.find({
      where: {
        articulo_id: articuloId,
        estado: In([EstadoOrdenCompra.PENDIENTE, EstadoOrdenCompra.ENVIADA]),
      },
      order: {
        fecha_creacion: 'DESC',
      },
    });
  }

  /**
   * Obtener sugerencias inteligentes para crear órdenes de compra
   * Basado en productos que necesitan reposición según sus modelos de inventario
   */
  async getSugerenciasOrdenesCompra(): Promise<SugerenciaOrdenCompraDto[]> {
    // Obtener artículos que necesitan reposición
    const articulos = await this.articuloRepository
      .createQueryBuilder('articulo')
      .leftJoinAndSelect('articulo.articulo_proveedor', 'ap')
      .leftJoinAndSelect('ap.proveedor', 'proveedor')
      .where('articulo.estado = :estado', { estado: true })
      .andWhere('articulo.punto_pedido IS NOT NULL')
      .andWhere('articulo.stock_actual <= articulo.punto_pedido')
      .getMany();

    const sugerencias: SugerenciaOrdenCompraDto[] = [];

    for (const articulo of articulos) {
      // Verificar que no tenga órdenes activas
      const tieneOrdenesActivas = await this.tieneOrdenesActivas(articulo.id);
      
      if (!tieneOrdenesActivas) {
        // Buscar el proveedor predeterminado
        const proveedorPredeterminado = articulo.articulo_proveedor?.find(
          ap => ap.proveedor_predeterminado === true
        );

        if (proveedorPredeterminado) {
          // Calcular cantidad sugerida según el modelo
          let cantidadSugerida = 0;
          let razonSugerencia = '';
          
          if (articulo.modelo_inventario === 'lote_fijo' && articulo.lote_optimo) {
            cantidadSugerida = articulo.lote_optimo;
            razonSugerencia = `Lote óptimo calculado (EOQ): ${articulo.lote_optimo} unidades`;
          } else if (articulo.modelo_inventario === 'periodo_fijo' && articulo.inventario_maximo) {
            // Para período fijo: cantidad = inventario_máximo - stock_actual
            cantidadSugerida = Math.max(0, articulo.inventario_maximo - articulo.stock_actual);
            razonSugerencia = `Reposición hasta inventario máximo: ${articulo.inventario_maximo} unidades`;
          } else {
            // Método de respaldo: diferencia hasta punto de pedido + buffer
            const diferencia = articulo.punto_pedido - articulo.stock_actual;
            cantidadSugerida = diferencia + (articulo.stock_seguridad || Math.ceil(diferencia * 0.3));
            razonSugerencia = `Reposición hasta punto de pedido + stock de seguridad`;
          }

          // Calcular costo estimado
          const costoEstimado = cantidadSugerida * proveedorPredeterminado.precio_unitario;

          // Calcular prioridad (más urgente = mayor prioridad)
          const porcentajeFaltante = ((articulo.punto_pedido - articulo.stock_actual) / articulo.punto_pedido) * 100;
          let prioridad: 'ALTA' | 'MEDIA' | 'BAJA' = 'BAJA';
          
          if (articulo.stock_actual <= 0) {
            prioridad = 'ALTA';
          } else if (porcentajeFaltante >= 50) {
            prioridad = 'ALTA';
          } else if (porcentajeFaltante >= 25) {
            prioridad = 'MEDIA';
          }

          sugerencias.push({
            articulo_id: articulo.id,
            codigo: articulo.codigo,
            nombre: articulo.nombre,
            descripcion: articulo.descripcion,
            stock_actual: articulo.stock_actual,
            punto_pedido: articulo.punto_pedido,
            stock_seguridad: articulo.stock_seguridad,
            modelo_inventario: articulo.modelo_inventario,
            cantidad_sugerida: Math.ceil(cantidadSugerida),
            razon_sugerencia: razonSugerencia,
            prioridad,
            proveedor_predeterminado: {
              id: proveedorPredeterminado.proveedor.id,
              nombre: proveedorPredeterminado.proveedor.nombre,
              telefono: proveedorPredeterminado.proveedor.telefono,
              email: proveedorPredeterminado.proveedor.email,
              precio_unitario: proveedorPredeterminado.precio_unitario,
              demora_entrega: proveedorPredeterminado.demora_entrega,
            },
            costo_estimado: Math.round(costoEstimado * 100) / 100,
            dias_sin_stock: Math.max(0, Math.ceil((articulo.stock_actual * -1) / (articulo.demanda / 365))),
          });
        }
      }
    }

    // Ordenar por prioridad y luego por días sin stock
    return sugerencias.sort((a, b) => {
      const prioridadOrder = { 'ALTA': 3, 'MEDIA': 2, 'BAJA': 1 };
      if (prioridadOrder[a.prioridad] !== prioridadOrder[b.prioridad]) {
        return prioridadOrder[b.prioridad] - prioridadOrder[a.prioridad];
      }
      return b.dias_sin_stock - a.dias_sin_stock;
    });
  }

  // Actualizar una orden por ID
  async updateOrdenCompra(id: number, dto: UpdateOrdenCompraDto) {
    const orden = await this.ordenCompraRepository.findOne({
      where: { id },
      relations: ['articulo', 'proveedor'],
    });

    if (!orden) {
      throw new HttpException(
        `Orden de compra con ID ${id} no encontrada`,
        HttpStatus.NOT_FOUND,
      );
    }

    // Solo se puede modificar si está en estado 'pendiente'
    if (orden.estado !== EstadoOrdenCompra.PENDIENTE) {
      throw new HttpException(
        `Solo se puede modificar una orden en estado pendiente`,
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validar proveedor nuevo si se quiere actualizar
    if (dto.proveedor_id) {
      const nuevoProveedor = await this.proveedorRepository.findOne({
        where: { id: dto.proveedor_id },
      });

      if (!nuevoProveedor) {
        throw new HttpException(
          `Proveedor con ID ${dto.proveedor_id} no encontrado`,
          HttpStatus.NOT_FOUND,
        );
      }

      // Verificar relación con el artículo
      const relacion = await this.articuloProveedorRepository.findOne({
        where: {
          proveedor: { id: dto.proveedor_id },
          articulo: { id: orden.articulo.id },
        },
      });

      if (!relacion) {
        throw new HttpException(
          `El proveedor con ID ${dto.proveedor_id} no está relacionado con el artículo de esta orden`,
          HttpStatus.BAD_REQUEST,
        );
      }

      orden.proveedor = nuevoProveedor;
    }

    // Si se quiere actualizar cantidad
    if (dto.cantidad !== undefined) {
      orden.cantidad = dto.cantidad;
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

    if (orden.estado !== EstadoOrdenCompra.PENDIENTE) {
      throw new HttpException(
        `Solo se puede cancelar una orden en estado pendiente`,
        HttpStatus.BAD_REQUEST,
      );
    }

    orden.estado = EstadoOrdenCompra.CANCELADA;
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

    if (orden.estado !== EstadoOrdenCompra.PENDIENTE) {
      throw new HttpException(
        `Solo se puede enviar una orden en estado pendiente`,
        HttpStatus.BAD_REQUEST,
      );
    }

    orden.estado = EstadoOrdenCompra.ENVIADA;
    orden.fecha_envio = new Date();
    return await this.ordenCompraRepository.save(orden);
  }

  // Finalizar una orden de compra y actualizar el stock del artículo
  async finalizarOrdenCompra(id: number) {
    const orden = await this.ordenCompraRepository.findOne({
      where: { id },
      relations: ['articulo'],
    });

    if (!orden) {
      throw new HttpException(
        `Orden de compra con ID ${id} no encontrada`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (orden.estado !== EstadoOrdenCompra.ENVIADA) {
      throw new HttpException(
        `Solo se puede finalizar una orden que esté en estado enviada`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!orden.articulo) {
      throw new HttpException(
        'No se encontró el artículo asociado a la orden',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    const nuevoStock = (orden.articulo.stock_actual || 0) + orden.cantidad;

    orden.articulo.stock_actual = nuevoStock;
    await this.articuloRepository.save(orden.articulo);

    orden.estado = EstadoOrdenCompra.FINALIZADA;
    orden.fecha_finalizacion = new Date();
    const ordenGuardada = await this.ordenCompraRepository.save(orden);

    function normalizeModel(model: string) {
      return model.toLowerCase().replace(' ', '_');
    }

    let warning: string | null = null;
    if (
      orden.articulo.modelo_inventario === ModeloInventario.lote_fijo &&
      nuevoStock < (orden.articulo.punto_pedido || 0)
    ) {
      warning = `Atención: El stock final (${nuevoStock}) sigue por debajo del punto de pedido (${orden.articulo.punto_pedido}).`;
    }

    return {
      orden: ordenGuardada,
      warning,
    };
  }
}
