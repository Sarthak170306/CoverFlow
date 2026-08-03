import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
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
  LogIn,
  UserPlus,
  Sun,
  Moon
} from 'lucide-react'

export default function Navbar() {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark' || document.documentElement.classList.contains('dark')
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  const toggleDarkMode = () => {
    const nextDark = !isDark
    setIsDark(nextDark)
    if (nextDark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/60 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
            <ShieldCheck className="w-6 h-6 text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-indigo-300 transition-colors">
            Cover<span className="gradient-text">Flow</span>
          </span>
        </Link>

        <nav className="flex items-center gap-3 sm:gap-4">
          <SignedIn>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-all duration-200"
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link
              to="/customers"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-all duration-200"
            >
              <Users className="w-4 h-4 text-indigo-400" />
              <span className="hidden sm:inline">Customers</span>
            </Link>
            <Link
              to="/policies"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-all duration-200"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span className="hidden md:inline">Policies</span>
            </Link>
            <Link
              to="/premiums"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-all duration-200"
            >
              <CreditCard className="w-4 h-4 text-indigo-400" />
              <span className="hidden lg:inline">Premiums</span>
            </Link>
            <Link
              to="/claims"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-all duration-200"
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              <span className="hidden lg:inline">Claims</span>
            </Link>
            <Link
              to="/reports"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-all duration-200"
            >
              <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
              <span className="hidden xl:inline">Reports</span>
            </Link>
            <Link
              to="/settings"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-all duration-200"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              <span className="hidden xl:inline">Settings</span>
            </Link>

            {/* Distinct Upgrade Button */}
            <Link
              to="/pricing"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-extrabold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 shadow-md shadow-indigo-600/30 transition-all border border-indigo-400/40"
            >
              <Zap className="w-3.5 h-3.5 fill-white" />
              <span>Upgrade</span>
            </Link>

            {/* Dark Mode Toggle Button */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Toggle Dark / Light Mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            <div className="pl-2 border-l border-slate-800">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

          <SignedOut>
            {/* Dark Mode Toggle for SignedOut */}
            <button
              type="button"
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Toggle Dark / Light Mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>

            <Link
              to="/sign-in"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all duration-200"
            >
              <LogIn className="w-4 h-4 text-slate-400" />
              Sign In
            </Link>
            <Link
              to="/sign-up"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 transition-all duration-200"
            >
              <UserPlus className="w-4 h-4" />
              Get Started
            </Link>
          </SignedOut>
        </nav>
      </div>
    </header>
  )
}
