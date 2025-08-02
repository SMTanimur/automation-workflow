'use client'

import { ReactNode } from 'react'

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-1">
        {children}
      </main>
    </div>
  )
}