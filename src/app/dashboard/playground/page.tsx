"use client"

import { ChatInterface } from "@/app/charts/components/chat-interface"

export default function PlaygroundPage() {
  const handleSendMessage = async (message: string) => {
    // Aquí iría la lógica para enviar el mensaje a la API
    console.log("Mensaje enviado:", message)
  }

  return (
    <div className="h-screen w-full flex">
      <ChatInterface onSendMessage={handleSendMessage} />
    </div>
  )
}
