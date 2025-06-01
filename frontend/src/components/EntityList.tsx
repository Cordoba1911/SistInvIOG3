// src/components/EntityList.tsx
import { Table, Button, Badge, Image } from 'react-bootstrap';

interface Columna {
  campo: string;
  etiqueta: string;
}

interface PropsEntidadList<T> {
  titulo: string;
  datos: T[];
  columnas: Columna[];
  onEditar: (id: string) => void;
  onEliminar: (id: string) => void;
  campoId: string;
  campoActivo?: string;
}

const EntidadList = <T extends Record<string, any>>({
  titulo,
  datos,
  columnas,
  onEditar,
  onEliminar,
  campoId,
  campoActivo,
}: PropsEntidadList<T>) => {
  return (
    <div className="mt-5">
      <h3 className="mb-3">Lista de {titulo}</h3>
      <Table striped bordered hover responsive size="sm">
        <thead>
          <tr>
            {columnas.map((col) => (
              <th key={col.campo}>{col.etiqueta}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {datos.map((item) => (
            <tr
              key={item[campoId]}
              className={!item[campoActivo ?? 'activo'] ? 'text-muted' : ''}
            >
              {columnas.map((col) => {
                const valor = item[col.campo];
                
                return (
                  <td
                    key={col.campo}
                    style={{
                      wordBreak: 'break-word',
                      maxWidth: col.campo === 'imagen' ? '150px' : '200px',
                      whiteSpace: 'pre-wrap',
                      textAlign: 'center'
                    }}
                  >
                    {col.campo === 'imagen' && valor ? (
                      <Image
                        src={typeof valor === 'string' ? valor : URL.createObjectURL(valor)}
                        alt="imagen"
                        thumbnail
                        style={{ width: '80px', height: 'auto' }}
                      />
                    ) : col.campo === 'estado' ? (
                      <Badge bg={item[campoActivo ?? 'activo'] ? 'success' : 'secondary'}>
                        {valor}
                      </Badge>
                    ) : (
                      valor ?? '-'
                    )}
                  </td>
                );
              })}
              <td className="text-center">
                <Button variant="outline-primary" size="sm" onClick={() => onEditar(item[campoId])} className="me-2">
                  Editar
                </Button>
                <Button variant="outline-danger" size="sm" onClick={() => onEliminar(item[campoId])}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default EntidadList;

