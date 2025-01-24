"use client"

import { motion } from "framer-motion"
import { BarChart3, LineChart, PieChart, Plus } from "lucide-react"
import { useState } from "react"
import { LoadData } from "@/components/load_data"

export default function DataPlaygroundPage() {
  const [showLoadData, setShowLoadData] = useState(false)

  // Datos de ejemplo para los gráficos recientes
  const recentGraphs = [
    {
      title: "Ventas Mensuales",
      description: "Análisis de ventas por mes",
      type: "bar",
      date: "Hace 2 días",
      icon: BarChart3,
    },
    {
      title: "Tendencia de Usuarios",
      description: "Crecimiento de usuarios activos",
      type: "line",
      date: "Hace 3 días",
      icon: LineChart,
    },
    {
      title: "Distribución de Productos",
      description: "Categorías más vendidas",
      type: "pie",
      date: "Hace 5 días",
      icon: PieChart,
    },
  ]

  return (
    <>
      <div className="container py-6 space-y-8">
        {/* Primera fila: Gráficos recientes */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Gráficos Recientes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentGraphs.map((graph, index) => (
              <motion.div
                key={graph.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-lg shadow-sm border p-6 hover:border-primary transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <graph.icon className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground">{graph.date}</span>
                </div>
                <h3 className="font-semibold mb-2">{graph.title}</h3>
                <p className="text-sm text-muted-foreground">{graph.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Segunda fila: Botón Crear Graph */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Crear Nuevo Gráfico</h2>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-card border rounded-lg p-6 hover:border-primary transition-all cursor-pointer flex items-center justify-center gap-4"
            onClick={() => setShowLoadData(true)}
          >
            <div className="p-3 bg-primary/10 rounded-full">
              <Plus className="w-6 h-6 text-primary" />
            </div>
            <div className="text-center">
              <h3 className="font-semibold text-xl mb-2">Crear Graph</h3>
              <p className="text-sm text-muted-foreground">
                Sube tus datos y deja que la IA seleccione los mejores gráficos
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Componente LoadData como diálogo */}
      {showLoadData && (
        <LoadData onClose={() => setShowLoadData(false)} />
      )}
    </>
  )
} 