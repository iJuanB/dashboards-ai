"use client"

import { LoadData } from "@/components/load_data"
import { motion } from "framer-motion"

export default function CrearGraficoPage() {
  return (
    <div className="container py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto"
      >
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Crear Gráfico</h1>
          <p className="text-muted-foreground mt-2">
            Sube tus datos y la IA seleccionará los mejores gráficos para visualizarlos
          </p>
        </div>

        <LoadData />
      </motion.div>
    </div>
  )
} 