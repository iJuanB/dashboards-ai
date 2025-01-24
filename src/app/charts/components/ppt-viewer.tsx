"use client"

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from "framer-motion"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText } from "lucide-react"

interface PPTViewerProps {
  pptUrl: string
}

export function PPTViewer({ pptUrl }: PPTViewerProps) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [pptUrl])

  return (
    <div className="h-full w-full flex flex-col bg-white rounded-lg shadow-lg">
      <div className="flex items-center justify-between p-4 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {pptUrl.split('/').pop()}
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1 p-8">
        <div className="max-w-[800px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="flex justify-center"
            >
              {isLoading ? (
                <div className="flex items-center justify-center h-[600px]">
                  <div className="animate-pulse text-gray-400">
                    Cargando presentación...
                  </div>
                </div>
              ) : (
                <iframe
                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(window.location.origin + pptUrl)}`}
                  className="w-full h-[600px] border-0 shadow-lg bg-white"
                  title="PowerPoint Viewer"
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </ScrollArea>
    </div>
  )
} 