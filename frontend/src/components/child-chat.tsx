"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

type Message = {
  role: "user" | "model"
  content: string
}

export function ChildChat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "model", content: "Hi! I'm Linxy. How are you doing today?" }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = async () => {
    if (!input.trim() || isLoading) return
    
    const newMessages: Message[] = [...messages, { role: "user", content: input }]
    setMessages(newMessages)
    setInput("")
    setIsLoading(true)
    
    try {
      // In a real app we would call the /chat endpoint
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: input,
          history: messages 
        })
      })
      
      const data = await response.json()
      
      if (response.ok && data.reply) {
        setMessages([...newMessages, { role: "model", content: data.reply }])
      } else {
        setMessages([...newMessages, { role: "model", content: "Oops, something went wrong. Let's try that again!" }])
      }
    } catch (error) {
      console.error("Chat error:", error)
      setMessages([...newMessages, { role: "model", content: "I can't reach my brain right now! Please try again later." }])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-blue-50/50 rounded-lg border border-blue-100 p-4">
      <ScrollArea className="flex-1 pr-4 mb-4">
        <div className="space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div 
                className={`max-w-[80%] rounded-2xl p-4 ${
                  msg.role === "user" 
                    ? "bg-blue-600 text-white rounded-br-none" 
                    : "bg-white text-slate-800 shadow-sm border border-slate-100 rounded-bl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex w-full justify-start">
              <div className="bg-white text-slate-500 shadow-sm border border-slate-100 rounded-2xl rounded-bl-none p-4">
                Linxy is typing...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="flex gap-2 items-center">
        <Input 
          className="rounded-full bg-white border-slate-200"
          placeholder="Type a message to Linxy..." 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isLoading}
        />
        <Button 
          className="rounded-full w-12 h-12 p-0 flex-shrink-0"
          onClick={handleSend}
          disabled={!input.trim() || isLoading}
        >
          Send
        </Button>
      </div>
    </div>
  )
}
