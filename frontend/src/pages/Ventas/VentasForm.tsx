import Form from '../../components/Form';
import type { Venta } from '../../routes/VentasRoute';
import { useNavigate } from 'react-router-dom';

interface PropsVentasForm {
  onAlta: (datos: Venta) => void;
}

const VentasForm = ({ onAlta }: PropsVentasForm) => {
    // Estado inicial del Formulario
    const campos = [
        { nombre: 'articulo', etiqueta: 'Articulo', requerido: true },
        { nombre: 'cantidad', etiqueta: 'Cantidad', tipo: 'number', requerido: true },
        { nombre: 'fecha_venta', etiqueta: 'Fecha de Venta', tipo: 'date' },
    ];
    
    // 📆 Función para obtener fecha actual en formato YYYY-MM-DD
    const obtenerFechaActual = (): string => {
        return new Date().toISOString().split('T')[0];
    };
    
    const valoresIniciales = {
        articulo: '',
        cantidad: '',
        fecha_venta: obtenerFechaActual(),
    };
    
    // Hook para redirigir después de guardar
    const navigate = useNavigate();
    
    // Función para manejar el envío del formulario
    const manejarEnvio = (datos: Record<string, string>) => {
        onAlta({
        id: '', // Valor temporal, el backend debería asignar el id real
        articulo: datos.articulo,
        cantidad: parseInt(datos.cantidad, 10) || 0, // Asegura que sea un número
        fecha_venta: datos.fecha_venta,
        });
    
        // Redirige al usuario a la lista de ventas después de guardar
        navigate('/ventas/admin-ventas'); // Redirige a la lista de ventas
    };
    
    return (
        <Form
        campos={campos}
        valoresIniciales={valoresIniciales}
        onSubmit={manejarEnvio}
        titulo="Agregar Venta"
        textoBoton="Enviar"
        />
    );
    }

export default VentasForm;