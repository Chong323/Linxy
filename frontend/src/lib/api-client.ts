const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

export const apiClient = {
  get: async (endpoint: string, options: RequestInit = {}) => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
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
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(data),
    })
  },
}