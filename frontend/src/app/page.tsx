import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FixedLotModel } from "@/components/fixed-lot-model"
import { FixedIntervalModel } from "@/components/fixed-interval-model"
import { CGICalculation } from "@/components/cgi-calculation"

export default function InventoryCalculations() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Cálculos de Inventario</h1>

      <Tabs defaultValue="fixed-lot" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="fixed-lot">Modelo Lote Fijo</TabsTrigger>
          <TabsTrigger value="fixed-interval">Modelo Intervalo Fijo</TabsTrigger>
          <TabsTrigger value="cgi">Cálculo CGI</TabsTrigger>
        </TabsList>
        <TabsContent value="fixed-lot">
          <FixedLotModel />
        </TabsContent>
        <TabsContent value="fixed-interval">
          <FixedIntervalModel />
        </TabsContent>
        <TabsContent value="cgi">
          <CGICalculation />
        </TabsContent>
      </Tabs>
    </div>
  )
}
