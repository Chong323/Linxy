"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChildChat } from "./child-chat"
import { ParentDashboard } from "./parent-dashboard"

export function MainApp() {
  return (
    <Card className="w-full max-w-4xl h-[85vh] shadow-xl flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-2xl font-bold">Linxy</CardTitle>
          <CardDescription>The Digital Bridge</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <Tabs defaultValue="explorer" className="w-full h-full flex flex-col">
          <div className="px-6 pb-2">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="explorer">Explorer Mode (Child)</TabsTrigger>
              <TabsTrigger value="architect">Architect Mode (Parent)</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="explorer" className="flex-1 overflow-hidden data-[state=active]:flex flex-col m-0 p-6 pt-2">
            <ChildChat />
          </TabsContent>
          
          <TabsContent value="architect" className="flex-1 overflow-auto data-[state=active]:flex flex-col m-0 p-6 pt-2">
            <ParentDashboard />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
