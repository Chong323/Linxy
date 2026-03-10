"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { apiClient } from "@/lib/api-client"
import { ArrowLeft, RefreshCw, Database } from "lucide-react"
import { toast } from "sonner"

export default function DebugPage() {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchMemories = async () => {
    setIsLoading(true)
    try {
      const res = await apiClient.get("/debug/memories")
      if (res.ok) {
        const json = await res.json()
        setData(json)
      } else {
        toast.error("Failed to fetch debug data")
      }
    } catch (err) {
      console.error(err)
      toast.error("Error connecting to server")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMemories()
  }, [])

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-50 p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => router.push("/")} className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to App
            </Button>
            <Button onClick={fetchMemories} disabled={isLoading} className="gap-2">
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              Refresh Data
            </Button>
          </div>

          <Card className="shadow-lg border-slate-200">
            <CardHeader className="bg-slate-900 text-slate-50 rounded-t-xl">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-400" />
                <CardTitle className="text-xl">Database Debug View</CardTitle>
              </div>
              <CardDescription className="text-slate-400">
                Raw output of your user's row in the memories table
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading && !data ? (
                <div className="flex items-center justify-center p-12 text-slate-500">
                  <RefreshCw className="w-6 h-6 animate-spin mr-2" /> Loading raw data...
                </div>
              ) : (
                <pre className="p-6 overflow-x-auto text-sm bg-slate-950 text-green-400 font-mono rounded-b-xl max-h-[70vh] overflow-y-auto">
                  <code>{JSON.stringify(data, null, 2)}</code>
                </pre>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </ProtectedRoute>
  )
}
