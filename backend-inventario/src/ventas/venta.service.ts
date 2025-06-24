import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Venta } from './venta.entity';
import { CreateVentaDto, DetalleVentaDto } from './dto/create-venta.dto';
import { Articulo, ModeloInventario } from 'src/articulos/articulo.entity';
import { OrdenCompraService } from 'src/orden_compra/orden-compra.service';
import { DetalleVenta } from './detalle-venta.entity';

@Injectable()
export class VentaService {
  constructor( 
    @InjectRepository(Venta)
    private ventaRepository: Repository<Venta>,

    @InjectRepository(Articulo)
    private articuloRepository: Repository<Articulo>,

    @InjectRepository(DetalleVenta)
    private detalleVentaRepository: Repository<DetalleVenta>,

    private ordenCompraService: OrdenCompraService,
  ) {}

  //Crear una venta
  async createVenta(dto: CreateVentaDto): Promise<Venta> {
    const detalles: DetalleVentaDto[] = [];

    // Validar stock y crear detalles
    for (const detalleDto of dto.detalles) {
      const articulo = await this.articuloRepository.findOne({
        where: { id: detalleDto.articulo_id },
      });

      if (!articulo) {
        throw new HttpException(
          `Artículo con ID ${detalleDto.articulo_id} no encontrado`,
          HttpStatus.NOT_FOUND,
        );
      }

      if (!articulo.precio_venta) {
        throw new HttpException(
          `El artículo ${articulo.codigo} no tiene un precio de venta definido`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (articulo.stock_actual < detalleDto.cantidad) {
        throw new HttpException(
          `Stock insuficiente para el artículo ${articulo.codigo}. Stock actual: ${articulo.stock_actual}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      detalles.push(detalleDto);
    }

    // Crear la venta
    const venta = this.ventaRepository.create();
    const ventaGuardada = await this.ventaRepository.save(venta);

    // Guardar detalles y actualizar stock
    for (const detalle of detalles) {
      const articulo = await this.articuloRepository.findOne({
        where: { id: detalle.articulo_id },
      });

      if (!articulo) {
        throw new HttpException(
          `Artículo con ID ${detalle.articulo_id} no encontrado`,
          HttpStatus.NOT_FOUND,
        );
      }

      const detalleVenta = this.detalleVentaRepository.create({
        articulo_id: detalle.articulo_id,
        cantidad: detalle.cantidad,
        precio_unitario: articulo.precio_venta,
        venta_id: ventaGuardada.id,
      });
      await this.detalleVentaRepository.save(detalleVenta);

      articulo.stock_actual -= detalle.cantidad;
      await this.articuloRepository.save(articulo);

      // Verificar si se debe generar orden de compra
      if (
        articulo.modelo_inventario === ModeloInventario.lote_fijo &&
        articulo.stock_actual <= articulo.punto_pedido
      ) {
        const ordenesActivas =
          await this.ordenCompraService.getOrdenesActivasPorArticulo(
            articulo.id,
          );

        if (ordenesActivas.length === 0) {
          await this.ordenCompraService.createOrdenCompra({
            articulo_id: articulo.id,
            cantidad: articulo.lote_optimo,
            proveedor_id: undefined,
          });
        }
      }
    }

    return ventaGuardada;
  }

  async getVentas() {
    return this.ventaRepository.find({
      relations: ['detalle_venta', 'detalle_venta.articulo'],
    });
  }

  async getVenta(id: number) {
    const venta = await this.ventaRepository.findOne({
      where: { id },
      relations: ['detalle_venta', 'detalle_venta.articulo'],
    });

    if (!venta) {
      throw new HttpException(
        `Venta con ID ${id} no encontrada`,
        HttpStatus.NOT_FOUND,
      );
    }

    return venta;
  }
}
