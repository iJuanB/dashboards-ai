"use client"

import { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import AreaChartInteractive from "@/app/charts/components/area-chart-interactive"
import LineChart from "@/app/charts/components/line-chart"
import RadialChart from "@/app/charts/components/radia-chart"
import CircleNumber from "@/app/charts/components/circle-number"
import { ChartDataPoint } from '@/types/chart-types'

interface APIResponse {
  success: boolean
  result: {
    x: string
    y: string
  }
}

export default function DS1() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [variables, setVariables] = useState<{x: string, y: string[]}>({ x: '', y: [] })

  useEffect(() => {
    async function processData() {
      try {
        // 1. Cargar el Excel
        const response = await fetch('/data/1000-Registros-de-ventas.xlsx')
        const arrayBuffer = await response.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const jsonData = XLSX.utils.sheet_to_json(firstSheet)

        // 2. Enviar datos al servidor Flask
        const flaskResponse = await fetch('http://192.168.20.8:5000/analyze_dashboard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: jsonData })
        })

        const data: APIResponse = await flaskResponse.json()
        
        if (data.success) {
          setChartData(jsonData as ChartDataPoint[])
          setVariables({
            x: data.result.x,
            y: [data.result.y]
          })
        }
      } catch (error) {
        console.error('Error processing data:', error)
      }
    }

    processData()
  }, [])

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <LineChart 
          data={chartData}
          variables={{
            x: variables.x,
            y: variables.y,
            labels: {
              [variables.y[0]]: "Variable Y"
            }
          }}
          title="Análisis de Datos"
          description={`${variables.x} vs ${variables.y.join(', ')}`}
        />
        <RadialChart />
        <CircleNumber />
      </div>
      <div>
        <AreaChartInteractive 
          data={chartData}
          variables={{
            x: variables.x,
            y: variables.y,
            labels: {
              [variables.y[0]]: "Variable Y"
            }
          }}
          title="Análisis Temporal"
          description="Evolución de variables en el tiempo"
        />
      </div>
    </div>
  )
}
