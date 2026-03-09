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
      console.log("[API] Token attached, length:", token.length)
    } else {
      console.log("[API] No token available")
    }
  } else {
    console.log("[API] Token getter not set")
  }
  
  return headers
}

export const apiClient = {
  get: async (endpoint: string, options: RequestInit = {}) => {
    console.log("[API] GET", endpoint)
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...await getHeaders(),
        ...options.headers,
      },
    })
    console.log("[API] GET response:", response.status)
    return response
  },
  post: async (
    endpoint: string,
    data: Record<string, unknown>,
    options: RequestInit = {}
  ) => {
    console.log("[API] POST", endpoint)
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      method: "POST",
      headers: {
        ...await getHeaders(),
        ...options.headers,
      },
      body: JSON.stringify(data),
    })
    console.log("[API] POST response:", response.status)
    return response
  },
}
