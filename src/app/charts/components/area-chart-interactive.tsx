"use client"

import * as React from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DataPoint {
  date: string;
  category: string;
  value: number;
  [key: string]: string | number; // Para otras propiedades dinámicas
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

export default function AreaChartInteractive({ data, variables }: AreaChartProps) {
  const [selectedPeriod, setSelectedPeriod] = React.useState("3")

  // Obtener categorías únicas
  const categories = React.useMemo(() => {
    if (!data?.length) return [];
    return [...new Set(data.map(item => item.category))];
  }, [data]);

  // Configurar colores para cada categoría
  const chartConfig = React.useMemo(() => {
    return categories.reduce((acc, category, index) => {
      acc[category] = {
        label: category,
        color: `hsl(var(--chart-${index + 1}))`
      };
      return acc;
    }, {} as ChartConfig);
  }, [categories]);

  // Filtrar datos según el período seleccionado
  const filteredData = React.useMemo(() => {
    if (!data || data.length === 0) return [];
    if (selectedPeriod === 'all') return data;

    const dates = data.map(item => new Date(item.date));
    const maxDate = new Date(Math.max(...dates.map(date => date.getTime())));
    const limitDate = new Date(maxDate);
    limitDate.setMonth(limitDate.getMonth() - parseInt(selectedPeriod));

    return data.filter(item => {
      const itemDate = new Date(item.date);
      return itemDate >= limitDate;
    });
  }, [data, selectedPeriod]);

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle>Tendencia de Ventas</CardTitle>
          <CardDescription>Ventas por categoría</CardDescription>
        </div>
        <Select defaultValue="3" onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Seleccionar período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Último mes</SelectItem>
            <SelectItem value="3">Últimos 3 meses</SelectItem>
            <SelectItem value="6">Últimos 6 meses</SelectItem>
            <SelectItem value="all">Todo</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)]">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <ResponsiveContainer>
            <AreaChart data={filteredData}>
              <defs>
                {categories.map((category, index) => (
                  <linearGradient
                    key={category}
                    id={`fill${category}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={`hsl(var(--chart-${index + 1}))`}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={`hsl(var(--chart-${index + 1}))`}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent />}
              />
              {categories.map((category, index) => (
                <Area
                  key={category}
                  type="monotone"
                  dataKey="value"
                  name={category}
                  fill={`url(#fill${category})`}
                  stroke={`hsl(var(--chart-${index + 1}))`}
                  fillOpacity={0.2}
                  strokeWidth={2}
                  stackId="1"
                />
              ))}
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
