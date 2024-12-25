"use client"

import * as React from "react"
import { Label, Pie, PieChart } from "recharts"
import { TrendingUp } from "lucide-react"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface CircleNumberProps {
  data: Array<{
    categoria: string;
    valor: number;
  }>;
  config: {
    categories: string;
    y: string;
  };
}

const CATEGORY_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export default function CircleNumber({ data, config }: CircleNumberProps) {
  const processedData = React.useMemo(() => {
    return data.map((item: { categoria: string; valor: number }, index) => ({
      name: item.categoria,
      value: item.valor,
      fill: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
    }));
  }, [data]);

  const total = data.reduce((sum, item) => sum + item.valor, 0);

  const chartConfig = Object.fromEntries([
    ['value', { label: 'Valor' }],
    ...data.map((item, index) => [
      item.categoria,
      {
        label: item.categoria,
        color: CATEGORY_COLORS[index % CATEGORY_COLORS.length]
      }
    ])
  ]);

  return (
    <Card className="w-full h-full">
      <CardHeader className="items-center pb-2">
        <CardTitle>Ventas por Categoría</CardTitle>
        <CardDescription>Distribución actual</CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <PieChart width={400} height={300}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={processedData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              cx="50%"
              cy="50%"
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
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
                          ${total.toLocaleString()}
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
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Crecimiento del 5.2% este mes <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Mostrando ventas totales por categoría
        </div>
      </CardFooter>
    </Card>
  );
}
