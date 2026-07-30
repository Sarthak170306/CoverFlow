import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/clerk-react'
import {
  ShieldCheck,
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  ShieldAlert,
  FileSpreadsheet,
  Settings,
  Zap,
  ChevronLeft,
  ChevronRight,
  LogIn,
  UserPlus
} from 'lucide-react'

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const location = useLocation()
  const { user } = useUser()

  // Mobile Auto-Collapse Logic
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true)
      }
    }

    // Check on initial component mount
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed)
  }

  const navItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      altPaths: ['/'],
      icon: LayoutDashboard,
      color: 'text-indigo-400'
    },
    {
      name: 'Customers',
      path: '/customers',
      icon: Users,
      color: 'text-indigo-400'
    },
    {
      name: 'Policies',
      path: '/policies',
      icon: FileText,
      color: 'text-indigo-400'
    },
    {
      name: 'Premiums',
      path: '/premiums',
      icon: CreditCard,
      color: 'text-indigo-400'
    },
    {
      name: 'Claims',
      path: '/claims',
      icon: ShieldAlert,
      color: 'text-amber-400'
    },
    {
      name: 'Reports',
      path: '/reports',
      icon: FileSpreadsheet,
      color: 'text-cyan-400'
    },
    {
      name: 'Settings',
      path: '/settings',
      icon: Settings,
      color: 'text-slate-400'
    }
  ]

  const isActive = (item) => {
    if (location.pathname === item.path) return true
    if (item.altPaths && item.altPaths.includes(location.pathname)) return true
    return false
  }

  return (
    <aside
      className={`relative sticky top-0 h-screen shrink-0 bg-slate-900/95 border-r border-slate-800/80 backdrop-blur-md transition-all duration-300 flex flex-col justify-between z-40 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Absolute Toggle Button positioned on the right border */}
      <button
        type="button"
        onClick={toggleSidebar}
        className="absolute -right-3 top-7 bg-slate-800 border border-slate-700 rounded-full w-6 h-6 z-50 flex items-center justify-center cursor-pointer hover:bg-slate-700 transition-colors shadow-md text-slate-300 hover:text-white"
        title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
      >
        {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Top Header / Logo Section */}
      <div className="p-4 border-b border-slate-800/80 flex items-center gap-3 overflow-hidden">
        <Link to="/" className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 shrink-0 hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <span className="font-extrabold text-xl tracking-tight text-white whitespace-nowrap">
              Cover<span className="gradient-text">Flow</span>
            </span>
          )}
        </Link>
      </div>

      {/* Main Navigation Links */}
      <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
        <SignedIn>
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item)
            return (
              <Link
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-slate-800/90 text-white font-bold border-l-4 border-indigo-500 shadow-md'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 ${active ? 'text-indigo-400' : item.color}`} />
                {!isCollapsed && <span className="truncate">{item.name}</span>}
              </Link>
            )
          })}

          {/* Upgrade CTA Link */}
          <div className="pt-4 mt-4 border-t border-slate-800/80">
            <Link
              to="/pricing"
              title={isCollapsed ? 'Upgrade Plan' : undefined}
              className={`flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-600/30 transition-all border border-indigo-400/40 ${
                isCollapsed ? 'justify-center' : ''
              }`}
            >
              <Zap className="w-5 h-5 shrink-0 fill-white text-white" />
              {!isCollapsed && <span className="truncate">Upgrade Plan</span>}
            </Link>
          </div>
        </SignedIn>

        <SignedOut>
          <div className="space-y-2">
            <Link
              to="/sign-in"
              className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all"
            >
              <LogIn className="w-5 h-5 text-slate-400 shrink-0" />
              {!isCollapsed && <span>Sign In</span>}
            </Link>
            <Link
              to="/sign-up"
              className="flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all"
            >
              <UserPlus className="w-5 h-5 shrink-0" />
              {!isCollapsed && <span>Get Started</span>}
            </Link>
          </div>
        </SignedOut>
      </div>

      {/* Bottom User Section */}
      <div className="p-4 border-t border-slate-800/80 flex items-center gap-3 overflow-hidden">
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
          {!isCollapsed && (
            <div className="truncate text-left">
              <div className="text-xs font-bold text-white truncate">
                {user?.fullName || user?.firstName || 'Underwriter'}
              </div>
              <div className="text-[11px] text-slate-400 truncate">
                {user?.primaryEmailAddress?.emailAddress}
              </div>
            </div>
          )}
        </SignedIn>
      </div>
    </aside>
  )
}
