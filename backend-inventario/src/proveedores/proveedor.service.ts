import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Proveedor } from './proveedor.entity';
import { Repository } from 'typeorm';
import { CreateProveedorDto } from './dto/create-proveedor.dto';

@Injectable()
export class ProveedorService {
  constructor(
    @InjectRepository(Proveedor)
    private proveedorRepository: Repository<Proveedor>,
  ) {}

  createProveedor(proveedor: CreateProveedorDto) {
    const newProveedor = this.proveedorRepository.create(proveedor);
    return this.proveedorRepository.save(newProveedor);
  }
}
