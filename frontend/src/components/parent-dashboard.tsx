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

interface ParentReport {
  timestamp: string
  themes: string[]
  emotional_trends: string[]
  growth_areas: string[]
  parent_action_suggestions: string[]
}

export function ParentDashboard() {
  const [reports, setReports] = useState<ParentReport[]>([])
  const [isFetching, setIsFetching] = useState(false)

  const fetchReports = useCallback(async () => {
    setIsFetching(true)
    try {
      const response = await apiClient.get("/parent/reports")
      if (response.ok) {
        const data = await response.json()
        setReports(data.reports || [])
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

  const renderReportCard = (report: ParentReport, index: number) => {
    const themes = report.themes?.length
      ? report.themes.join(", ")
      : "None observed"
    const emotions = report.emotional_trends?.length
      ? report.emotional_trends.join(", ")
      : "None observed"
    const growth = report.growth_areas?.length
      ? report.growth_areas.join(", ")
      : "None observed"
    const suggestions = report.parent_action_suggestions?.length
      ? report.parent_action_suggestions.join(", ")
      : "None"

    return (
      <Card key={index} className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            Session {index + 1} -{" "}
            {new Date(report.timestamp).toLocaleDateString()}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Themes:</span>
              <span className="text-slate-600">{themes}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">Emotional State:</span>
              <span className="text-slate-600">{emotions}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">Growth Areas:</span>
              <span className="text-slate-600">{growth}</span>
            </div>
            <div className="mt-3 pt-3 border-t border-slate-100">
              <span className="text-sm font-medium text-blue-600">Parent Suggestions:</span>
              <p className="text-sm text-slate-600 mt-1">{suggestions}</p>
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