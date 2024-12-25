"use client"

import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx'
import RevenueCard from "@/app/charts/components/revenue-card"
import SalesCard from "@/app/charts/components/sales-card"
import LineChart from "@/app/charts/components/line-chart"
import CircleNumber from "@/app/charts/components/circle-number"
import AreaChartInteractive from "@/app/charts/components/area-chart-interactive"

// Definir la interfaz para la respuesta de Flask
interface DashboardConfig {
  template_id: number;
  revenue_value: {
    kpi: string;
    variables: string[];
  };
  sales: {
    kpi: string;
    variables: string[];
  };
  "area-chart-interactive": {
    date: string;
    kpi: string;
    variables: string[];
    label: string;
  };
  "line-chart-label": {
    date: string;
    kpi: string;
    variables: string[];
  };
  "pie-chart-text": {
    categories: string;
    kpi: string;
    variables: string[];
  };
}

function TestPlayground() {
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig | null>(null);
  const [excelData, setExcelData] = useState<any[] | null>(null);
  const [revenueData, setRevenueData] = useState<number | null>(null);
  const [salesData, setSalesData] = useState<number | null>(null);
  const [lineChartData, setLineChartData] = useState<any[] | null>(null);
  const [pieChartData, setPieChartData] = useState<any | null>(null);
  const [areaChartData, setAreaChartData] = useState<any[] | null>(null);
  const [selectedYear, setSelectedYear] = useState('2023');
  const availableYears = ['2023', '2024']; // O calcularlos desde los datos

  // Función para enviar datos a Flask
  const sendDataToFlask = async (endpoint: string, data: any[]) => {
    try {
      // Transformar los datos al formato deseado
      const transformedData = data.reduce((acc, item) => {
        Object.entries(item).forEach(([key, value]) => {
          if (!acc[key]) {
            acc[key] = [];
          }
          // Convertir fechas de Excel a formato mes/dia/año
          if (key === 'Fecha Venta' || key === 'date') {
            // Convertir número de Excel a fecha JavaScript
            const date = new Date((value as number - 25569) * 86400 * 1000);
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const year = date.getFullYear();
            acc[key].push(`${month}/${day}/${year}`);
          } else {
            acc[key].push(value);
          }
        });
        return acc;
      }, {} as Record<string, any[]>);

      console.log(`Datos transformados para ${endpoint}:`, transformedData);

      const response = await fetch(`http://127.0.0.1:5000/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transformedData)
      });

      return await response.json();
    } catch (error) {
      console.error(`Error enviando datos a ${endpoint}:`, error);
      return null;
    }
  };

  // Cargar configuración y datos del Excel
  useEffect(() => {
    async function loadData() {
      try {
        // 1. Obtener configuración de Flask
        console.log('Haciendo petición a Flask...');
        
        const response = await fetch('http://127.0.0.1:4000/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: {} })
        });
        
        const config: DashboardConfig = await response.json();
        console.log('Respuesta de Flask:', {
          configCompleto: config,
          revenueVariables: config.revenue_value?.variables,
          salesVariables: config.sales?.variables,
          areaChartVariables: config["area-chart-interactive"]?.variables,
          lineChartVariables: config["line-chart-label"]?.variables,
          pieChartVariables: config["pie-chart-text"]?.variables
        });
        
        setDashboardConfig(config);

        // 2. Cargar Excel
        const excelResponse = await fetch('/data/Ventas_Minoristas_2023.xlsx');
        const arrayBuffer = await excelResponse.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet);
        setExcelData(data);

      } catch (error) {
        console.error('Error:', error);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    if (dashboardConfig && excelData) {
      const sendAllData = async () => {
        // Revenue Card
        const revenueData = excelData.map(row => 
          dashboardConfig.revenue_value.variables.reduce((acc, variable) => {
            acc[variable] = row[variable];
            return acc;
          }, {} as Record<string, any>)
        );
        console.log('Enviando a revenue_card:', revenueData);
        const revenueResponse = await sendDataToFlask('revenue_card', revenueData);
        setRevenueData(revenueResponse);

        // Sales Card
        const salesData = excelData.map(row => 
          dashboardConfig.sales.variables.reduce((acc, variable) => {
            acc[variable] = row[variable];
            return acc;
          }, {} as Record<string, any>)
        );
        console.log('Enviando a sales:', salesData);
        const salesResponse = await sendDataToFlask('sales', salesData);
        setSalesData(salesResponse);

        // Line Chart
        const lineChartData = excelData.map(row => ({
          date: row[dashboardConfig["line-chart-label"].date],
          ...dashboardConfig["line-chart-label"].variables.reduce((acc, variable) => {
            acc[variable] = row[variable];
            return acc;
          }, {} as Record<string, any>)
        }));
        console.log('Enviando a line-chart:', lineChartData);
        const lineResponse = await sendDataToFlask('line-chart', lineChartData);
        setLineChartData(lineResponse);

        // Pie Chart
        const pieChartData = excelData.map(row => ({
          category: row[dashboardConfig["pie-chart-text"].categories],
          ...dashboardConfig["pie-chart-text"].variables.reduce((acc, variable) => {
            acc[variable] = row[variable];
            return acc;
          }, {} as Record<string, any>)
        }));
        console.log('Enviando a Pie-chart:', pieChartData);
        const pieResponse = await sendDataToFlask('Pie-chart', pieChartData);
        setPieChartData(pieResponse);

        // Area Chart
        const areaChartData = excelData.map(row => ({
          date: row[dashboardConfig["area-chart-interactive"].date],
          ...dashboardConfig["area-chart-interactive"].variables.reduce((acc, variable) => {
            acc[variable] = row[variable];
            return acc;
          }, {} as Record<string, any>)
        }));
        console.log('Enviando a area-chart-interactive:', areaChartData);
        const areaResponse = await sendDataToFlask('area-chart-interactive', areaChartData);
        setAreaChartData(areaResponse);
      };

      sendAllData();
    }
  }, [dashboardConfig, excelData]);

  return (
    <div className="h-screen p-4">
      <div className="grid grid-cols-3 gap-4 h-[400px]">
        <div className="space-y-4">
          <RevenueCard 
            data={[{ value: revenueData ?? 0 }]} 
            variable="value"
          />
          <SalesCard 
            data={[{ value: salesData ?? 0 }]}
            variable="value"
          />
        </div>

        <div className="h-full">
          <LineChart 
            data={lineChartData?.map(item => ({
              date: item.fecha,
              value: item.valor
            })) || []}
            variables={{
              x: 'date',
              y: ['value'],
              labels: { value: 'Ventas' }
            }}
            selectedYear={selectedYear}
            availableYears={availableYears}
            onYearChange={setSelectedYear}
          />
        </div>

        <div className="h-full">
          <CircleNumber 
            data={pieChartData?.map((item: { categoria: string; valor: number }) => ({
              categoria: item.categoria,
              valor: item.valor
            })) || []}
            config={{
              categories: 'categoria',
              y: 'valor'
            }}
          />
        </div>
      </div>

      <div className="h-[300px] mt-4">
        <AreaChartInteractive 
          data={areaChartData || []}
          variables={{
            x: 'date',
            y: ['value'],
            labels: {
              label1: 'Ventas',
              label2: 'Tendencia'
            }
          }}
        />
      </div>
    </div>
  );
}

export default TestPlayground;