import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Articulo } from './articulo.entity';
import { Repository } from 'typeorm';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { UpdateArticuloDto } from './dto/update-articulo.dto';

@Injectable()
export class ArticulosService {
  constructor(
    @InjectRepository(Articulo)
    private articuloRepository: Repository<Articulo>,
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

  async deleteArticulo(id: number) {
    const articuloFound = await this.articuloRepository.findOne({
      where: { id }
    });

    if (!articuloFound) {
      throw new HttpException('Artículo no encontrado', HttpStatus.NOT_FOUND);
    }

    // Soft delete: marcar como inactivo
    articuloFound.estado = false;
    articuloFound.fecha_baja = new Date();
    
    return this.articuloRepository.save(articuloFound);
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
