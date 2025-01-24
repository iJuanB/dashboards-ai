"use client"

import { Plus, ChevronRight, BarChart2 } from "lucide-react"
import { motion } from "framer-motion"
import { SidebarData } from "@/components/sidebar-data"
import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"
import { Separator } from "./ui/separator"
import { ChatInterface } from "./chat-interface"
import { MessageSquare, LineChart, Search, PlusSquare } from "lucide-react"
import { VegaBarChart } from "./vega-bar-chart"
import { VegaScatterPlot } from "./vega-scatter-plot"
import { VegaLineChart } from "./vega-line-chart"
import { VegaHistogram } from "./vega-histogram"

type ScatterData = { x: number; y: number }
type BarData = { a: string; b: number }

type GraphConfig = {
  type: string;
  variables: string[];
}

export function ManualGraphsGrid({ numGraphs = 4 }: { numGraphs?: number }) {
  const [fileData, setFileData] = useState<any[]>([])
  const [graphConfig, setGraphConfig] = useState<GraphConfig[]>([])
  const [variables, setVariables] = useState<string[]>([])
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activeInterface, setActiveInterface] = useState<'variables' | 'chat' | 'analyze' | 'patterns' | 'create'>('variables')
  const [activeTemplate, setActiveTemplate] = useState(1)
  const [numTemplates, setNumTemplates] = useState(1)

  const sidebarItems = [
    { id: 'chat' as const, icon: MessageSquare, label: 'Chatea con tus datos' },
    { id: 'analyze' as const, icon: BarChart2, label: 'Analiza tus gráficos' },
    { id: 'patterns' as const, icon: Search, label: 'Analiza patrones' },
    { id: 'create' as const, icon: PlusSquare, label: 'Crear gráficos' },
  ]

  useEffect(() => {
    const savedData = localStorage.getItem('fileData')
    const savedConfig = localStorage.getItem('graphVariables')

    if (savedData && savedConfig) {
      try {
        const data = JSON.parse(savedData)
        const rawConfig = JSON.parse(savedConfig)
        
        console.log('Config raw:', rawConfig)
        
        // Crear array de configuraciones a partir del objeto
        const graphsConfig: GraphConfig[] = []
        
        // Para cada tipo en el objeto rawConfig
        Object.entries(rawConfig).forEach(([type, variables]) => {
          if (Array.isArray(variables)) {
            // Para el tipo 2 (scatter plot), mantener las variables juntas
            if (type === '2') {
              graphsConfig.push({
                type,
                variables: variables as string[]
              })
            } else {
              // Para los demás tipos, crear un gráfico por variable
              variables.forEach(variable => {
                graphsConfig.push({
                  type,
                  variables: [variable as string]
                })
              })
            }
          }
        })
        
        console.log('Configuración procesada:', graphsConfig)
        
        setFileData(data)
        setVariables(Object.keys(data[0]))
        setGraphConfig(graphsConfig)
        
      } catch (error) {
        console.error('Error al cargar datos:', error)
      }
    }
  }, [])

  const renderGraph = (index: number) => {
    if (!fileData.length) return <div className="p-4 bg-zinc-800/50 rounded-full self-center"><Plus className="w-8 h-8 text-zinc-400" /></div>

    console.log(`Intentando renderizar gráfico ${index} de ${graphConfig.length} gráficos`)
    console.log('Estado actual de graphConfig:', graphConfig)

    // Obtener la configuración para este índice
    const config = graphConfig[index - 1]
    console.log(`Configuración para gráfico ${index}:`, config)
    
    if (!config) {
      console.log(`No hay configuración para el gráfico ${index}`)
      return <div className="p-4 bg-zinc-800/50 rounded-full self-center"><Plus className="w-8 h-8 text-zinc-400" /></div>
    }

    const { type, variables } = config
    console.log(`Gráfico ${index}: Tipo ${type}, Variables:`, variables)

    // Preparar datos según el tipo de gráfico
    if (type === '2' && variables.length === 2) {
      // Scatter plot (necesita 2 variables)
      const scatterData = fileData.map(row => ({
        x: Number(row[variables[0]]),
        y: Number(row[variables[1]])
      }))
      return (
        <div className="rounded-lg border bg-card text-card-foreground p-8">
          <VegaScatterPlot data={scatterData} />
        </div>
      )
    }

    // Para los demás tipos (bar y histogram), que usan una variable
    const grouped = fileData.reduce((acc, row) => {
      const key = String(row[variables[0]])
      acc[key] = (acc[key] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const barData = Object.entries(grouped).map(([a, b]) => ({ a, b: Number(b) }))

    return (
      <div className="rounded-lg border bg-card text-card-foreground p-8">
        {type === '1' && <VegaBarChart data={barData} />}
        {(type === '3' || type === '4') && <VegaHistogram data={barData.map(d => d.b)} />}
      </div>
    )
  }

  const getGridCols = (num: number) => {
    if (num === 4) return 2
    if (num <= 3) return num
    if (num <= 6) return 3
    return 3
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex flex-1 min-h-0">
        <div className="flex-1 min-w-0 overflow-hidden">
          <div className="h-full p-4">
            <div 
              className="grid h-full gap-4" 
              style={{
                gridTemplateColumns: `repeat(${getGridCols(numGraphs)}, minmax(0, 1fr))`,
                gridTemplateRows: `repeat(${Math.ceil(numGraphs / getGridCols(numGraphs))}, minmax(350px, 1fr))`
              }}
            >
              {Array.from({ length: numGraphs }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-zinc-900 border-zinc-800 border rounded-lg shadow-sm flex items-stretch justify-center hover:border-zinc-700 transition-colors cursor-pointer relative overflow-hidden"
                >
                  {renderGraph(index + 1)}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
        {activeInterface === 'variables' && (
          <div className="relative flex-none h-full">
            <Separator orientation="vertical" className="h-full absolute left-0" />
            <div className={cn(
              "transition-all duration-300 h-full relative pl-3",
              isCollapsed ? "w-3" : "w-64"
            )}>
              <div className="w-64 h-full">
                <SidebarData 
                  variables={variables}
                  onInterfaceChange={(interfaceId) => {
                    setActiveInterface(interfaceId)
                    setIsCollapsed(false)
                  }}
                  onCollapse={() => setIsCollapsed(true)}
                />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="absolute -left-3 top-4 z-10 h-6 w-6 rounded-lg border border-zinc-800 bg-zinc-900 p-0 hover:bg-zinc-800"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <ChevronRight className={cn(
                "h-4 w-4 transition-transform duration-200",
                isCollapsed ? "rotate-180" : ""
              )} />
            </Button>
          </div>
        )}
        {(activeInterface === 'chat' || activeInterface === 'analyze' || activeInterface === 'patterns' || activeInterface === 'create') && (
          <motion.div 
            initial={{ x: 500 }}
            animate={{ x: 0 }}
            exit={{ x: 500 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex-none flex border-l border-zinc-800 relative"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute -left-2 top-4 z-10 h-6 w-6 rounded-lg border border-zinc-800 bg-zinc-900 p-0 hover:bg-zinc-800"
              onClick={() => setActiveInterface('variables')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <div className="w-[400px]">
              {activeInterface === 'chat' && <ChatInterface />}
              {activeInterface === 'analyze' && <div className="p-4">Interfaz de análisis</div>}
              {activeInterface === 'patterns' && <div className="p-4">Interfaz de patrones</div>}
              {activeInterface === 'create' && <div className="p-4">Interfaz de creación</div>}
            </div>
            <div className="w-12 border-l border-zinc-800 bg-zinc-900 py-4">
              {sidebarItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "w-full h-12 mb-2",
                    activeInterface === item.id ? "bg-zinc-800" : "hover:bg-zinc-800/50"
                  )}
                  onClick={() => setActiveInterface(item.id)}
                >
                  <item.icon className="h-5 w-5" />
                </Button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
      
      <div className="flex items-center border-t bg-muted/5 px-2">
        <div className="flex gap-1 py-1.5">
          {Array.from({ length: numTemplates }).map((_, index) => (
            <motion.button
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => setActiveTemplate(index + 1)}
              className={cn(
                "px-4 py-1.5 text-sm rounded-md flex items-center gap-2 transition-all",
                activeTemplate === index + 1 
                  ? "bg-zinc-800 text-zinc-200 font-medium shadow-sm" 
                  : "hover:bg-zinc-800/50 text-zinc-400"
              )}
            >
              Template {index + 1}
              {activeTemplate === index + 1 && (
                <span className="px-1.5 py-0.5 text-xs bg-primary/20 rounded-md">
                  Active
                </span>
              )}
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  )
} 