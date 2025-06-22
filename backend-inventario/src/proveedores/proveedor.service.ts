import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Proveedor } from './proveedor.entity';
import { Repository } from 'typeorm';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Injectable()
export class ProveedorService {
  constructor(
    @InjectRepository(Proveedor)
    private proveedorRepository: Repository<Proveedor>,
  ) {}

  //Crear un nuevo proveedor
  async createProveedor(proveedor: CreateProveedorDto) {
    const proveedorFound = await this.proveedorRepository.findOne({
      where: {
        nombre: proveedor.nombre,
      },
    });
    if (proveedorFound) {
      return new HttpException('Proveedor ya existe', HttpStatus.CONFLICT);
    }

    const newProveedor = this.proveedorRepository.create({
      ...proveedor,
      estado: true, // Por defecto, el estado es true
    });
    return this.proveedorRepository.save(newProveedor);
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

    proveedorFound.estado = false;
    proveedorFound.fecha_baja = new Date(); // Registrar la fecha de baja
    return this.proveedorRepository.save(proveedorFound);
  }
}
