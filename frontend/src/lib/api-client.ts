const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

const getHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": "Bearer dev-token",
})

export const apiClient = {
  get: async (endpoint: string, options: RequestInit = {}) => {
    return fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...getHeaders(),
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
        ...getHeaders(),
        ...options.headers,
      },
      body: JSON.stringify(data),
    })
  },
}