import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Proveedor } from './proveedor.entity';
import { Repository, In } from 'typeorm';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';
import { ArticuloProveedor } from 'src/articulo-proveedor/articulo-proveedor.entity';
import { Articulo } from 'src/articulos/articulo.entity';
import { OrdenCompra } from 'src/orden_compra/orden-compra.entity';

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
    const proveedorFound = await this.proveedorRepository.findOne({
      where: { nombre: dto.nombre },
    });

    if (proveedorFound) {
      throw new HttpException('Proveedor ya existe', HttpStatus.CONFLICT);
    }

    if (!dto.articulos || dto.articulos.length === 0) {
      throw new HttpException(
        'El proveedor debe estar asociado al menos a un artículo',
        HttpStatus.BAD_REQUEST,
      );
    }

    const proveedor = this.proveedorRepository.create({
      nombre: dto.nombre,
      telefono: dto.telefono,
      email: dto.email,
      estado: true,
    });

    const savedProveedor = await this.proveedorRepository.save(proveedor);

    // Guardar las relaciones con los artículos
    for (const art of dto.articulos) {
      const articuloProveedor = this.articuloProveedorRepository.create({
        proveedor: savedProveedor,
        articulo: { id: art.articulo_id },
        demora_entrega: art.demora_entrega,
        precio_unitario: art.precio_unitario,
        cargos_pedido: art.cargos_pedido,
      });
      await this.articuloProveedorRepository.save(articuloProveedor);
    }

    return savedProveedor;
  }

  //Obtener todos los proveedores
  getProveedores() {
    return this.proveedorRepository.find();
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

    const updateProveedor = Object.assign(proveedorFound, proveedor);
    return this.proveedorRepository.save(updateProveedor);
  }

  //Dar de baja un proveedor por ID
  //FALTA: No permitir la baja si el proveedor es el predeterminado o tiene una orden de compra pendiente o en curso
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

    // Validación: ¿Es proveedor predeterminado de algún artículo?
    const proveedorPredeterminado = await this.articuloRepository.count({
      where: {
        proveedor_predeterminado: {
          id: id,
        },
      },
    });

    if (proveedorPredeterminado > 0) {
      throw new HttpException(
        'No se puede dar de baja al proveedor porque es el proveedor predeterminado de algún artículo',
        HttpStatus.BAD_REQUEST,
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
        'No se puede dar de baja al proveedor porque tiene órdenes de compra pendientes o en curso',
        HttpStatus.BAD_REQUEST,
      );
    }

    // Baja lógica
    proveedorFound.estado = false;
    proveedorFound.fecha_baja = new Date();

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
    const articulo = relacion.articulo;
    return {
      articulo_id: articulo.id,
      codigo: articulo.codigo,
      descripcion: articulo.descripcion,
      esPredeterminado: articulo.proveedor_predeterminado_id === id,
    };
  });

  return resultado;
}

}
