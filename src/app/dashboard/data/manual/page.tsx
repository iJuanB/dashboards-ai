"use client"

import { ManualGraphsGrid } from "@/components/manual-graphs-grid"
import { useEffect, useState } from "react"

export default function ManualGraphsPage() {
  const [graphData, setGraphData] = useState<Record<string, string[]>>({})
  const [numGraphs, setNumGraphs] = useState(4)
  const [numTemplates, setNumTemplates] = useState(1)

  // Obtener el número de gráficos de la URLZZ
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search)
    const graphsParam = searchParams.get("graphs")
    const templatesParam = searchParams.get("templates")
    
    if (graphsParam) {
      const parsedGraphs = parseInt(graphsParam)
      if (!isNaN(parsedGraphs)) {
        setNumGraphs(Math.max(4, parsedGraphs)) // Aseguramos mínimo 4 grids
      }
    }

    if (templatesParam) {
      const parsedTemplates = parseInt(templatesParam)
      if (!isNaN(parsedTemplates)) {
        setNumTemplates(parsedTemplates)
      }
    }
  }, [])

  // Simular datos que vendrían de FastAPI
  useEffect(() => {
    // Esto sería reemplazado por la llamada real a la API
    const mockData = {
      "1": ["28", "55", "43", "91", "81", "53", "19", "87", "52"],
      "2": [
        // Datos más espaciados para mejor visualización
        "20", "30",   // x1, y1
        "40", "45",   // x2, y2
        "60", "35",   // x3, y3
        "80", "60",   // x4, y4
        "100", "40",  // x5, y5
        "120", "55",  // x6, y6
        "140", "45",  // x7, y7
        "160", "65"   // x8, y8
      ],
      "3": [
        // Datos para el gráfico de línea temporal (valores ascendentes)
        "100", "120", "150", "140", "180", "200", "190", 
        "220", "210", "250", "240", "270", "300", "320"
      ],
      "4": [
        // Datos para el histograma (simulando ratings de películas)
        "6.5", "7.2", "8.1", "6.8", "7.5", "8.3", "7.8", "6.9",
        "7.1", "8.4", "7.7", "6.7", "7.9", "8.0", "7.3", "6.6",
        "7.4", "8.2", "7.6", "6.4", "7.0", "8.5", "7.8", "6.3",
        "8.6", "7.2", "6.8", "8.0", "7.5", "6.9"
      ]
    };
    setGraphData(mockData);
  }, []);

  return (
    <div className="h-full">
      <ManualGraphsGrid 
        numGraphs={numGraphs}
        numTemplates={numTemplates}
        graphData={graphData}
      />
    </div>
  )
} 