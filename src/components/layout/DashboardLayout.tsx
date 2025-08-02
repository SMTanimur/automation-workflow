'use client'

import { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Home, 
  Workflow, 
  Mail, 
  Settings, 
  Users, 
  BarChart3,
  Menu,
  X
} from 'lucide-react'

interface DashboardLayoutProps {
  children: ReactNode
  sidebarOpen?: boolean
  onSidebarToggle?: () => void
}

export default function DashboardLayout({ 
  children, 
  sidebarOpen = true, 
  onSidebarToggle 
}: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white border-r border-gray-200 transition-all duration-300 overflow-hidden`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Workflow className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">FlowBuilder</h1>
                <p className="text-xs text-gray-500">Automation Platform</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <NavItem icon={Home} label="Dashboard" active />
            <NavItem icon={Workflow} label="Workflows" badge={3} />
            <NavItem icon={Mail} label="Email Templates" badge={12} />
            <NavItem icon={Users} label="Contacts" />
            <NavItem icon={BarChart3} label="Analytics" />
            <NavItem icon={Settings} label="Settings" />
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-gray-700">JD</span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">John Doe</p>
                <p className="text-xs text-gray-500">john@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {onSidebarToggle && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSidebarToggle}
                >
                  {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                </Button>
              )}
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
                <p className="text-sm text-gray-500">Welcome back, John!</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                Help
              </Button>
              <Button size="sm">
                New Workflow
              </Button>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

interface NavItemProps {
  icon: any
  label: string
  active?: boolean
  badge?: number
}

function NavItem({ icon: Icon, label, active = false, badge }: NavItemProps) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
        active
          ? 'bg-blue-50 text-blue-700 border border-blue-200'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="flex-1 text-left">{label}</span>
      {badge && (
        <Badge variant="secondary" className="text-xs">
          {badge}
        </Badge>
      )}
    </button>
  )
}