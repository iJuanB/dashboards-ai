"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <h3 className="text-sm font-medium">Tema</h3>
        <p className="text-sm text-muted-foreground">
          Personaliza el aspecto de la aplicación
        </p>
      </div>
      <div className="flex gap-2">
        <Button
          variant={theme === "light" ? "default" : "outline"}
          size="icon"
          onClick={() => setTheme("light")}
        >
          <Sun className="h-4 w-4" />
          <span className="sr-only">Tema claro</span>
        </Button>
        <Button
          variant={theme === "dark" ? "default" : "outline"}
          size="icon"
          onClick={() => setTheme("dark")}
        >
          <Moon className="h-4 w-4" />
          <span className="sr-only">Tema oscuro</span>
        </Button>
      </div>
    </div>
  )
} 