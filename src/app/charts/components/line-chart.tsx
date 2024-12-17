"use client"

import { CartesianGrid, Line, LineChart as RechartsLineChart, XAxis, YAxis, Tooltip } from "recharts"
import { ChartProps } from "@/types/chart-types"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LineChart({ data, variables, title, description }: ChartProps) {
  console.log('LineChart Props:', {
    data,
    variables,
    dataLength: data?.length,
    firstItem: data?.[0]
  })

  if (!data?.length || !variables.x || !variables.y.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Cargando datos...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title || "Line Chart"}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <RechartsLineChart
          data={data}
          margin={{ top: 20, left: 40, right: 20, bottom: 20 }}
          width={500}
          height={250}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={variables.x}
            tickLine={false}
            axisLine={true}
            tickMargin={8}
          />
          <YAxis />
          <Tooltip />
          {variables.y.map((variable: string, index: number) => (
            <Line
              key={variable}
              type="monotone"
              dataKey={variable}
              name={variables.labels?.[variable] || variable}
              stroke={`hsl(${index * 60}, 70%, 50%)`}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </RechartsLineChart>
      </CardContent>
    </Card>
  )
}
