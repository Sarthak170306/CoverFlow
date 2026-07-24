import React from 'react'
import { Link } from 'react-router-dom'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { ShieldCheck, LayoutDashboard, Users, LogIn, UserPlus } from 'lucide-react'

export default function Navbar() {
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

        <nav className="flex items-center gap-4">
          <SignedIn>
            <Link
              to="/dashboard"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-all duration-200"
            >
              <LayoutDashboard className="w-4 h-4 text-indigo-400" />
              Dashboard
            </Link>
            <Link
              to="/customers"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-all duration-200"
            >
              <Users className="w-4 h-4 text-indigo-400" />
              Customers
            </Link>
            <div className="pl-2 border-l border-slate-800">
              <UserButton afterSignOutUrl="/" />
            </div>
          </SignedIn>

          <SignedOut>
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
