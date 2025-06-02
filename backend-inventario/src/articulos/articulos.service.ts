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

    const articuloFound = await this.articuloRepository.findOne({
      where: {
        codigo: articulo.codigo
      }
    })

    if (articuloFound) {
      return new HttpException('Codigo repetido', HttpStatus.CONFLICT);
    }

    const newArticulo = this.articuloRepository.create(articulo);
    return this.articuloRepository.save(newArticulo);
  }

  getArticulos() {
    return this.articuloRepository.find();
  }

  async getArticulo(id: number) {
    const articuloFound = await this.articuloRepository.findOne({
      where: {
        id
      }
    });

    if (!articuloFound) {
      return new HttpException('Articulo no encontrado', HttpStatus.NOT_FOUND)
    }

    return articuloFound
  }

  async deleteArticulo(id: number) {
    const result = await this.articuloRepository.delete({ id });

    if (result.affected === 0) {
      return new HttpException('Articulo no encontrado', HttpStatus.NOT_FOUND);
    }

    return result;
  }

  async updateArticulo(id: number, articulo: UpdateArticuloDto) {
    const articuloFound = await this.articuloRepository.findOne({
      where: {
        id
      }
    });
    if (!articuloFound) {
      return new HttpException('Articulo no encontrado', HttpStatus.NOT_FOUND)
    }

    const updateArticulo = Object.assign(articuloFound, articulo);
    return this.articuloRepository.save(updateArticulo);
  }
}
