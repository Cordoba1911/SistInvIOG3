import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Proveedor } from './proveedor.entity';
import { Repository, In } from 'typeorm';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { ArticuloProveedor } from 'src/articulo-proveedor/articulo-proveedor.entity';
import { Articulo } from 'src/articulos/articulo.entity';
import { OrdenCompra } from 'src/orden_compra/orden-compra.entity';
import { RelacionarArticulosDto } from './dto/relacionar-articulos.dto';

@Injectable()
export class ProveedorService {
  constructor(
    @InjectRepository(Proveedor)
    private proveedorRepository: Repository<Proveedor>,

    @InjectRepository(ArticuloProveedor)
    private articuloProveedorRepository: Repository<ArticuloProveedor>,

    @InjectRepository(Articulo)
    private articuloRepository: Repository<Articulo>,

    @InjectRepository(OrdenCompra)
    private ordenCompraRepository: Repository<OrdenCompra>,
  ) {}

  //Crear un nuevo proveedor
  async createProveedor(dto: CreateProveedorDto) {
    // Validar que no exista un proveedor con el mismo nombre
    const proveedorFound = await this.proveedorRepository.findOne({
      where: { nombre: dto.nombre },
    });

    if (proveedorFound) {
      throw new HttpException('Ya existe un proveedor con el nombre "' + dto.nombre + '". Por favor, use un nombre diferente.', HttpStatus.CONFLICT);
    }

    // Crear el proveedor
    const proveedor = this.proveedorRepository.create({
      nombre: dto.nombre,
      telefono: dto.telefono,
      email: dto.email,
      estado: true,
    });

    const savedProveedor = await this.proveedorRepository.save(proveedor);

    // Si hay artículos, crear las relaciones en la tabla intermedia articulo_proveedor
    if (dto.articulos && dto.articulos.length > 0) {
      for (const art of dto.articulos) {
        const articulo = await this.articuloRepository.findOne({
          where: { id: art.articulo_id },
        });

        if (!articulo) {
          throw new HttpException(
            `No se encontró el artículo con ID ${art.articulo_id}. El artículo puede haber sido eliminado o estar inactivo.`,
            HttpStatus.BAD_REQUEST,
          );
        }

        // Verificar si el artículo ya tiene un proveedor predeterminado
        const proveedorPredeterminado =
          await this.articuloProveedorRepository.findOne({
            where: {
              articulo: { id: art.articulo_id },
              proveedor_predeterminado: true,
            },
          });

        const articuloProveedor = this.articuloProveedorRepository.create({
          proveedor: savedProveedor,
          articulo,
          demora_entrega: art.demora_entrega,
          precio_unitario: art.precio_unitario,
          cargos_pedido: art.cargos_pedido,
          // Si se especifica como predeterminado o si no hay proveedor predeterminado, este será el predeterminado
          proveedor_predeterminado: art.proveedor_predeterminado || !proveedorPredeterminado,
        });

        await this.articuloProveedorRepository.save(articuloProveedor);
      }
    }

    return savedProveedor;
  }

  //Obtener todos los proveedores
  getProveedores() {
    return this.proveedorRepository.find();
  }

  //Obtener solo proveedores activos
  getProveedoresActivos() {
    return this.proveedorRepository.find({
      where: { estado: true }
    });
  }

