"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartDataPoint } from "@/types/chart-types"

interface SalesCardProps {
  data: ChartDataPoint[]
  variable: string
}

export default function SalesCard({ data, variable }: SalesCardProps) {
  const total = data.reduce((sum, item) => 
    sum + (Number(item[variable]) || 0), 
    0
  )

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Sales</CardTitle>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="h-4 w-4 text-muted-foreground"
        >
          <rect width="20" height="14" x="2" y="5" rx="2" />
          <path d="M2 10h20" />
        </svg>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">+{total.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">
          +19% from last month
        </p>
      </CardContent>
    </Card>
  )
} 