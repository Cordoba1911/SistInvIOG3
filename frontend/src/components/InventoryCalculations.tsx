"use client"

import { useState } from "react"
import { Container, Tabs, Tab } from "react-bootstrap"
import { FixedLotModel } from "../pages/Cálculo de Modelos/FixedLotModel"
import { FixedIntervalModel } from "../pages/Cálculo de Modelos/FixedIntervalModel"
import { CGICalculation } from "../pages/Cálculo de Modelos/CGICalculation"

export function InventoryCalculations() {
  const [key, setKey] = useState<string>("fixed-lot")

  return (
    <Container className="py-4">
      <h2 className="mb-4">Cálculos de Inventario</h2>

      <Tabs
        id="inventory-calculations-tabs"
        activeKey={key}
        onSelect={(k) => setKey(k || "fixed-lot")}
        className="mb-4"
      >
        <Tab eventKey="fixed-lot" title="Modelo Lote Fijo">
          <FixedLotModel />
        </Tab>
        <Tab eventKey="fixed-interval" title="Modelo Intervalo Fijo">
          <FixedIntervalModel />
        </Tab>
        <Tab eventKey="cgi" title="Cálculo CGI">
          <CGICalculation />
        </Tab>
      </Tabs>
    </Container>
  )
}
