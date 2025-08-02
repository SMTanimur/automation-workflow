import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

interface LoginData {
  email: string
  password: string
}

interface RegisterData {
  name: string
  email: string
  password: string
  companyName?: string
}

interface User {
  id: string
  name: string
  email: string
  companyName?: string
  avatar?: string
  createdAt: string
}

export function useAuth() {
  const queryClient = useQueryClient()
  const router = useRouter()

  // Get current user
  const { data: user, isLoading: isLoadingUser } = useQuery<User>({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await fetch('/api/auth/me')
      if (!response.ok) {
        throw new Error('Failed to fetch user')
      }
      return response.json()
    },
    retry: false,
  })

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (data: LoginData) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Login failed')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      router.push('/')
    },
  })

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Registration failed')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      router.push('/')
    },
  })

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      return response.json()
    },
    onSuccess: () => {
      queryClient.clear()
      router.push('/login')
    },
  })

  return {
    user,
    isLoadingUser,
    login: loginMutation.mutate,
    loginLoading: loginMutation.isPending,
    loginError: loginMutation.error,
    register: registerMutation.mutate,
    registerLoading: registerMutation.isPending,
    registerError: registerMutation.error,
    logout: logoutMutation.mutate,
    logoutLoading: logoutMutation.isPending,
  }
} 