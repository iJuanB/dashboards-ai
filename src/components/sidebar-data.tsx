"use client"

import { Button } from "./ui/button"
import { MessageSquare, Database, Search, PlusSquare, ChevronDown, BarChart2, ChevronRight } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface SidebarDataProps {
  variables: string[]
  onInterfaceChange?: (interfaceId: 'variables' | 'chat' | 'analyze' | 'patterns' | 'create') => void
  onCollapse?: () => void
}

export function SidebarData({ variables, onInterfaceChange, onCollapse }: SidebarDataProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  const sidebarItems = [
    { id: 'chat', icon: MessageSquare, label: 'Chatea con tus datos' },
    { id: 'analyze', icon: BarChart2, label: 'Analiza tus gráficos' },
    { id: 'patterns', icon: Search, label: 'Analiza patrones' },
    { id: 'create', icon: PlusSquare, label: 'Crear gráficos' },
  ] as const

  return (
    <div className="p-4 space-y-4">
      <Button
        variant="ghost"
        className="w-full justify-between text-sm font-normal hover:bg-muted/50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          Variables ({variables.length})
        </div>
        <ChevronRight className={cn(
          "h-4 w-4 transition-transform duration-200",
          isExpanded ? "rotate-90" : ""
        )} />
      </Button>

      {isExpanded && (
        <div className="pl-6 space-y-1">
          {variables.map((variable, index) => (
            <div key={index} className="text-sm py-1 px-2 text-muted-foreground hover:bg-muted/50 rounded-md cursor-pointer">
              {variable}
            </div>
          ))}
        </div>
      )}

      <div className="space-y-1">
        {sidebarItems.map((item) => (
          <Button
            key={item.id}
            variant="ghost"
            className="w-full justify-start text-sm font-normal hover:bg-muted/50"
            onClick={() => onInterfaceChange?.(item.id)}
          >
            <item.icon className="mr-2 h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  )
} 