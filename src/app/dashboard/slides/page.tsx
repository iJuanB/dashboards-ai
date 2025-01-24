"use client"

import { motion } from "framer-motion"
import { PresentationIcon, FolderKanban } from "lucide-react"
import Link from "next/link"

export default function SlidesPage() {
  const buttons = [
    {
      title: "Crear presentación",
      description: "Genera una nueva presentación con IA",
      icon: <PresentationIcon className="w-12 h-12 text-primary" />,
      href: "/dashboard/slides/crear-slide",
    },
    {
      title: "Mis presentaciones",
      description: "Visualiza tus presentaciones guardadas",
      icon: <FolderKanban className="w-12 h-12 text-primary" />,
      href: "/dashboard/slides/mis-slides",
    },
  ]

  return (
    <div className="container h-full py-6">
      <div className="h-full flex flex-col items-center justify-center max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Presentaciones</h1>
          <p className="text-muted-foreground">
            Crea y gestiona tus presentaciones con ayuda de IA
          </p>
        </div>

        <div className="grid w-full grid-cols-1 md:grid-cols-2 gap-4">
          {buttons.map((button, index) => (
            <Link key={button.title} href={button.href}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative group rounded-lg border p-6 hover:border-primary transition-colors"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  {button.icon}
                  <div className="space-y-2">
                    <h2 className="text-xl font-semibold tracking-tight">
                      {button.title}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {button.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 