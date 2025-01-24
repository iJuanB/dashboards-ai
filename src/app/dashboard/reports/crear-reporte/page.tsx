"use client"

import { useState } from 'react'
import { ChatInterface } from "@/app/charts/components/chat-interface"
import { PDFViewer } from "@/app/charts/components/pdf-viewer"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2 } from "lucide-react"

export default function CrearReportePage() {
  const [showPDF, setShowPDF] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<string>("")

  const handleSendMessage = async (message: string) => {
    setIsGenerating(true)
    // Simulamos un tiempo de generación
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Aquí normalmente harías la llamada a tu API de Flask
    // Por ahora usamos un PDF de ejemplo
    setPdfUrl("/informe.pdf") // La ruta debe empezar con / para que sea desde la raíz
    
    setIsGenerating(false)
    setShowPDF(true)
  }

  return (
    <div className="h-full w-full flex">
      <div className={`transition-all duration-500 ease-in-out ${showPDF ? 'w-1/2' : 'w-full'}`}>
        <ChatInterface onSendMessage={handleSendMessage} />
      </div>
      
      <AnimatePresence>
        {showPDF && (
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "50%", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="border-l relative"
          >
            <div className="h-full w-full bg-background p-4">
              {isGenerating ? (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                  <Loader2 className="h-8 w-8 animate-spin" />
                  <p className="text-muted-foreground animate-pulse">
                    Generando tu reporte...
                  </p>
                </div>
              ) : (
                <PDFViewer pdfUrl={pdfUrl} />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 