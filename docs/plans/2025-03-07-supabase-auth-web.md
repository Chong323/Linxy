# Supabase Auth Implementation for Web Frontend

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add complete Supabase user authentication to the Next.js web frontend, enabling user signup, login, logout, and protected API calls with JWT tokens.

**Architecture:** Use Supabase Auth for user management. Create an AuthContext to manage auth state across the app. Update the API client to automatically attach JWT tokens to requests. Create dedicated auth pages for login/signup.

**Tech Stack:** Next.js 16, Supabase JavaScript client, React Context API, Shadcn UI components

---

## Task 1: Install Supabase Client Dependencies

**Files:**
- Modify: `frontend/package.json`
- Modify: `frontend/package-lock.json` (auto-generated)

**Step 1: Install Supabase packages**

Run from `/Users/cg/projects/Linxy/frontend`:
```bash
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs
```

**Step 2: Verify installation**

Check `frontend/package.json` has:
```json
"@supabase/supabase-js": "^2.x.x",
"@supabase/auth-helpers-nextjs": "^0.x.x"
```

**Step 3: Commit**

```bash
git add frontend/package.json frontend/package-lock.json
git commit -m "deps: add Supabase client libraries for auth"
```

---

## Task 2: Create Supabase Client Configuration

**Files:**
- Create: `frontend/src/lib/supabase.ts`
- Create: `frontend/.env.local` (modify)

**Step 1: Create Supabase client**

Create `frontend/src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

**Step 2: Add environment variables**

Add to `frontend/.env.local`:
```bash
# Use localhost for web development
NEXT_PUBLIC_API_URL=http://localhost:8000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://wyzypabrncqptvlcyjez.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5enlwYWJybmNxcHR2bGN5amV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNDM4NjMsImV4cCI6MjA4NzkxOTg2M30.R6R0YrVj9g7x8e9t0u2i4o6p8a1s3d5f7g9h0j2k4l6m8n0p2q4r6t8u0v2w4x6y8z0a2b4c6d8e0f2g4h6
```

**Step 3: Commit**

```bash
git add frontend/src/lib/supabase.ts frontend/.env.local
git commit -m "feat: add Supabase client configuration"
```

---

## Task 3: Create Auth Context

**Files:**
- Create: `frontend/src/contexts/AuthContext.tsx`

**Step 1: Create AuthContext with user state and auth methods**

Create `frontend/src/contexts/AuthContext.tsx`:
```typescript
"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { supabase } from "@/lib/supabase"
import { User, Session } from "@supabase/supabase-js"

