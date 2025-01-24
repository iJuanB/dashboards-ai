"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import * as React from "react"
import { useState, useRef } from "react"
import {
  Bell,
  Menu,
  Upload
} from "lucide-react"
import * as XLSX from 'xlsx'
import { useRouter } from "next/navigation"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { DashboardConfig } from "@/types/dashboard-types"
import { ManualGraphsGrid } from "@/components/manual-graphs-grid"

const data = {
  nav: [
    { name: "Load Data", icon: Bell },
    { name: "Edit Data", icon: Menu },
  ],
}

interface ProcessedData {
  context: string;
  data: Record<string, any[]>;
}

// Función auxiliar para procesar datos
const processData = (data: any[]): Record<string, any[]> => {
  if (!data || data.length === 0) return {};
  
  const keys = Object.keys(data[0]);
  const result: Record<string, any[]> = {};
  
  keys.forEach(key => {
    result[key] = [];
  });
  
  data.forEach(item => {
    keys.forEach(key => {
      result[key].push(item[key]);
    });
  });
  
  return result;
};

export function SettingsDialog({ 
  open, 
  onOpenChange,
  onDataProcessed
}: { 
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDataProcessed: (config: DashboardConfig, chartData: any) => void;
}) {
  const router = useRouter()
  const [fileData, setFileData] = useState<any[]>([])
  const [context, setContext] = useState("")
  const [numGraphs, setNumGraphs] = useState<string>("")
  const [numTemplates, setNumTemplates] = useState<string>("")
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig | null>(null)
  const [chartData, setChartData] = useState({
    revenueData: null,
    salesData: null,
    lineChartData: null,
    pieChartData: null,
    areaChartData: null
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleManualGraph = async () => {
    if (!numGraphs) {
      alert('Por favor, selecciona cuántos gráficos quieres ver')
      return
    }
    if (!numTemplates) {
      alert('Por favor, selecciona cuántos templates quieres usar')
      return
    }

    // Si hay un archivo cargado, enviarlo a la API
    if (fileInputRef.current?.files?.length) {
      const file = fileInputRef.current.files[0]
      const formData = new FormData()
      
      // Agregar el archivo
      formData.append('file', file)
      
      // Agregar los parámetros como JSON string
      const params = {
        n_graphs: parseInt(numGraphs),
        n_template: parseInt(numTemplates),
        context: context
      }
      formData.append('params', JSON.stringify(params))

      // Agregar console.log para ver los datos
      console.log('Enviando a la API:', {
        file: file,
        params: params
      })

      try {
        const response = await fetch('http://localhost:8000/upload-database', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) {
          throw new Error(`Error al subir el archivo: ${response.statusText}`)
        }

        const result = await response.json()
        console.log('Respuesta de FastAPI (sin procesar):', result)
        
        // Asegurarse de que result es un array antes de guardarlo
        if (!Array.isArray(result)) {
          throw new Error('La respuesta de la API no es un array')
        }

        // Combinar todos los objetos del array en uno solo, manejando duplicados
        const combinedVariables = result.reduce((acc, item) => {
          const [key] = Object.keys(item)
          // Si la clave ya existe, concatenar los arrays
          if (acc[key]) {
            acc[key] = [...new Set([...acc[key], ...item[key]])]
          } else {
            acc[key] = item[key]
          }
          return acc
        }, {} as Record<string, string[]>)

        console.log('Variables combinadas:', combinedVariables)

        // Guardar el objeto combinado en localStorage
        localStorage.setItem('graphVariables', JSON.stringify(combinedVariables))
        
        // Guardar también los datos del archivo
        localStorage.setItem('fileData', JSON.stringify(fileData))

        console.log('Variables guardadas para los gráficos:', {
          graphVariables: combinedVariables,
          fileData: fileData,
          graphVariablesString: JSON.stringify(combinedVariables)
        })
      } catch (error) {
        console.error('Error al subir el archivo:', error)
        alert('Error al subir el archivo. Por favor, intenta de nuevo.')
        return
      }
    }

    onOpenChange(false)
    router.push(`/dashboard/data/manual?graphs=${numGraphs}&templates=${numTemplates}`)
  }

  // Función para procesar los primeros 5 registros
  const processFirstFiveRecords = (data: any[]): Record<string, any[]> => {
    if (!data || data.length === 0) return {}
    
    const firstFiveRecords = data.slice(0, 5)
    const processedData: Record<string, any[]> = {}
    
    // Obtener todas las columnas del primer registro
    const columns = Object.keys(firstFiveRecords[0])
    
    // Inicializar arrays vacíos para cada columna
    columns.forEach(column => {
      processedData[column] = []
    })
    
    // Llenar los arrays con los valores de los primeros 5 registros
    firstFiveRecords.forEach(record => {
      columns.forEach(column => {
        processedData[column].push(record[column])
      })
    })
    
    return processedData
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    
    reader.onload = (e) => {
      try {
        const data = e.target?.result
        if (typeof data !== 'string') {
          const ab = e.target?.result as ArrayBuffer
          const wb = XLSX.read(ab, { type: 'array' })
          const wsname = wb.SheetNames[0]
          const ws = wb.Sheets[wsname]
          const jsonData = XLSX.utils.sheet_to_json(ws)
          setFileData(jsonData)
        } else {
          // Para archivos CSV
          const parsedData = data.split('\n').map(row => {
            const values = row.split(',')
            return values
          })
          setFileData(parsedData)
        }
      } catch (error) {
        console.error('Error al procesar el archivo:', error)
        alert('Error al procesar el archivo')
      }
    }

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file)
    } else {
      reader.readAsArrayBuffer(file)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  // Función para enviar datos a Flask endpoints específicos
  async function sendDataToFlask(endpoint: string, data: any) {
    try {
      console.log(`Enviando a Flask /${endpoint}:`, data)

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

      const result = await response.json()
      console.log(`Recibido de Flask /${endpoint}:`, result)
      return result;
    } catch (error) {
      console.error(`Error sending data to ${endpoint}:`, error);
      return null;
    }
  }

  // Función para procesar los datos para cada gráfico
  const processChartData = async (config: DashboardConfig, data: any[]) => {
    // Procesar datos para Revenue
    const revenueData = data.map(row => 
      config.revenue_value.variables.reduce((acc: Record<string, any>, variable: string) => {
        acc[variable] = row[variable];
        return acc;
      }, {} as Record<string, any>)
    );
    const revenueResponse = await sendDataToFlask('revenue', processData(revenueData));

    // Procesar datos para Sales
    const salesData = data.map(row => 
      config.sales.variables.reduce((acc: Record<string, any>, variable: string) => {
        acc[variable] = row[variable];
        return acc;
      }, {} as Record<string, any>)
    );
    const salesResponse = await sendDataToFlask('sales', processData(salesData));

    // Line Chart
    const lineChartData = data.map(row => ({
      date: row[config["line-chart-label"].date],
      ...config["line-chart-label"].variables.reduce((acc: Record<string, any>, variable: string) => {
        acc[variable] = row[variable];
        return acc;
      }, {} as Record<string, any>)
    }));
    const lineChartResponse = await sendDataToFlask('lineal', processData(lineChartData));

    // Pie Chart
    const pieChartData = data.map(row => ({
      category: row[config["pie-chart-text"].category],
      ...config["pie-chart-text"].variables.reduce((acc: Record<string, any>, variable: string) => {
        acc[variable] = row[variable];
        return acc;
      }, {} as Record<string, any>)
    }));
    const pieChartResponse = await sendDataToFlask('pie', processData(pieChartData));

    // Area Chart
    const dateColumn = config["area-chart-interactive"].date;
    const areaChartData = data.map(row => ({
      date: new Date((row[dateColumn] - 25569) * 86400 * 1000).toISOString().split('T')[0],
      ...config["area-chart-interactive"].variables.reduce((acc: Record<string, any>, variable: string) => {
        acc[variable] = row[variable];
        return acc;
      }, {})
    }));
    
    // Enviamos solo las variables a Flask (sin date)
    const areaDataForFlask = areaChartData.map(item => {
      const { date, ...rest } = item;
      return rest;
    });
    
    const areaChartResponse = await sendDataToFlask('area', processData(areaDataForFlask));

    // Reincorporamos la fecha y los valores que vienen como array
    const areaChartWithDates = areaChartResponse.map((valor: number, index: number) => ({
      date: areaChartData[index].date,
      valor: valor
    }));

    const updatedChartData = {
      revenueData: revenueResponse,
      salesData: salesResponse,
      lineChartData: lineChartResponse,
      pieChartData: pieChartResponse,
      areaChartData: areaChartWithDates
    };

    setChartData(updatedChartData);
    return updatedChartData;
  };

  const handleNext = async () => {
    try {
      if (fileData.length === 0) {
        alert('Por favor, carga un archivo primero')
        return
      }

      // 1. Enviar datos iniciales a /analyze
      const processedData: ProcessedData = {
        context,
        data: processFirstFiveRecords(fileData)
      }
      
      console.log('Enviando a Flask /analyze:', processedData)

      const response = await fetch('http://127.0.0.1:5000/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(processedData)
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      // 2. Recibir configuración y procesarla
      const config: DashboardConfig = await response.json()
      console.log('Recibido de Flask /analyze:', config)
      setDashboardConfig(config)

      // 3. Procesar datos para cada gráfico y esperar los resultados
      const updatedChartData = await processChartData(config, fileData)

      // 4. Pasar los datos actualizados
      console.log('Datos procesados finales:', {
        config,
        chartData: updatedChartData
      })
      onDataProcessed(config, updatedChartData)

    } catch (error) {
      console.error('Error:', error)
      alert('Error al procesar los datos')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="overflow-hidden p-0 md:max-h-[700px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Load Data</DialogTitle>
        <DialogDescription className="sr-only">
          Cargar datos para el dashboard
        </DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar collapsible="none" className="hidden md:flex">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {data.nav.map((item) => (
                      <SidebarMenuItem key={item.name}>
                        <SidebarMenuButton
                          asChild
                          isActive={item.name === "Load Data"}
                        >
                          <a href="#">
                            <item.icon />
                            <span>{item.name}</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[680px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2">
              <div className="flex items-center gap-2 px-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">Load Data</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>Cargar Datos</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="rounded-lg border p-4">
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                
                <Button 
                  variant="outline" 
                  className="mb-4 flex items-center gap-2"
                  onClick={handleUploadClick}
                >
                  <Upload size={16} />
                  Cargar Datos
                </Button>

                <div className="grid w-full gap-1.5 mb-4">
                  <Label htmlFor="message-2">Contexto</Label>
                  <Textarea 
                    placeholder="Escribe el contexto de los datos para que el agente de IA pueda entenderlos mejor." 
                    id="message-2" 
                    className="min-h-[200px]"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                  />
                  <p className="text-sm text-muted-foreground">
                    Formatos soportados: CSV, Excel (.xlsx, .xls)
                  </p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="space-y-4 flex-1 mr-4">
                    <div className="space-y-2">
                      <Label>¿Cuántos gráficos quieres ver?</Label>
                      <Select value={numGraphs} onValueChange={setNumGraphs}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona cantidad" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5,6,7,8,9].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>¿Cuántos templates quieres usar?</Label>
                      <Select value={numTemplates} onValueChange={setNumTemplates}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona cantidad" />
                        </SelectTrigger>
                        <SelectContent>
                          {[1,2,3,4,5].map((num) => (
                            <SelectItem key={num} value={num.toString()}>
                              {num}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button onClick={handleNext} className="w-[180px]">
                      Graficar con IA
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={handleManualGraph}
                      className="w-[180px]"
                    >
                      Graficar manualmente
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  )
}

export function LoadData({ onClose }: { onClose: () => void }) {
  const [isOpen, setIsOpen] = React.useState(true)

  const handleDataProcessed = (config: DashboardConfig, chartData: any) => {
    // Aquí puedes manejar los datos procesados
    console.log('Datos procesados:', { config, chartData })
    // Cerrar el diálogo cuando los datos se hayan procesado
    handleClose()
  }

  const handleClose = () => {
    setIsOpen(false)
    onClose()
  }

  return (
    <SettingsDialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose()
        else setIsOpen(true)
      }}
      onDataProcessed={handleDataProcessed}
    />
  )
}
