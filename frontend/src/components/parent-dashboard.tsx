"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"

interface MemoryReport {
  timestamp: string
  summary: string
  interests: string[]
  milestones: string[]
}

export function ParentDashboard() {
  const [reports, setReports] = useState<MemoryReport[]>([])
  const [isFetching, setIsFetching] = useState(false)
  const [command, setCommand] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchReports = useCallback(async () => {
    setIsFetching(true)
    try {
      const response = await apiClient.get("/parent/reports")
      if (response.ok) {
        const data = await response.json()
        setReports(data.memories || [])
      }
    } catch {
      toast.error("Failed to fetch reports", {
        description: "Please check if the backend is running.",
      })
    } finally {
      setIsFetching(false)
    }
  }, [])

  useEffect(() => {
    fetchReports()
  }, [fetchReports])

  const handleSubmit = async () => {
    if (!command.trim() || isSubmitting) return

    setIsSubmitting(true)

    try {
      const response = await apiClient.post("/parent/command", { command })

      if (response.ok) {
        setCommand("")
        toast.success("Successfully added directive to memory.")
      } else {
        toast.error("Failed to add directive.")
      }
    } catch {
      toast.error("Failed to add directive.", {
        description: "Ensure the backend is running.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const renderReportCard = (memory: MemoryReport, index: number) => {
    const interests = memory.interests?.length
      ? memory.interests.join(", ")
      : "None observed"
    const milestones = memory.milestones?.length
      ? memory.milestones.join(", ")
      : "None observed"

    return (
      <Card key={index} className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Session {index + 1} -{" "}
            {new Date(memory.timestamp).toLocaleDateString()}
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            {memory.summary || "No summary available"}
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Interests:</span>
              <span className="text-slate-600">{interests}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">Milestones:</span>
              <span className="text-slate-600">{milestones}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex flex-col h-full gap-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Child&apos;s Growth Insights</CardTitle>
          <CardDescription>
            Recent sessions and developmental observations.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p className="mb-2">No sessions analyzed yet.</p>
                <p className="text-xs italic">
                  Start chatting with your child to generate insights!
                </p>
              </div>
            ) : (
              reports.map(renderReportCard)
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="flex-1 flex flex-col">
        <CardHeader className="flex flex-row justify-between items-center pb-2">
          <div>
            <CardTitle>Education Goals</CardTitle>
            <CardDescription>
              Add new instructions to Linxy&apos;s memory.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchReports}
            disabled={isFetching}
          >
            {isFetching ? "Refreshing..." : "Refresh Insights"}
          </Button>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col gap-4 pt-4">
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
        </CardContent>
      </Card>
    </div>
  )
}