"use client"

import * as React from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface DataPoint {
  date: string;
  [key: string]: string | number; // Para las categorías dinámicas
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
  const [selectedPeriod, setSelectedPeriod] = React.useState("3m")
  const categories = Object.keys(data[0] || {}).filter(key => key !== 'date');

  // Ordenar los datos por fecha primero
  const sortedData = React.useMemo(() => {
    return [...data].sort((a, b) => {
      const dateA = new Date(a.date.split('/').reverse().join('-'));
      const dateB = new Date(b.date.split('/').reverse().join('-'));
      return dateA.getTime() - dateB.getTime();
    });
  }, [data]);

  const filteredData = React.useMemo(() => {
    if (selectedPeriod === 'all') return sortedData;

    // Obtener la fecha más reciente del dataset
    const dates = sortedData.map(item => {
      const [month, day, year] = item.date.split('/');
      return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    });

    const maxDate = new Date(Math.max(...dates.map(date => date.getTime())));
    const monthsToSubtract = parseInt(selectedPeriod);
    
    // Calcular la fecha límite
    const limitDate = new Date(maxDate);
    limitDate.setMonth(limitDate.getMonth() - monthsToSubtract);

    return sortedData.filter(item => {
      const [month, day, year] = item.date.split('/');
      const itemDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      return itemDate >= limitDate;
    });
  }, [sortedData, selectedPeriod]);

  const chartConfig = Object.fromEntries(
    categories.map(category => [
      category,
      {
        label: category,
        color: `hsl(var(--chart-${categories.indexOf(category) + 1}))`
      }
    ])
  );

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const formatXAxis = (dateStr: string) => {
    const [month] = dateStr.split('/');
    return monthNames[parseInt(month) - 1];
  };

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
        <div className="w-full h-full">
          <ChartContainer config={chartConfig} className="w-full h-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart 
                data={filteredData} 
                margin={{ top: 10, right: 30, left: 50, bottom: 10 }}
              >
                <XAxis
                  dataKey="date"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={formatXAxis}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip />
                {categories.map((category) => (
                  <Area
                    key={category}
                    type="monotone"
                    dataKey={category}
                    stroke={`hsl(var(--chart-${categories.indexOf(category) + 1}))`}
                    fill={`hsl(var(--chart-${categories.indexOf(category) + 1}))`}
                    fillOpacity={0.2}
                    strokeWidth={2}
                    stackId="1"
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
