"use client"

import { useState, useRef, useEffect } from 'react'
import { Send, Loader2, Paperclip, Calendar, Globe } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface ChatInterfaceProps {
  onSendMessage: (message: string) => Promise<void>
}

export function ChatInterface({ onSendMessage }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, isLoading])

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const newMessage: Message = {
      role: 'user',
      content: inputValue.trim()
    }

    setMessages(prev => [...prev, newMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      await onSendMessage(newMessage.content)
      const assistantMessage: Message = {
        role: 'assistant',
        content: 'Esta es una respuesta de ejemplo. En la implementación real, esto vendría de la API.'
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error al enviar mensaje:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full h-full flex flex-col rounded-none border-0">
      <CardHeader className="pb-0">
        <CardTitle>Chat Asistente</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-4 overflow-hidden">
        <ScrollArea className="h-full pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-3 mb-4 ${
                  message.role === 'assistant' ? 'flex-row' : 'flex-row-reverse'
                }`}
              >
                <Avatar className={message.role === 'assistant' ? 'bg-primary' : 'bg-muted'}>
                  <AvatarFallback>
                    {message.role === 'assistant' ? 'AI' : 'TÚ'}
                  </AvatarFallback>
                </Avatar>
                <div
                  className={`rounded-lg p-3 max-w-[80%] ${
                    message.role === 'assistant'
                      ? 'bg-muted'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                Escribiendo...
              </div>
            )}
            <div ref={scrollRef} />
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <div className="flex flex-col w-full gap-2 items-center">
          <div className="flex items-center gap-2 rounded-lg border bg-background p-2 w-[60%]">
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <Paperclip className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <Calendar className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                <Globe className="h-4 w-4" />
              </Button>
            </div>
            <Input
              placeholder="Escribe tu mensaje..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage()
                }
              }}
              className="border-0 focus-visible:ring-0"
            />
            <Button 
              onClick={handleSendMessage} 
              disabled={isLoading || !inputValue.trim()}
              size="icon"
              className="h-8 w-8"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
          <p className="text-[0.8rem] text-muted-foreground text-center">
            ChatGPT puede cometer errores. Verifica la información importante.
          </p>
        </div>
      </CardFooter>
    </Card>
  )
} 