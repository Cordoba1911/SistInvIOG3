import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ArticuloProveedor } from './articulo-proveedor.entity';
import { Articulo } from 'src/articulos/articulo.entity';
import { Proveedor } from 'src/proveedores/proveedor.entity';
import { Repository } from 'typeorm';
import { CreateArticuloProveedorDto } from './dto/create-articulo-proveedor.dto';
import { UpdateArticuloProveedorDto } from './dto/update-articulo-proveedor.dto';

@Injectable()
export class ArticuloProveedorService {
  constructor(
    @InjectRepository(ArticuloProveedor)
    private readonly articuloProveedorRepository: Repository<ArticuloProveedor>,

    @InjectRepository(Articulo)
    private readonly articuloRepository: Repository<Articulo>,

    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
  ) {}

  //cambiar los errores por httpException
  async create(dto: CreateArticuloProveedorDto): Promise<ArticuloProveedor> {
    const articulo = await this.articuloRepository.findOneBy({
      id: dto.articulo_id,
    });
    if (!articulo) throw new Error('Artículo no encontrado');

    const proveedor = await this.proveedorRepository.findOneBy({
      id: dto.proveedor_id,
    });
    if (!proveedor) throw new Error('Proveedor no encontrado');

    const articuloProveedor = this.articuloProveedorRepository.create({
      articulo,
      proveedor,
      demora_entrega: dto.demora_entrega,
      precio_unitario: dto.precio_unitario,
      cargos_pedido: dto.cargos_pedido,
    });

    return this.articuloProveedorRepository.save(articuloProveedor);
  }

  //modificar por id
  async updateArticuloProveedor(id: number, dto: UpdateArticuloProveedorDto) {
    const articuloProveedor = await this.articuloProveedorRepository.findOne({
      where: {
        id,
      },
    });

    if (!articuloProveedor) {
      throw new HttpException(
        `Artículo proveedor con ID ${id} no encontrado`,
        HttpStatus.NOT_FOUND,
      );
    }

    const updatedArticuloProveedor = Object.assign(articuloProveedor, dto);
    return this.articuloProveedorRepository.save(updatedArticuloProveedor);
  }
}
