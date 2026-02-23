"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function ParentDashboard() {
  const [command, setCommand] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [status, setStatus] = useState<string | null>(null)

  const handleSubmit = async () => {
    if (!command.trim() || isSubmitting) return
    
    setIsSubmitting(true)
    setStatus(null)
    
    try {
      const response = await fetch("http://localhost:8000/parent/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command })
      })
      
      const data = await response.json()
      
      if (response.ok && data.status === "success") {
        setCommand("")
        setStatus("success")
      } else {
        setStatus("error")
      }
    } catch (error) {
      console.error("Command error:", error)
      setStatus("error")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col h-full gap-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Child's Growth Status</CardTitle>
          <CardDescription>Weekly analysis based on recent interactions.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500 italic mb-4">
            (Future Feature: This area will show emotional state analysis, topics discussed, and cognitive milestones.)
          </p>
          <div className="h-24 bg-slate-50 rounded border border-slate-100 flex items-center justify-center">
            <span className="text-slate-400">Reports unavailable (MVP phase)</span>
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle>Education Goals</CardTitle>
          <CardDescription>Add new instructions to Linxy's memory.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4">
          <Textarea 
            className="flex-1 min-h-[120px] resize-none"
            placeholder="E.g., Try to encourage math skills today."
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            disabled={isSubmitting}
          />
          <Button 
            className="w-full sm:w-auto self-end"
            onClick={handleSubmit}
            disabled={!command.trim() || isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add to Instructions"}
          </Button>
          
          {status === "success" && (
            <p className="text-sm text-green-600 text-right">Successfully added directive to memory.</p>
          )}
          {status === "error" && (
            <p className="text-sm text-red-600 text-right">Failed to add directive. Ensure the backend is running.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
