'use client'

import { useState, useRef } from 'react'
import { Upload, FileText, Database, ChevronDown } from 'lucide-react'

export default function DataPreparationForm() {
  const [variableDefinitionMethod, setVariableDefinitionMethod] = useState<'manual' | 'json' | null>(null)
  const [fileName, setFileName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Aquí puedes agregar la lógica para procesar el archivo
      // Por ahora, solo mostraremos el nombre del archivo
      setFileName(file.name)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="w-full max-w-md space-y-8">
      <h1 className="text-3xl font-bold text-center">Preparación de Datos</h1>
      
      <div className="space-y-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".csv,.xlsx,.xls"
          className="hidden"
        />
        <button 
          onClick={triggerFileInput}
          className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition duration-300 border border-gray-300"
        >
          <Upload className="w-5 h-5" />
          <span>{fileName ? `Archivo cargado: ${fileName}` : 'Cargar Base de Datos (Excel/CSV)'}</span>
        </button>

        <div className="space-y-2">
          <label htmlFor="context" className="block text-sm font-medium">
            Contexto de la Base de Datos
          </label>
          <input
            type="text"
            id="context"
            className="w-full bg-gray-800 text-white rounded-lg py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Describe el contexto de tus datos..."
          />
        </div>

        <div className="space-y-2">
          <button
            onClick={() => setVariableDefinitionMethod(variableDefinitionMethod === null ? 'manual' : null)}
            className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-2 px-4 rounded-lg flex items-center justify-between transition duration-300 border border-gray-300"
          >
            <div className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>Definir Variables</span>
            </div>
            <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${variableDefinitionMethod !== null ? 'rotate-180' : ''}`} />
          </button>
          
          {variableDefinitionMethod !== null && (
            <div className="mt-2 space-y-2">
              <button
                onClick={() => setVariableDefinitionMethod('manual')}
                className={`w-full py-2 px-4 rounded-lg font-semibold transition duration-300 border ${
                  variableDefinitionMethod === 'manual'
                    ? 'bg-gray-200 text-black border-gray-300'
                    : 'bg-white text-black hover:bg-gray-100 border-gray-300'
                }`}
              >
                Cargar Manualmente
              </button>
              <button
                onClick={() => setVariableDefinitionMethod('json')}
                className={`w-full py-2 px-4 rounded-lg font-semibold transition duration-300 border ${
                  variableDefinitionMethod === 'json'
                    ? 'bg-gray-200 text-black border-gray-300'
                    : 'bg-white text-black hover:bg-gray-100 border-gray-300'
                }`}
              >
                Importar desde JSON
              </button>
            </div>
          )}
        </div>

        <button className="w-full bg-white hover:bg-gray-100 text-black font-semibold py-2 px-4 rounded-lg flex items-center justify-center space-x-2 transition duration-300 border border-gray-300">
          <FileText className="w-5 h-5" />
          <span>Finalizar</span>
        </button>
      </div>
    </div>
  )
}

