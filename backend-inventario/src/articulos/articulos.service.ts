import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Articulo } from './articulo.entity';
import { Repository } from 'typeorm';
import { CreateArticuloDto } from './dto/create-articulo.dto';

@Injectable()
export class ArticulosService {
  constructor(
    @InjectRepository(Articulo)
    private articuloRepository: Repository<Articulo>,
  ) {}

  createArticulo(articulo: CreateArticuloDto) {
    const newArticulo = this.articuloRepository.create(articulo);
    return this.articuloRepository.save(newArticulo);
  }
}
