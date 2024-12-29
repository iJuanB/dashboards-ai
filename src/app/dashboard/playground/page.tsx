"use client"

import { useState } from "react"
import { SettingsDialog } from "@/components/load_data"
import { DashboardConfig } from "@/types/dashboard-types"
import Ds1 from "@/app/templates/ds-1"
import VentasCorreo from "@/app/templates/ventas-correo"

interface ChartData {
  revenueData: any;
  salesData: any;
  lineChartData: any;
  pieChartData: any;
  areaChartData: any;
}

export default function PlaygroundPage() {
  const [open, setOpen] = useState(true)
  const [config, setConfig] = useState<DashboardConfig | null>(null)
  const [chartData, setChartData] = useState<ChartData | null>(null)

  const handleDataProcessed = (newConfig: DashboardConfig, newChartData: ChartData) => {
    setConfig(newConfig)
    setChartData(newChartData)
    setOpen(false)
  }

  return (
    <div>
      <SettingsDialog 
        open={open} 
        onOpenChange={setOpen}
        onDataProcessed={handleDataProcessed}
      />
      {/* {config && chartData && (
        // <Ds1 
        //   config={config}
        //   chartData={chartData}
        // />
      )} */}
      <VentasCorreo />
    </div>
  )
}
