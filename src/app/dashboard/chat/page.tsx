"use client"

import { ChatInterface } from "@/app/charts/components/chat-interface"

export default function ChatPage() {
  const handleSendMessage = async (message: string) => {
    // Aquí iría la lógica para enviar el mensaje a la API
    console.log("Mensaje enviado:", message)
  }

  return (
    <div className="h-full w-full">
      <ChatInterface onSendMessage={handleSendMessage} />
    </div>
  )
} 