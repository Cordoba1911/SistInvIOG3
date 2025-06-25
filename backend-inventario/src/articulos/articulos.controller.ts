import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  NotFoundException,
  ParseIntPipe,
  Delete,
  Patch,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { CreateArticuloDto } from './dto/create-articulo.dto';
import { ArticulosService } from './articulos.service';
import { UpdateArticuloDto } from './dto/update-articulo.dto';
import { ArticuloResponseDto } from './dto/articulo-response.dto';
import { CalculoLoteFijoDto, ResultadoLoteFijoDto } from './dto/calculo-lote-fijo.dto';
import { CalculoIntervaloFijoDto, ResultadoIntervaloFijoDto } from './dto/calculo-intervalo-fijo.dto';
import { CalculoCgiDto, ResultadoCgiDto } from './dto/calculo-cgi.dto';
import { ProductoFaltanteDto, ProductoAReponerDto } from './dto/productos-faltantes.dto';
import { AjusteInventarioDto, ResultadoAjusteDto } from './dto/ajuste-inventario.dto';
import { ProveedorArticuloResponseDto } from './dto/articulo-response.dto';

@Controller('articulos')
export class ArticulosController {
  constructor(private articulosService: ArticulosService) {}

  /**
   * Obtener todos los artículos activos
   */
  @Get()
  async getArticulos(): Promise<ArticuloResponseDto[]> {
    return this.articulosService.getArticulos();
  }

  /**
   * Obtener TODOS los artículos (activos e inactivos)
   * Para la administración de artículos
   */
  @Get('admin/todos')
  async getAllArticulos(): Promise<ArticuloResponseDto[]> {
    return this.articulosService.getAllArticulos();
  }

  /**
   * Obtener listado de productos faltantes
   * Devuelve artículos cuyo stock actual está por debajo del stock de seguridad
   */
  @Get('faltantes')
  async getProductosFaltantes(): Promise<ProductoFaltanteDto[]> {
    return this.articulosService.getProductosFaltantes();
  }

  /**
   * Obtener listado de productos a reponer
   * Devuelve artículos que han alcanzado el punto de pedido y no tienen órdenes de compra activas
   */
  @Get('a-reponer')
  async getProductosAReponer(): Promise<ProductoAReponerDto[]> {
    return this.articulosService.getProductosAReponer();
  }

  /**
   * Obtener un artículo específico por ID
   */
  @Get(':id')
  async getArticulo(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ArticuloResponseDto> {
    return this.articulosService.getArticulo(id);
  }

  /**
   * Crear un nuevo artículo
   * Requiere: código, descripción, demanda, costo_almacenamiento, costo_pedido, costo_compra
   * Opcional: proveedor_predeterminado_id
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createArticulo(
    @Body() newArticulo: CreateArticuloDto,
  ): Promise<ArticuloResponseDto> {
    return this.articulosService.createArticulo(newArticulo);
  }

  /**
   * Actualizar un artículo existente
   * Permite actualización parcial de campos incluyendo proveedor predeterminado
   */
  @Patch(':id')
  async updateArticulo(
    @Param('id', ParseIntPipe) id: number,
    @Body() articulo: UpdateArticuloDto,
  ): Promise<ArticuloResponseDto> {
    return this.articulosService.updateArticulo(id, articulo);
  }

  /**
   * Eliminar un artículo (soft delete con validaciones)
   * Valida que no tenga stock ni órdenes de compra activas
   * Proporciona mensajes de error descriptivos en caso de impedimentos
   */
  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteArticulo(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; articulo: ArticuloResponseDto }> {
    return this.articulosService.deleteArticulo(id);
  }

  /**
   * Reactivar un artículo (soft delete toggle)
   */
  @Patch(':id/reactivar')
  @HttpCode(HttpStatus.OK)
  async reactivarArticulo(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string; articulo: ArticuloResponseDto }> {
    return this.articulosService.reactivarArticulo(id);
  }

  /**
   * Calcular parámetros del modelo de inventario Lote Fijo
   * Calcula: Lote Óptimo, Punto de Pedido, Stock de Seguridad
   */
  @Post('calcular/lote-fijo')
  @HttpCode(HttpStatus.OK)
  async calcularLoteFijo(
    @Body() datos: CalculoLoteFijoDto,
  ): Promise<ResultadoLoteFijoDto> {
    return this.articulosService.calcularLoteFijo(datos);
  }

  /**
   * Calcular parámetros del modelo de inventario Período Fijo
   * Calcula: Stock de Seguridad, Inventario Máximo
   */
  @Post('calcular/periodo-fijo')
  @HttpCode(HttpStatus.OK)
  async calcularPeriodoFijo(
    @Body() datos: CalculoIntervaloFijoDto,
  ): Promise<ResultadoIntervaloFijoDto> {
    return this.articulosService.calcularIntervaloFijo(datos);
  }

  /**
   * Aplicar cálculo de modelo de inventario a un artículo específico
   * Actualiza los campos calculados del artículo automáticamente
   */
  @Post(':id/aplicar-calculo/:modelo')
  @HttpCode(HttpStatus.OK)
  async aplicarCalculoAArticulo(
    @Param('id', ParseIntPipe) id: number,
    @Param('modelo') modelo: 'lote_fijo' | 'periodo_fijo',
  ): Promise<ArticuloResponseDto> {
    return this.articulosService.aplicarCalculoAArticulo(id, modelo);
  }

  /**
   * Calcular el CGI (Costo de Gestión del Inventario)
   * Calcula el costo total anual de gestionar inventario incluyendo costos de pedido, almacenamiento y compra
   */
  @Post('calcular/cgi')
  @HttpCode(HttpStatus.OK)
  async calcularCgi(
    @Body() datos: CalculoCgiDto,
  ): Promise<ResultadoCgiDto> {
    return this.articulosService.calcularCgi(datos);
  }

  /**
   * Calcular y actualizar el CGI de un artículo específico
   * Utiliza los datos del artículo para calcular el CGI y lo actualiza automáticamente
   */
  @Post(':id/calcular-cgi')
  @HttpCode(HttpStatus.OK)
  async calcularYActualizarCgi(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ArticuloResponseDto> {
    return this.articulosService.calcularYActualizarCgi(id);
  }

  /**
   * Obtener proveedores asociados a un artículo específico
   * Devuelve todos los proveedores configurados para un artículo
   */
  @Get(':id/proveedores')
  async getProveedoresPorArticulo(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProveedorArticuloResponseDto[]> {
    return this.articulosService.getProveedoresPorArticulo(id);
  }

  /**
   * Ajustar inventario de un artículo
   * Permite modificar el stock actual sin generar órdenes de compra u otras acciones
   */
  @Patch(':id/ajustar-inventario')
  @HttpCode(HttpStatus.OK)
  async ajustarInventario(
    @Param('id', ParseIntPipe) id: number,
    @Body() ajuste: AjusteInventarioDto,
  ): Promise<ResultadoAjusteDto> {
    return this.articulosService.ajustarInventario(id, ajuste);
  }
}
