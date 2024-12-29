"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DataPoint {
  date: string;
  valor: number;
}

interface AreaChartProps {
  data: DataPoint[];
  variables: {
    x: string;
    y: string[];
    labels: {
      label1: string;
      label2: string;
    };
  };
}

const chartConfig = {
  valor: {
    label: "Valor",
    color: "hsl(var(--chart-1))"
  }
} satisfies ChartConfig

export default function AreaChartInteractive({ data, variables }: AreaChartProps) {
  const [timeRange, setTimeRange] = React.useState("90d")

  console.log('AreaChart recibió:', {
    rawData: data,
    firstItem: data?.[0],
    dataLength: data?.length
  });

  const filteredData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const processedData = data.map(item => ({
      date: item.date,
      valor: Number(item.valor)
    }));

    const dates = processedData.map(item => new Date(item.date));
    const maxDate = new Date(Math.max(...dates.map(date => date.getTime())));
    let daysToSubtract = 90;
    
    if (timeRange === "30d") daysToSubtract = 30;
    else if (timeRange === "7d") daysToSubtract = 7;
    
    const startDate = new Date(maxDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);

    const filtered = processedData.filter(item => new Date(item.date) >= startDate);

    console.log('Datos filtrados:', {
      filtered,
      firstFilteredItem: filtered[0],
      filteredLength: filtered.length
    });

    return filtered;
  }, [data, timeRange]);

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{variables.labels.label1}</CardTitle>
          <CardDescription>{variables.labels.label2}</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
            <SelectValue placeholder="Últimos 3 meses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="90d">Últimos 3 meses</SelectItem>
            <SelectItem value="30d">Últimos 30 días</SelectItem>
            <SelectItem value="7d">Últimos 7 días</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <ResponsiveContainer>
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillValor" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-valor)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-valor)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  return date.toLocaleDateString("es-ES", {
                    month: "short",
                    day: "numeric",
                  })
                }}
              />
              <YAxis 
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("es-ES", {
                        month: "short",
                        day: "numeric",
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="valor"
                type="monotone"
                fill="url(#fillValor)"
                stroke="var(--color-valor)"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
