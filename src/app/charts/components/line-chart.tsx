"use client"

import { CartesianGrid, Line, LineChart as RechartsLineChart, XAxis, YAxis, LabelList } from "recharts"
import { ChartProps } from "@/types/chart-types"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp } from 'lucide-react'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartConfig = {
  desktop: {
    label: "Ventas",
    color: "hsl(217, 91%, 60%)",
  },
}

export default function LineChart({ 
  data, 
  variables,
  selectedYear,
  availableYears,
  onYearChange 
}: ChartProps & {
  selectedYear: string;
  availableYears: string[];
  onYearChange: (year: string) => void;
}) {
  return (
    <Card className="w-full h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Análisis de Ventas</CardTitle>
            <CardDescription>{`${variables.x} vs ${variables.y.join(', ')}`}</CardDescription>
          </div>
          <Select value={selectedYear} onValueChange={onYearChange}>
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
            data={data}
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
            <Line
              type="monotone"
              dataKey={variables.y[0]}
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
  )
}
