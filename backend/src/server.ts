import { db } from './db'; 
import { crearProveedor } from './models/proveedor';
import { proveedoresRandom } from './data/proveedores';

async function testDbConnection() {
  try {
    // Conexión del pool
    const connection = await db.getConnection();

    // Consulta para probar
    const [rows] = await connection.query('SELECT 1 + 1 AS resultado');
    console.log('Conexión correcta. Resultado prueba:', rows);

    // Liberar la conexión de vuelta al pool
    connection.release();

  } catch (error) {
    console.error('Error conectando a la base de datos:', error);
  }
}

testDbConnection();


async function insertarProveedoresRandom() {
  for (const proveedor of proveedoresRandom) {
    const id = await crearProveedor(proveedor);
    if (id) {
      console.log(`Proveedor ${proveedor.nombre} creado con ID: ${id}`);
    } else {
      console.log(`Error al crear proveedor: ${proveedor.nombre}`);
    }
  }
}

insertarProveedoresRandom();
