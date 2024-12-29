"use client"

import React, { useState } from 'react'
import RevenueCard from "@/app/charts/components/revenue-card"
import SalesCard from "@/app/charts/components/sales-card"
import LineChart from "@/app/charts/components/line-chart"
import CircleNumber from "@/app/charts/components/circle-number"
import AreaChartInteractive from "@/app/charts/components/area-chart-interactive"
import { Component as PieLegend } from "@/app/charts/components/pie-legend"
import { DashboardConfig } from "@/types/dashboard-types"

interface DS1Props {
  config: DashboardConfig;
  chartData: {
    revenueData: any;
    salesData: any;
    lineChartData: any;
    pieChartData: any;
    areaChartData: any;
  };
}

function TestPlayground({ config, chartData }: DS1Props) {
  const [selectedYear, setSelectedYear] = useState('2023')
  const availableYears = ['2023', '2024']

  const handleYearChange = (year: string) => {
    setSelectedYear(year)
  }

  console.log('DS-1 Template recibió:', {
    config,
    chartData,
    configKeys: config ? Object.keys(config) : [],
    chartDataKeys: Object.keys(chartData)
  })

  return (
    <div className="h-screen p-4">
      <div className="grid grid-cols-3 gap-4 h-[400px]">
        <div className="space-y-4">
          <RevenueCard 
            data={[{ value: chartData.revenueData ?? 0 }]}
            variable="value"
          />
          <SalesCard 
            data={[{ value: chartData.salesData ?? 0 }]}
            variable="value"
          />
        </div>

        <div className="h-full">
          <LineChart 
            data={chartData.lineChartData?.map((item: any) => ({
              date: item.mes,
              value: item.valor
            })) || []}
            variables={{
              x: 'date',
              y: ['value'],
              labels: { value: config?.["line-chart-label"]?.kpi || 'Ventas' }
            }}
            selectedYear={selectedYear}
            availableYears={availableYears}
            onYearChange={handleYearChange}
          />
        </div>

        <div className="h-full">
          <CircleNumber 
            data={Object.entries(chartData.pieChartData || {}).map(([category, valor]) => ({
              category,
              valor: valor as number
            }))}
            config={{
              category: 'category',
              y: 'valor'
            }}
          />
        </div>
      </div>

      <div className="mt-4 h-[400px] grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <AreaChartInteractive 
            data={chartData.areaChartData?.map((item: any) => ({
              date: item.date,
              valor: item.valor
            })) || []}
            variables={{
              x: 'date',
              y: ['valor'],
              labels: {
                label1: config?.["area-chart-interactive"]?.kpi || 'Ventas',
                label2: config?.["area-chart-interactive"]?.label || 'por Período'
              }
            }}
          />
        </div>
        <div>
          <PieLegend />
        </div>
      </div>
    </div>
  )
}

export default TestPlayground