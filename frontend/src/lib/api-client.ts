export const apiClient = {
  get: async (endpoint: string, options: RequestInit = {}) => {
    return fetch(`http://localhost:8000${endpoint}`, {
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
    return fetch(`http://localhost:8000${endpoint}`, {
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