import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Send, Bot } from "lucide-react"
import { ScrollArea } from "./ui/scroll-area"
import { cn } from "@/lib/utils"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ChatInterface() {
  return (
    <div className="flex flex-col h-full bg-zinc-900">
      <div className="flex-none p-6 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <Bot className="w-8 h-8 text-blue-500" />
          <div>
            <h2 className="text-xl font-semibold text-zinc-200">AI Assistant</h2>
            <p className="text-sm text-zinc-400">Analiza y visualiza tus datos</p>
          </div>
        </div>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-6 space-y-6">
          <div className="flex gap-4">
            <div className="flex-none">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Bot className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div className="flex-1">
              <div className="prose prose-invert max-w-none">
                <p className="text-zinc-300 leading-relaxed">
                  ¡Hola! Soy tu asistente de análisis de datos. Puedo ayudarte a:
                </p>
                <ul className="mt-2 space-y-1 text-zinc-300">
                  <li>Analizar tendencias en tus datos</li>
                  <li>Crear visualizaciones personalizadas</li>
                  <li>Responder preguntas sobre tus datos</li>
                  <li>Generar reportes y resúmenes</li>
                </ul>
                <p className="mt-4 text-zinc-300">
                  ¿En qué puedo ayudarte hoy?
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollArea>

      <div className="flex-none p-4 border-t border-zinc-800">
        <div className="flex gap-3 items-center">
          <Input 
            placeholder="Envía un mensaje..." 
            className="flex-1 bg-zinc-800/50 border-zinc-700 text-zinc-200 placeholder:text-zinc-500"
          />
          <Button size="icon" className="bg-blue-600 hover:bg-blue-700 text-white">
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 text-xs text-zinc-500 px-3">
          Presiona Enter ↵ para enviar
        </div>
      </div>
    </div>
  )
} 