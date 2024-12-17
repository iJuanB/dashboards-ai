"use client"

import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import { CartesianGrid, Line, LineChart as RechartsLineChart, XAxis, YAxis, LabelList, PieChart, Pie, Label } from "recharts"
import { ChartDataPoint } from '@/types/chart-types'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface APIResponse {
  success: boolean
  result: {
    x: string
    y: string
  }
}

const chartConfig = {
  desktop: {
    label: "Ventas",
    color: "hsl(217, 91%, 60%)",
  },
} 

function TestPlayground() {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([])
  const [filteredData, setFilteredData] = useState<ChartDataPoint[]>([])
  const [selectedYear, setSelectedYear] = useState<string>('2022')
  const [availableYears, setAvailableYears] = useState<string[]>([])
  const [variables, setVariables] = useState<{
    x: string, 
    y: string[], 
    labels: { [key: string]: string }
  }>({ 
    x: '', 
    y: [], 
    labels: {} 
  })

  useEffect(() => {
    async function processData() {
      try {
        
        const flaskResponse = await fetch('http://192.168.20.8:5000/analyze_dashboard', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: {} })
        })

        const response = await fetch('/data/db.xlsx')
        const arrayBuffer = await response.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: 'array' })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        let jsonData = XLSX.utils.sheet_to_json(firstSheet)

        // Limpiar nombres de columnas
        jsonData = jsonData.map(row => {
          const cleanRow: Record<string, unknown> = {}
          Object.entries(row as Record<string, unknown>).forEach(([key, value]) => {
            const cleanKey = key.trim().replace(/[" ]/g, '')
            cleanRow[cleanKey] = value
          })
          return cleanRow
        })

        console.log('Datos del Excel:', jsonData)

        // Llamada a Flask

        const data: APIResponse = await flaskResponse.json()
        console.log('Respuesta de Flask:', data)

        if (data.success) {
          setChartData(jsonData as ChartDataPoint[])
          setVariables({
            x: data.result.x,
            y: [data.result.y],
            labels: { [data.result.y]: "Ventas" }
          })

          // Extraer años únicos directamente
          const years = [...new Set((jsonData as Record<string, unknown>[]).map(item => 
            item.año?.toString()
          ))].filter((year): year is string => year !== undefined).sort()
          
          setAvailableYears(years)
          setSelectedYear(years[0])
        }

      } catch (error) {
        console.error('Error processing data:', error)
      }
    }

    processData()
  }, [])

  // Filtrar datos cuando cambie el año seleccionado
  useEffect(() => {
    if (chartData.length > 0 && selectedYear) {
      const filtered = chartData.filter(item => 
        item.año?.toString() === selectedYear
      )
      setFilteredData(filtered)
    }
  }, [chartData, selectedYear])

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Análisis de Ventas</CardTitle>
              <CardDescription>{`${variables.x} vs ${variables.y.join(', ')}`}</CardDescription>
            </div>
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecciona un año" />
              </SelectTrigger>
              <SelectContent>
                {availableYears.map(year => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig}>
            <RechartsLineChart
              data={filteredData}
              margin={{ top: 20, left: 40, right: 20, bottom: 20 }}
              height={350}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey={variables.x}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.toString().slice(0, 3)}
              />
              <YAxis />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              {variables.y.map((variable, index) => (
                <Line
                  key={variable}
                  type="monotone"
                  dataKey={variable}
                  name={variables.labels?.[variable] || variable}
                  stroke="hsl(217, 91%, 60%)"
                  strokeWidth={3}
                  dot={{
                    fill: "hsl(217, 91%, 60%)",
                    r: 4,
                  }}
                  activeDot={{
                    r: 6,
                    fill: "hsl(217, 91%, 60%)",
                  }}
                >
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Line>
              ))}
            </RechartsLineChart>
          </ChartContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm">
          <div className="flex gap-2 font-medium leading-none">
            Tendencia al alza <TrendingUp className="h-4 w-4" />
          </div>
          <div className="leading-none text-muted-foreground">
            Mostrando datos para el año {selectedYear}
          </div>
        </CardFooter>
      </Card>

      <Card data-chart="pie-interactive">
        <CardHeader className="flex-row items-start space-y-0 pb-0">
          <div className="grid gap-1">
            <CardTitle>Distribución de Ventas</CardTitle>
            <CardDescription>{`${variables.x} - ${selectedYear}`}</CardDescription>
          </div>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="ml-auto h-7 w-[130px] rounded-lg pl-2.5">
              <SelectValue placeholder="Seleccionar año" />
            </SelectTrigger>
            <SelectContent align="end" className="rounded-xl">
              {availableYears.map((year) => (
                <SelectItem key={year} value={year} className="rounded-lg">
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent className="flex flex-1 justify-center pb-0">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square w-full max-w-[300px]"
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                data={filteredData}
                dataKey={variables.y[0]}
                nameKey={variables.x}
                innerRadius={60}
                strokeWidth={5}
                fill="hsl(217, 91%, 60%)"
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      const total = filteredData.reduce(
                        (sum, item) => sum + Number(item[variables.y[0]]), 
                        0
                      )
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-3xl font-bold"
                          >
                            {total.toLocaleString()}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Total Ventas
                          </tspan>
                        </text>
                      )
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default TestPlayground