  //Obtener un proveedor por ID
  async getProveedor(id: number) {
    const proveedorFound = await this.proveedorRepository.findOne({
      where: {
        id,
      },
    });

    if (!proveedorFound) {
      return new HttpException(
        `Proveedor con ID ${id} no encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    return proveedorFound;
  }

  //Actualizar un proveedor por ID
  async updateProveedor(id: number, proveedor: UpdateProveedorDto) {
    const proveedorFound = await this.proveedorRepository.findOne({
      where: {
        id,
      },
    });

    if (!proveedorFound) {
      return new HttpException(
        `Proveedor con ID ${id} no encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (!proveedorFound.estado) {
      throw new HttpException(
        'No se puede actualizar un proveedor que está dado de baja',
        HttpStatus.BAD_REQUEST,
      );
    }

    const updateProveedor = Object.assign(proveedorFound, proveedor);
    return this.proveedorRepository.save(updateProveedor);
  }

  //Dar de baja un proveedor por ID
  async bajaProveedor(id: number) {
    const proveedorFound = await this.proveedorRepository.findOne({
      where: { id },
    });

    if (!proveedorFound) {
      throw new HttpException(
        `Proveedor con ID ${id} no encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (!proveedorFound.estado) {
      throw new HttpException(
        'El proveedor ya está dado de baja',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Validación: ¿Es proveedor predeterminado de algún artículo?
    const relacionesPredeterminadas =
      await this.articuloProveedorRepository.count({
        where: {
          proveedor: { id: id },
          proveedor_predeterminado: true,
        },
      });

    if (relacionesPredeterminadas > 0) {
      throw new HttpException(
        "No se puede dar de baja al proveedor porque es el proveedor predeterminado de algún artículo.",
        HttpStatus.BAD_REQUEST
      );
    }

    // Validación: ¿Tiene órdenes de compra pendientes o en curso?
    const ordenesPendientes = await this.ordenCompraRepository.count({
      where: {
        proveedor: { id: id },
        estado: In(['pendiente', 'en curso']),
      },
    });

    if (ordenesPendientes > 0) {
      throw new HttpException(
        'No se puede dar de baja al proveedor porque tiene órdenes de compra pendientes o en curso. Debe cancelar o finalizar todas las órdenes antes de dar de baja este proveedor.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Baja lógica
    proveedorFound.estado = false;
    proveedorFound.fecha_baja = new Date();

    return this.proveedorRepository.save(proveedorFound);
  }

  // Reactivar un proveedor
  async reactivarProveedor(id: number) {
    const proveedorFound = await this.proveedorRepository.findOne({
      where: { id },
    });

    if (!proveedorFound) {
      throw new HttpException(
        `Proveedor con ID ${id} no encontrado`,
        HttpStatus.NOT_FOUND
      );
    }

    if (proveedorFound.estado) {
      throw new HttpException(
        "El proveedor ya está activo",
        HttpStatus.BAD_REQUEST
      );
    }

    proveedorFound.estado = true;
    proveedorFound.fecha_baja = null;

    return this.proveedorRepository.save(proveedorFound);
  }

  //Listar artículos de un proveedor
  async getArticulosDeProveedor(id: number) {
    const proveedor = await this.proveedorRepository.findOne({ where: { id } });

    if (!proveedor) {
      throw new HttpException('Proveedor no encontrado', HttpStatus.NOT_FOUND);
    }

    const articulosProveedor = await this.articuloProveedorRepository.find({
      where: { proveedor: { id } },
      relations: ['articulo'], // Importante para traer el objeto articulo completo
    });

    const resultado = articulosProveedor.map((relacion) => {
      return {
        articulo: relacion.articulo,
        precio_unitario: relacion.precio_unitario
          ? parseFloat(relacion.precio_unitario as any)
          : null,
        demora_entrega: relacion.demora_entrega,
        cargos_pedido: relacion.cargos_pedido
          ? parseFloat(relacion.cargos_pedido as any)
          : null,
        proveedor_predeterminado: relacion.proveedor_predeterminado,
      };
    });

    return resultado;
  }

  // Relacionar artículos con un proveedor
  async relacionarConArticulos(
    proveedorId: number,
    dto: RelacionarArticulosDto,
  ) {
    const proveedor = await this.proveedorRepository.findOne({
      where: { id: proveedorId },
    });

    if (!proveedor) {
      throw new HttpException(
        `Proveedor con ID ${proveedorId} no encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    if (!proveedor.estado) {
      throw new HttpException(
        'No se pueden relacionar artículos con un proveedor que está dado de baja',
        HttpStatus.BAD_REQUEST,
      );
    }

    for (const item of dto.articulos) {
      const articulo = await this.articuloRepository.findOne({
        where: { id: item.articulo_id },
      });

      if (!articulo) {
        throw new HttpException(
          `No se encontró el artículo con ID ${item.articulo_id}. El artículo puede haber sido eliminado o estar inactivo.`,
          HttpStatus.BAD_REQUEST,
        );
      }

      const yaRelacionado = await this.articuloProveedorRepository.findOne({
        where: {
          proveedor: { id: proveedorId },
          articulo: { id: item.articulo_id },
        },
      });

      if (yaRelacionado) {
        throw new HttpException(
          `Ya existe una relación entre este proveedor y el artículo ID ${item.articulo_id}. No se puede crear una relación duplicada.`,
          HttpStatus.CONFLICT,
        );
      }

      // Verificar si el artículo ya tiene un proveedor predeterminado
      const proveedorPredeterminado =
        await this.articuloProveedorRepository.findOne({
          where: {
            articulo: { id: item.articulo_id },
            proveedor_predeterminado: true,
          },
        });

      const nuevaRelacion = this.articuloProveedorRepository.create({
        proveedor,
        articulo,
        precio_unitario: item.precio_unitario,
        demora_entrega: item.demora_entrega,
        cargos_pedido: item.cargos_pedido,
        // Si no hay proveedor predeterminado, este será el predeterminado
        proveedor_predeterminado: !proveedorPredeterminado,
      });

      await this.articuloProveedorRepository.save(nuevaRelacion);
    }

    return {
      message: `Se relacionaron ${dto.articulos.length} artículo(s) con el proveedor ID ${proveedorId}`,
    };
  }
}
