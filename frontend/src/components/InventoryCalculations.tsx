"use client"

import { Container, Alert } from "react-bootstrap"

export function InventoryCalculations() {
  return (
    <Container className="py-4">
      <h2 className="mb-4">Cálculos de Inventario</h2>
      
      <Alert variant="info">
        <Alert.Heading>📊 Funcionalidades de Cálculo</Alert.Heading>
        <p>
          Los cálculos de inventario están disponibles directamente en la gestión de artículos:
        </p>
        <ul className="mb-0">
          <li><strong>Artículos</strong> → Crear/Editar artículo → Configurar modelo de inventario</li>
          <li><strong>Productos a Reponer</strong> → Ver artículos que necesitan reposición</li>
          <li><strong>Productos Faltantes</strong> → Ver artículos con stock bajo</li>
          <li><strong>Ajuste de Inventario</strong> → Modificar stock actual</li>
        </ul>
      </Alert>
    </Container>
  )
}
