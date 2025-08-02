'use client'

import { Loader2 } from 'lucide-react'

interface LoadingScreenProps {
  message?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function LoadingScreen({ 
  message = 'Loading...', 
  size = 'md' 
}: LoadingScreenProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex items-center justify-center min-h-[200px] bg-gray-50 rounded-lg">
      <div className="flex flex-col items-center space-y-4">
        <Loader2 className={`animate-spin text-blue-500 ${sizeClasses[size]}`} />
        <p className="text-gray-600 text-sm">{message}</p>
      </div>
    </div>
  )
}
