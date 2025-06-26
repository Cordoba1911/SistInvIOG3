import { useState } from "react";
import Form, { type CampoFormulario } from "../../components/Formularios/Form";
import { articulosService } from "../../services/articulosService";
import { useNavigate } from "react-router-dom";

interface PropsCalculoModelosForm {
  tipoCalculo: "lote_fijo" | "periodo_fijo" | "cgi";
  onCalculo?: (resultado: any) => void;
}

const CalculoModelosForm = ({
  tipoCalculo,
  onCalculo,
}: PropsCalculoModelosForm) => {
  const navigate = useNavigate();

  const getCamposLoteFijo = (): CampoFormulario[] => [
    {
      nombre: "demanda",
      etiqueta: "Demanda Anual",
      tipo: "number",
      requerido: true,
      min: 1,
      step: 1,
      placeholder: "Demanda anual en unidades",
    },
    {
      nombre: "costo_orden",
      etiqueta: "Costo de Orden",
      tipo: "number",
      requerido: true,
      min: 0,
      step: 0.01,
      placeholder: "Costo fijo por pedido",
    },
    {
      nombre: "costo_mantenimiento",
      etiqueta: "Costo de Mantenimiento (%)",
      tipo: "number",
      requerido: true,
      min: 0,
      max: 100,
      step: 0.1,
      placeholder: "Porcentaje del costo unitario",
    },
    {
      nombre: "costo_unitario",
      etiqueta: "Costo Unitario",
      tipo: "number",
      requerido: true,
      min: 0,
      step: 0.01,
      placeholder: "Costo por unidad",
    },
    {
      nombre: "tiempo_entrega",
      etiqueta: "Tiempo de Entrega (días)",
      tipo: "number",
      requerido: true,
      min: 0,
      step: 1,
      placeholder: "Días de entrega",
    },
    {
      nombre: "dias_laborables",
      etiqueta: "Días Laborables por Año",
      tipo: "number",
      requerido: true,
      min: 1,
      max: 365,
      step: 1,
      placeholder: "Días laborables anuales",
    },
    {
      nombre: "nivel_servicio",
      etiqueta: "Nivel de Servicio (%)",
      tipo: "number",
      requerido: true,
      min: 0,
      max: 100,
      step: 0.1,
      placeholder: "Porcentaje de nivel de servicio",
    },
    {
      nombre: "desviacion_demanda",
      etiqueta: "Desviación Estándar de Demanda",
      tipo: "number",
      requerido: true,
      min: 0,
      step: 0.1,
      placeholder: "Desviación estándar diaria",
    },
  ];

  const getCamposPeriodoFijo = (): CampoFormulario[] => [
    {
      nombre: "demanda_promedio_diaria",
      etiqueta: "Demanda Promedio Diaria",
      tipo: "number",
      requerido: true,
      min: 0,
      step: 0.1,
      placeholder: "Demanda promedio por día",
    },
    {
      nombre: "tiempo_entrega",
      etiqueta: "Tiempo de Entrega (días)",
      tipo: "number",
      requerido: true,
      min: 0,
      step: 1,
      placeholder: "Días de entrega",
    },
    {
      nombre: "intervalo_revision",
      etiqueta: "Intervalo de Revisión (días)",
      tipo: "number",
      requerido: true,
      min: 1,
      step: 1,
      placeholder: "Días entre revisiones",
    },
    {
      nombre: "nivel_servicio",
      etiqueta: "Nivel de Servicio (%)",
      tipo: "number",
      requerido: true,
      min: 0,
      max: 100,
      step: 0.1,
      placeholder: "Porcentaje de nivel de servicio",
    },
    {
      nombre: "desviacion_demanda",
      etiqueta: "Desviación Estándar de Demanda",
      tipo: "number",
      requerido: true,
      min: 0,
      step: 0.1,
      placeholder: "Desviación estándar diaria",
    },
  ];

  const getCamposCGI = (): CampoFormulario[] => [
    {
      nombre: "demanda_anual",
      etiqueta: "Demanda Anual",
      tipo: "number",
      requerido: true,
      min: 0,
      step: 1,
      placeholder: "Demanda anual del artículo",
    },
    {
      nombre: "costo_compra",
      etiqueta: "Costo de Compra ($)",
      tipo: "number",
      requerido: true,
      min: 0,
      step: 0.01,
      placeholder: "Costo unitario de compra",
    },
    {
      nombre: "costo_almacenamiento",
      etiqueta: "Costo de Almacenamiento ($)",
      tipo: "number",
      requerido: true,
      min: 0,
      step: 0.01,
      placeholder: "Costo de almacenamiento por unidad",
    },
    {
      nombre: "costo_pedido",
      etiqueta: "Costo de Pedido ($)",
      tipo: "number",
      requerido: true,
      min: 0,
      step: 0.01,
      placeholder: "Costo fijo por pedido",
    },
    {
      nombre: "modelo_inventario",
      etiqueta: "Modelo de Inventario",
      tipo: "select",
      requerido: true,
      opciones: [
        { valor: "lote_fijo", etiqueta: "Lote Fijo (EOQ)" },
        { valor: "periodo_fijo", etiqueta: "Período Fijo" },
      ],
    },
    {
      nombre: "intervalo_revision",
      etiqueta: "Intervalo de Revisión (días)",
      tipo: "number",
      requerido: false,
      min: 0,
      step: 1,
      placeholder: "Días entre revisiones",
      descripcion: "Obligatorio para modelo Período Fijo",
    },
    {
      nombre: "lote_optimo",
      etiqueta: "Lote Óptimo",
      tipo: "number",
      requerido: false,
      min: 0,
      step: 1,
      placeholder: "Lote óptimo calculado",
      descripcion: "Opcional - se calcula automáticamente si no se proporciona",
    },
    {
      nombre: "inventario_maximo",
      etiqueta: "Inventario Máximo",
      tipo: "number",
      requerido: false,
      min: 0,
      step: 1,
      placeholder: "Inventario máximo",
      descripcion: "Opcional para modelo Período Fijo",
    },
  ];

  const getCampos = (): CampoFormulario[] => {
    switch (tipoCalculo) {
      case "lote_fijo":
        return getCamposLoteFijo();
      case "periodo_fijo":
        return getCamposPeriodoFijo();
      case "cgi":
        return getCamposCGI();
      default:
        return [];
    }
  };

  const getValoresIniciales = () => {
    switch (tipoCalculo) {
      case "lote_fijo":
        return {
          demanda: undefined,
          costo_orden: undefined,
          costo_mantenimiento: undefined,
          costo_unitario: undefined,
          tiempo_entrega: undefined,
          dias_laborables: 250,
          nivel_servicio: 95,
          desviacion_demanda: undefined,
        };
      case "periodo_fijo":
        return {
          demanda_promedio_diaria: undefined,
          tiempo_entrega: undefined,
          intervalo_revision: undefined,
          nivel_servicio: 95,
          desviacion_demanda: undefined,
        };
      case "cgi":
        return {
          demanda_anual: undefined,
          costo_compra: undefined,
          costo_almacenamiento: undefined,
          costo_pedido: undefined,
          modelo_inventario: undefined,
          intervalo_revision: undefined,
          lote_optimo: undefined,
          inventario_maximo: undefined,
        };
      default:
        return {};
    }
  };

  const getTitulo = (): string => {
    switch (tipoCalculo) {
      case "lote_fijo":
        return "Cálculo Modelo de Lote Fijo (EOQ)";
      case "periodo_fijo":
        return "Cálculo Modelo de Período Fijo";
      case "cgi":
        return "Cálculo CGI (Costo de Gestión del Inventario)";
      default:
        return "Cálculo de Modelo";
    }
  };

  const getTextoBoton = (): string => {
    switch (tipoCalculo) {
      case "lote_fijo":
        return "Calcular Lote Fijo";
      case "periodo_fijo":
        return "Calcular Período Fijo";
      case "cgi":
        return "Calcular CGI";
      default:
        return "Calcular";
    }
  };

  const manejarEnvio = async (datos: Record<string, any>) => {
    try {
      let resultado;

      switch (tipoCalculo) {
        case "lote_fijo":
          resultado = await articulosService.calcularLoteFijo(datos);
          break;
        case "periodo_fijo":
          resultado = await articulosService.calcularIntervaloFijo(datos);
          break;
        case "cgi":
          resultado = await articulosService.calcularCGI(datos);
          break;
        default:
          throw new Error("Tipo de cálculo no válido");
      }

      if (onCalculo) {
        onCalculo(resultado);
      }

      // Mostrar resultado
      alert(
        `Cálculo completado exitosamente. Resultado: ${JSON.stringify(
          resultado,
          null,
          2
        )}`
      );

      // Redirigir a la página de modelos
      navigate("/modelos");
    } catch (error) {
      console.error("Error al realizar cálculo:", error);
      alert("Error al realizar el cálculo. Por favor, intente nuevamente.");
    }
  };

  return (
    <Form
      campos={getCampos()}
      valoresIniciales={getValoresIniciales()}
      onSubmit={manejarEnvio}
      titulo={getTitulo()}
      textoBoton={getTextoBoton()}
    />
  );
};

export default CalculoModelosForm;
