"use client"

import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChildChat } from "./child-chat"
import { ParentDashboard } from "./parent-dashboard"
import { useAuth } from "@/contexts/AuthContext"
import { LogOut, User } from "lucide-react"

export function MainApp() {
  const { user, signOut, isLoading } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await signOut()
    router.push("/auth/login")
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-4xl h-[85vh] shadow-xl flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-2xl font-bold">Linxy</CardTitle>
          <CardDescription>The Digital Bridge</CardDescription>
        </div>
        {user && (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 text-sm text-slate-600">
              <User className="w-4 h-4" />
              {user.email}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="text-slate-600"
            >
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <Tabs defaultValue="explorer" className="w-full h-full flex flex-col">
          <div className="px-6 pb-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="explorer">Explorer Mode (Child)</TabsTrigger>
              <TabsTrigger value="architect">Architect Mode (Parent)</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="explorer" className="flex-1 h-full min-h-0 overflow-hidden data-[state=active]:flex flex-col m-0 p-6 pt-2">
            <ChildChat />
          </TabsContent>
          
          <TabsContent value="architect" className="flex-1 h-full min-h-0 overflow-hidden data-[state=active]:flex flex-col m-0 p-6 pt-2">
            <ParentDashboard />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
