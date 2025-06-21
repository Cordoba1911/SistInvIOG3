import { Table } from 'react-bootstrap';
import React from 'react';
import type { Venta } from '../../types/venta';

interface VentasListProps {
  ventas: Venta[];
}

const VentasList = ({ ventas }: VentasListProps) => {
  return (
    <div>
      <h3 className="mb-4">Listado de Ventas</h3>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>ID Venta</th>
            <th>Fecha</th>
            <th>Artículo</th>
            <th className="text-end">Cantidad</th>
            <th className="text-end">P. Unit.</th>
            <th className="text-end">Subtotal</th>
            <th className="text-end">Total Venta</th>
          </tr>
        </thead>
        <tbody>
          {ventas.map((venta) => (
            <React.Fragment key={venta.id}>
              {venta.detalle_venta.length > 0 ? (
                venta.detalle_venta.map((detalle, index) => {
                  const precioUnitario = Number(detalle.articulo?.precio_venta || 0);
                  const subtotal = Number(detalle.cantidad * precioUnitario);
                  const totalVenta = Number(venta.detalle_venta.reduce((sum, d) => sum + (d.cantidad * (d.articulo?.precio_venta ?? 0)), 0));

                  return (
                    <tr key={detalle.id}>
                      {index === 0 && (
                        <>
                          <td rowSpan={venta.detalle_venta.length} style={{ verticalAlign: 'middle' }}>{venta.id}</td>
                          <td rowSpan={venta.detalle_venta.length} style={{ verticalAlign: 'middle' }}>{new Date(venta.fecha_venta).toLocaleDateString()}</td>
                        </>
                      )}
                      
                      <td>{detalle.articulo?.nombre || 'Artículo no encontrado'}</td>
                      <td className="text-end">{detalle.cantidad}</td>
                      <td className="text-end">{`$${precioUnitario.toFixed(2)}`}</td>
                      <td className="text-end">{`$${subtotal.toFixed(2)}`}</td>

                      {index === 0 && (
                        <td rowSpan={venta.detalle_venta.length} className="text-end" style={{ verticalAlign: 'middle' }}>{`$${totalVenta.toFixed(2)}`}</td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr key={`${venta.id}-empty`}>
                  <td>{venta.id}</td>
                  <td>{new Date(venta.fecha_venta).toLocaleDateString()}</td>
                  <td colSpan={4}>Esta venta no tiene artículos.</td>
                  <td className="text-end">$0.00</td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default VentasList;