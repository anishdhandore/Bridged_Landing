// API Client to replace Base44 SDK calls
// This will make requests to our Next.js API routes

const API_BASE = '/api'

export const apiClient = {
  // User/Auth
  auth: {
    me: async () => {
      const res = await fetch(`${API_BASE}/auth/me`, {
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Not authenticated')
      return res.json()
    },
    login: async (email: string, password: string) => {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      })
      if (!res.ok) throw new Error('Login failed')
      return res.json()
    },
    logout: async () => {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      })
    },
    redirectToLogin: () => {
      window.location.href = '/login'
    },
  },
}

