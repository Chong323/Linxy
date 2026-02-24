"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, UserRound } from "lucide-react"

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
  const [isEndingSession, setIsEndingSession] = useState(false)
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
      // In a real app we would call the /chat endpoint
      const response = await apiClient.post("/chat", {
        message: input,
        history: messages,
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

  const handleEndSession = async () => {
    if (messages.length <= 1 || isEndingSession) return

    setIsEndingSession(true)
    const toastId = toast.loading("Saving session memories...")

    try {
      const response = await apiClient.post("/chat/reflect", {
        history: messages,
      })

      if (response.ok) {
        toast.success("Session saved successfully!", { id: toastId })
        // Reset chat for the next session
        setMessages([
          { role: "model", content: "Hi! I'm Linxy. How are you doing today?" },
        ])
      } else {
        toast.error("Failed to save session.", { id: toastId })
      }
    } catch {
      toast.error("Failed to reach Linxy's brain.", { id: toastId })
    } finally {
      setIsEndingSession(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-blue-50/50 rounded-lg border border-blue-100 p-4 min-h-0 relative">
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="outline"
          size="sm"
          onClick={handleEndSession}
          disabled={messages.length <= 1 || isEndingSession || isLoading}
          className="bg-white/80 hover:bg-white text-blue-600 border-blue-200"
        >
          {isEndingSession ? "Saving..." : "End Session"}
        </Button>
      </div>

      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto pr-4 mb-4 space-y-4"
      >
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex w-full gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {msg.role === "model" && (
              <Avatar className="h-8 w-8 mt-auto">
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  <Bot size={18} />
                </AvatarFallback>
              </Avatar>
            )}
            <div 
              className={`max-w-[75%] rounded-2xl p-4 ${
                msg.role === "user" 
                  ? "bg-blue-600 text-white rounded-br-none" 
                  : "bg-white text-slate-800 shadow-sm border border-slate-100 rounded-bl-none"
              }`}
            >
              {msg.content}
            </div>
            {msg.role === "user" && (
              <Avatar className="h-8 w-8 mt-auto">
                <AvatarFallback className="bg-slate-200 text-slate-600">
                  <UserRound size={18} />
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        ))}
        {isLoading && (
          <div className="flex w-full gap-2 justify-start">
            <Avatar className="h-8 w-8 mt-auto">
              <AvatarFallback className="bg-blue-100 text-blue-600">
                <Bot size={18} />
              </AvatarFallback>
            </Avatar>
            <div className="bg-white text-slate-500 shadow-sm border border-slate-100 rounded-2xl rounded-bl-none p-4">
              Linxy is typing...
            </div>
          </div>
        )}
      </div>
      
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