interface AuthContextType {
  user: User | null
  session: Session | null
  isLoading: boolean
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  getToken: () => Promise<string | null>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setIsLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        setIsLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const getToken = async () => {
    const { data } = await supabase.auth.getSession()
    return data.session?.access_token ?? null
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        signUp,
        signIn,
        signOut,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
```

**Step 2: Commit**

```bash
git add frontend/src/contexts/AuthContext.tsx
git commit -m "feat: add AuthContext with Supabase integration"
```

---

## Task 4: Update API Client to Use Auth Tokens

**Files:**
- Modify: `frontend/src/lib/api-client.ts`

**Step 1: Update api-client to get token from auth context**

Modify `frontend/src/lib/api-client.ts`:
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

// Token getter - will be set by AuthProvider
let getAuthToken: (() => Promise<string | null>) | null = null

export function setAuthTokenGetter(getter: () => Promise<string | null>) {
  getAuthToken = getter
}

async function getHeaders() {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  }
  
  // Add auth token if available
  if (getAuthToken) {
    const token = await getAuthToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }
  }
  
  return headers
}

export const apiClient = {
  get: async (endpoint: string, options: RequestInit = {}) => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...await getHeaders(),
        ...options.headers,
      },
    })
  },
  post: async (
    endpoint: string,
    data: Record<string, unknown>,
    options: RequestInit = {}
  ) => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: "POST",
      headers: {
        ...await getHeaders(),
        ...options.headers,
      },
      body: JSON.stringify(data),
    })
  },
}
```

**Step 2: Update AuthContext to initialize the token getter**

Modify `frontend/src/contexts/AuthContext.tsx`, add to the useEffect that initializes:
```typescript
import { setAuthTokenGetter } from "@/lib/api-client"

// ... inside AuthProvider component
useEffect(() => {
  // Set up the token getter for API client
  setAuthTokenGetter(async () => {
    const { data } = await supabase.auth.getSession()
    return data.session?.access_token ?? null
  })
  
  // Get initial session...
}, [])
```

**Step 3: Commit**

```bash
git add frontend/src/lib/api-client.ts frontend/src/contexts/AuthContext.tsx
git commit -m "feat: integrate auth tokens into API client"
```

---

## Task 5: Create Auth Pages

**Files:**
- Create: `frontend/src/app/auth/layout.tsx`
- Create: `frontend/src/app/auth/login/page.tsx`
- Create: `frontend/src/app/auth/signup/page.tsx`

**Step 1: Create auth layout**

Create `frontend/src/app/auth/layout.tsx`:
```typescript
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  )
}
```

**Step 2: Create login page**

Create `frontend/src/app/auth/login/page.tsx`:
```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      toast.error("Login failed", {
        description: error.message,
      })
    } else {
      toast.success("Welcome back!")
      router.push("/")
    }

    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Welcome back</CardTitle>
        <CardDescription className="text-center">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
```

**Step 3: Create signup page**

Create `frontend/src/app/auth/signup/page.tsx`:
```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password !== confirmPassword) {
      toast.error("Passwords don't match")
      return
    }
    
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    const { error } = await signUp(email, password)

    if (error) {
      toast.error("Signup failed", {
        description: error.message,
      })
    } else {
      toast.success("Account created!", {
        description: "Please check your email to confirm your account.",
      })
      router.push("/auth/login")
    }

    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
        <CardDescription className="text-center">
          Enter your details to get started with Linxy
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
        </form>
        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-blue-600 hover:underline">
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
```

**Step 4: Commit**

```bash
git add frontend/src/app/auth/
git commit -m "feat: add login and signup pages"
```

---

## Task 6: Update Root Layout with AuthProvider

**Files:**
- Modify: `frontend/src/app/layout.tsx`

**Step 1: Wrap app with AuthProvider**

Modify `frontend/src/app/layout.tsx`:
```typescript
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { AuthProvider } from "@/contexts/AuthContext"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Linxy - The Digital Bridge",
  description: "AI-powered educational companion for children and parents",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
```

**Step 2: Commit**

```bash
git add frontend/src/app/layout.tsx
git commit -m "feat: wrap app with AuthProvider"
```

---

## Task 7: Add User Menu and Logout to Main Page

**Files:**
- Modify: `frontend/src/app/page.tsx`

**Step 1: Add user display and logout button**

Modify `frontend/src/app/page.tsx` to include user info and logout:

Add imports:
```typescript
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, User } from "lucide-react"
```

Add to the component:
```typescript
export default function Home() {
  const { user, signOut, isLoading } = useAuth()
  const router = useRouter()
  
  const handleLogout = async () => {
    await signOut()
    router.push("/auth/login")
  }
  
  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }
  
  // ... rest of component
```

Add user menu to header:
```typescript
<header className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
  <div className="flex items-center gap-2">
    <Sparkles className="w-6 h-6" />
    <h1 className="text-xl font-bold">Linxy</h1>
  </div>
  <div className="flex items-center gap-4">
    {user && (
      <>
        <span className="flex items-center gap-2 text-sm">
          <User className="w-4 h-4" />
          {user.email}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-white hover:bg-white/20"
        >
          <LogOut className="w-4 h-4 mr-1" />
          Logout
        </Button>
      </>
    )}
  </div>
</header>
```

**Step 2: Commit**

```bash
git add frontend/src/app/page.tsx
git commit -m "feat: add user menu and logout to main page"
```

---

## Task 8: Create Protected Route Component

**Files:**
- Create: `frontend/src/components/ProtectedRoute.tsx`

**Step 1: Create ProtectedRoute component**

Create `frontend/src/components/ProtectedRoute.tsx`:
```typescript
"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/auth/login")
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
```

**Step 2: Apply ProtectedRoute to main page**

Modify `frontend/src/app/page.tsx` to wrap content with ProtectedRoute:
```typescript
import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function Home() {
  // ... component logic

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        {/* ... rest of page */}
      </main>
    </ProtectedRoute>
  )
}
```

**Step 3: Commit**

```bash
git add frontend/src/components/ProtectedRoute.tsx frontend/src/app/page.tsx
git commit -m "feat: add protected route wrapper for authenticated pages"
```

---

## Task 9: Update Backend Dev Bypass to be Conditional

**Files:**
- Modify: `backend/services/auth_service.py`

**Step 1: Make dev bypass conditional on environment**

Modify `backend/services/auth_service.py`:
```python
import os
import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

security = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> str:
    token = credentials.credentials
    
    # Allow dev bypass for local testing only
    env = os.environ.get("ENV", "production")
    if env == "development" and token == "dev-token":
        return "dev-user-123"
    
    secret = os.environ.get("SUPABASE_JWT_SECRET", "")
    if not secret:
        raise ValueError("Supabase JWT secret not found.")
    try:
        payload = jwt.decode(
            token, secret, algorithms=["HS256"], audience="authenticated"
        )
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid auth credentials",
            )
        return user_id
    except jwt.PyJWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
```

**Step 2: Update backend .env.example**

Add to `backend/.env.example`:
```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_JWT_SECRET=your_supabase_jwt_secret
ELEVENLABS_API_KEY=
GEMINI_API_KEY=

# Set to "development" to enable dev token bypass
ENV=development
```

**Step 3: Commit**

```bash
git add backend/services/auth_service.py backend/.env.example
git commit -m "feat: make dev token bypass conditional on environment"
```

---

## Task 10: Test the Complete Auth Flow

**Files:**
- Test all modified files

**Step 1: Install dependencies and start services**

Terminal 1:
```bash
cd /Users/cg/projects/Linxy/frontend
npm install
npm run dev
```

Terminal 2:
```bash
cd /Users/cg/projects/Linxy/backend
source venv/bin/activate
fastapi dev main.py
```

**Step 2: Test signup flow**

1. Navigate to `http://localhost:3000/auth/signup`
2. Create a test account with email/password
3. Verify account created in Supabase dashboard

**Step 3: Test login flow**

1. Go to `http://localhost:3000/auth/login`
2. Login with credentials
3. Verify redirected to home page
4. Check user email displayed in header

**Step 4: Test chat functionality**

1. On home page, verify wake-up message loads
2. Send a test message
3. Verify response received
4. Check network tab for Authorization header

**Step 5: Test logout**

1. Click logout button
2. Verify redirected to login page
3. Try accessing home page - should redirect to login

**Step 6: Final commit**

```bash
git commit -m "feat: complete Supabase auth integration for web frontend

- Add Supabase client and auth context
- Create login/signup pages with form validation
- Integrate JWT tokens into API client
- Add protected route wrapper
- Add user menu with logout
- Make dev bypass conditional on environment

Closes: web auth implementation"
```

---

## Summary

This implementation adds complete Supabase authentication to the web frontend:

1. **Dependencies**: Supabase JS client and Next.js helpers
2. **Configuration**: Supabase client setup with environment variables
3. **Auth Context**: Centralized auth state management
4. **API Integration**: Automatic JWT token attachment to requests
5. **UI**: Login/signup pages with Shadcn UI components
6. **Protection**: Protected routes and user session handling
7. **Security**: Environment-based dev token bypass

The frontend now properly authenticates with Supabase and sends valid JWT tokens to the backend, enabling per-user data storage and retrieval.
