"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Settings, User } from "lucide-react"

type Message = {
  role: "user" | "model"
  content: string
}

export function GuidedParentChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", content: "Hello! I'm Linxy's Architect AI. How can I help guide Linxy for your child today? (e.g., 'I want them to practice math', 'Help them deal with a new sibling')" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isLoading])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    
    const newMessages: Message[] = [...messages, { role: "user", content: input }]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)
    
    try {
      const response = await apiClient.post("/parent/chat", {
        message: input,
        history: messages,
      })
      
      const data = await response.json()
      
      if (response.ok && data.reply) {
        setMessages([...newMessages, { role: "model", content: data.reply }])
      } else {
        setMessages([...newMessages, { role: "model", content: "I encountered an error. Please try again." }])
      }
    } catch (error) {
      console.error("Chat error:", error)
      setMessages([...newMessages, { role: "model", content: "I can't connect right now! Please try again later." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="flex-1 flex flex-col h-full overflow-hidden">
      <CardHeader className="pb-2 flex-none">
        <CardTitle>Guided Architect Chat</CardTitle>
        <CardDescription>
          Chat with the Architect AI to automatically set core instructions for Linxy.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto mb-4 space-y-4 pr-2"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex w-full gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "model" && (
                <Avatar className="h-8 w-8 mt-auto">
                  <AvatarFallback className="bg-slate-200 text-slate-700">
                    <Settings size={16} />
                  </AvatarFallback>
                </Avatar>
              )}
              <div 
                className={`max-w-[80%] rounded-lg p-3 text-sm ${
                  msg.role === "user" 
                    ? "bg-slate-900 text-white rounded-br-none" 
                    : "bg-slate-100 text-slate-800 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
              {msg.role === "user" && (
                <Avatar className="h-8 w-8 mt-auto">
                  <AvatarFallback className="bg-slate-200 text-slate-600">
                    <User size={16} />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex w-full gap-2 justify-start">
              <Avatar className="h-8 w-8 mt-auto">
                <AvatarFallback className="bg-slate-200 text-slate-700">
                  <Settings size={16} />
                </AvatarFallback>
              </Avatar>
              <div className="bg-slate-100 text-slate-500 rounded-lg rounded-bl-none p-3 text-sm">
                Architect is thinking...
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-2 items-center mt-auto flex-none pt-2 border-t border-slate-100">
          <Input 
            className="flex-1"
            placeholder="Type your goal for Linxy..." 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isLoading}
          />
          <Button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
          >
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
