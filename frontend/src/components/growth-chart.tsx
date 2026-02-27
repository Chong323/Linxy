"use client"

import { useMemo } from "react"
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ParentReport {
  timestamp: string
  themes: string[]
  emotional_trends: string[]
  growth_areas: string[]
  parent_action_suggestions: string[]
}

export function GrowthChart({ reports }: { reports: ParentReport[] }) {
  const chartData = useMemo(() => {
    const themeCounts: Record<string, number> = {}
    reports.forEach((report) => {
      // Use themes for the chart
      report.themes?.forEach((theme: string) => {
        const normalized = theme.toLowerCase()
        themeCounts[normalized] = (themeCounts[normalized] || 0) + 1
      })
    })

    return Object.entries(themeCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5) // Top 5 themes
  }, [reports])

  if (chartData.length === 0) {
    return null
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Top Themes Over Time</CardTitle>
        <CardDescription className="text-xs">Based on recent sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis allowDecimals={false} fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "#3b82f6" : "#60a5fa"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
