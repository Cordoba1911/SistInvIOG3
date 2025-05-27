import { db } from '../db';

export interface Proveedor {
  nombre: string;
  telefono?: string | null;
  email?: string | null;
  estado?: boolean;
  fecha_baja?: Date | null;
}

export async function crearProveedor(proveedor: Proveedor): Promise<number | null> {
  try {
    const { nombre, telefono = null, email = null, estado = true, fecha_baja = null } = proveedor;

    const query = `
      INSERT INTO proveedores (nombre, telefono, email, estado, fecha_baja)
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await db.execute(query, [nombre, telefono, email, estado, fecha_baja]);

    // El resultado es un objeto con insertId (id generado)
    return (result as any).insertId;
  } catch (error) {
    console.error('Error al crear proveedor:', error);
    return null;
  }
}
