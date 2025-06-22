
export const actualizarInventario = (producto: string, cantidad: number) => {
  // Aquí deberías conectar con backend o actualizar el estado global
  console.log(`✔️ Inventario actualizado: +${cantidad} unidades de "${producto}"`);
};

export const verificarPuntoDePedido = (producto: string) => {
  // Ejemplo: verificación mock
  console.log(`🔍 Verificando punto de pedido para "${producto}"...`);
};
