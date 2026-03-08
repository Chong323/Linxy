import { MainApp } from "@/components/main-app"
import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function Home() {
  return (
    <ProtectedRoute>
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
        <MainApp />
      </main>
    </ProtectedRoute>
  )
}
