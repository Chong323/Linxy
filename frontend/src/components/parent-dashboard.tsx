"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { apiClient } from "@/lib/api-client"
import { GuidedParentChat } from "@/components/guided-parent-chat"
import { GrowthChart } from "@/components/growth-chart"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart3, MessageSquare } from "lucide-react"

interface MemoryReport {
  timestamp: string
  summary: string
  interests: string[]
  milestones: string[]
}

export function ParentDashboard() {
  const [reports, setReports] = useState<MemoryReport[]>([])
  const [isFetching, setIsFetching] = useState(false)

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
    <div className="flex flex-col h-full w-full overflow-hidden">
      <Tabs defaultValue="insights" className="flex flex-col h-full w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4 flex-none">
          <TabsList className="grid w-full sm:w-[400px] grid-cols-2">
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <BarChart3 size={16} /> Growth Insights
            </TabsTrigger>
            <TabsTrigger value="chat" className="flex items-center gap-2">
              <MessageSquare size={16} /> Architect Chat
            </TabsTrigger>
          </TabsList>
          
          <Button
            variant="outline"
            size="sm"
            onClick={fetchReports}
            disabled={isFetching}
            className="w-full sm:w-auto"
          >
            {isFetching ? "Refreshing..." : "Refresh Insights"}
          </Button>
        </div>

        <TabsContent value="insights" className="flex-1 min-h-0 overflow-hidden m-0 data-[state=active]:flex flex-col">
          <Card className="flex flex-col h-full min-h-0 overflow-hidden">
            <CardHeader className="flex-none pb-2">
              <CardTitle>Child&apos;s Growth Insights</CardTitle>
              <CardDescription>
                Recent sessions and developmental observations.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto pt-4">
              {reports.length > 0 && <GrowthChart reports={reports} />}
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
        </TabsContent>

        <TabsContent value="chat" className="flex-1 min-h-0 overflow-hidden m-0 data-[state=active]:flex flex-col">
          <GuidedParentChat />
        </TabsContent>
      </Tabs>
    </div>
  )
}