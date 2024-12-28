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
    category: string;
    kpi: string;
    variables: string[];
  };
}

// Función para procesar los datos en formato de arrays
function processData(data: any[]) {
  if (!data || data.length === 0) return {};
  
  // Obtener todas las claves excepto 'date'
  const keys = Object.keys(data[0]);
  
  // Crear objeto con arrays vacíos para cada clave
  const result: Record<string, any[]> = {};
  keys.forEach(key => {
    result[key] = [];
  });
  
  // Llenar los arrays con los valores
  data.forEach(item => {
    keys.forEach(key => {
      result[key].push(item[key]);
    });
  });
  
  return result;
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
  async function sendDataToFlask(endpoint: string, data: any) {
    try {
      const response = await fetch(`http://127.0.0.1:5000/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error sending data to Flask:', error);
      return null;
    }
  }

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
        // Función para convertir fecha de Excel
        const convertExcelDate = (excelDate: number) => {
          const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
          const month = String(jsDate.getMonth() + 1).padStart(2, '0');
          const day = String(jsDate.getDate()).padStart(2, '0');
          const year = jsDate.getFullYear();
          return `${month}/${day}/${year}`;
        };

        // Revenue Card - Como estaba antes
        const revenueData = excelData.map(row => 
          dashboardConfig.revenue_value.variables.reduce((acc, variable) => {
            acc[variable] = row[variable];
            return acc;
          }, {} as Record<string, any>)
        );
        const processedRevenueData = processData(revenueData);
        const revenueResponse = await sendDataToFlask('revenue', processedRevenueData);
        setRevenueData(revenueResponse);

        // Sales Card - Como estaba antes
        const salesData = excelData.map(row => 
          dashboardConfig.sales.variables.reduce((acc, variable) => {
            acc[variable] = row[variable];
            return acc;
          }, {} as Record<string, any>)
        );
        const processedSalesData = processData(salesData);
        const salesResponse = await sendDataToFlask('sales', processedSalesData);
        setSalesData(salesResponse);

        // Line Chart - Enviar TODAS las variables
        const lineChartData = excelData.map(row => ({
          date: convertExcelDate(row[dashboardConfig["line-chart-label"].date]),
          ...dashboardConfig["line-chart-label"].variables.reduce((acc, variable) => {
            acc[variable] = row[variable];
            return acc;
          }, {} as Record<string, any>)
        }));
        const processedLineData = processData(lineChartData);
        const lineResponse = await sendDataToFlask('lineal', processedLineData);
        setLineChartData(lineResponse);

        // Pie Chart - Enviar TODAS las variables
        const pieChartData = excelData.map(row => ({
          category: row[dashboardConfig["pie-chart-text"].category],
          ...dashboardConfig["pie-chart-text"].variables.reduce((acc, variable) => {
            acc[variable] = row[variable];
            return acc;
          }, {} as Record<string, any>)
        }));
        const processedPieData = processData(pieChartData);
        console.log('Datos procesados para pie-chart:', processedPieData);
        const pieResponse = await sendDataToFlask('pie', processedPieData);
        setPieChartData(pieResponse);

        // Area Chart - Enviar TODAS las variables
        const areaChartData = excelData.map(row => ({
          date: convertExcelDate(row[dashboardConfig["area-chart-interactive"].date]),
          category: row[dashboardConfig["pie-chart-text"].category],
          ...dashboardConfig["area-chart-interactive"].variables.reduce((acc, variable) => {
            acc[variable] = row[variable];
            return acc;
          }, {} as Record<string, any>)
        }));
        const processedAreaData = processData(areaChartData);
        console.log('Datos procesados para area-chart:', processedAreaData);
        const areaResponse = await sendDataToFlask('area', processedAreaData);
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
              date: item.mes,
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
            data={Object.entries(pieChartData || {}).map(([category, valor]) => ({
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

      <div className="h-[300px] mt-4">
        <AreaChartInteractive 
          data={excelData?.map((row, index) => {
            // Convertir el número de Excel a fecha
            const excelDate = row[dashboardConfig?.["area-chart-interactive"]?.date || ''];
            const jsDate = new Date((excelDate - 25569) * 86400 * 1000);
            const month = String(jsDate.getMonth() + 1).padStart(2, '0');
            const day = String(jsDate.getDate()).padStart(2, '0');
            const year = jsDate.getFullYear();
            
            return {
              date: `${month}/${day}/${year}`,
              category: row["Categoria Producto"],
              value: areaChartData?.[index] || 0
            };
          }) || []}
          variables={{
            x: 'date',
            y: ['valor'],
            labels: {
              label1: dashboardConfig?.["area-chart-interactive"]?.label || 'Ventas',
              label2: 'Tendencia'
            }
          }}
        />
      </div>
    </div>
  );
}

export default TestPlayground;