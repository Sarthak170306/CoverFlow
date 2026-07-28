import React, { useState, useEffect } from 'react'
import { UserProfile } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'
import {
  Settings as SettingsIcon,
  Server,
  RefreshCw,
  Clock,
  Shield
} from 'lucide-react'
import axios from 'axios'

export default function Settings() {
  const [healthData, setHealthData] = useState(null)
  const [loadingHealth, setLoadingHealth] = useState(true)

  const fetchHealth = async () => {
    setLoadingHealth(true)
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
      const response = await axios.get(`${apiBase}/health`)
      setHealthData(response.data)
    } catch (err) {
      setHealthData({ status: 'offline', error: err.message })
    } finally {
      setLoadingHealth(false)
    }
  }

  useEffect(() => {
    fetchHealth()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 p-4 md:p-8">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
            <SettingsIcon className="w-4 h-4" /> Preferences & Profile Configuration
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">System Settings</h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Manage your underwriter account profile, security credentials, multi-factor authentication, and monitor real-time API system health.
          </p>
        </div>
      </div>

      {/* System Status & Security Section (Top Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Health Card */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-indigo-400" /> System Status
            </h2>
            <button
              onClick={fetchHealth}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              title="Refresh Status"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingHealth ? 'animate-spin text-indigo-400' : ''}`} />
            </button>
          </div>

          <div className="space-y-4">
            <div className="glass-card p-4 rounded-2xl border border-slate-800/80 space-y-2">
              <div className="text-xs text-slate-400 font-medium">CoverFlow Express API Server</div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-extrabold text-white">API Engine</span>
                {loadingHealth ? (
                  <span className="text-xs text-slate-400">Checking...</span>
                ) : healthData?.status === 'active' || healthData?.status === 'ok' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    System Operational
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    Offline
                  </span>
                )}
              </div>
            </div>

            {healthData?.timestamp && (
              <div className="flex items-center gap-2 text-xs text-slate-400 px-1">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span>Last Checked: {new Date(healthData.timestamp).toLocaleTimeString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Security Notice Card */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800 space-y-3 shadow-xl flex flex-col justify-center">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Shield className="w-5 h-5 text-cyan-400" /> Account Security Notice
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Your profile credentials, password updates, 2FA, and active sessions are securely managed via Clerk Authentication with enterprise SOC 2 Type II compliance.
          </p>
        </div>
      </div>

      {/* Main Section: Perfectly Centered Clerk UserProfile Container */}
      <div className="w-full max-w-5xl mx-auto flex justify-center items-center bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl p-4 sm:p-8 py-8 md:py-12 overflow-x-auto">
        <UserProfile
          routing="hash"
          appearance={{
            baseTheme: dark,
            elements: {
              rootBox: 'w-full flex justify-center items-center',
              card: 'bg-transparent shadow-none border-0 w-full p-0 max-w-full',
              navbar: 'bg-slate-950/40 border-b border-slate-800/80 rounded-xl mb-6 p-2',
              navbarButton: 'text-slate-300 hover:text-white font-medium text-sm',
              navbarButtonActive: 'text-indigo-400 font-bold bg-slate-800/80 rounded-lg',
              pageScrollBox: 'bg-transparent p-0 w-full max-w-full',
              headerTitle: 'text-white font-bold text-xl',
              headerSubtitle: 'text-slate-400 text-sm',
              profileSectionTitleText: 'text-white font-bold text-base border-b border-slate-800/80 pb-2 mb-4',
              userPreviewMainIdentifier: 'text-white font-bold',
              userPreviewSecondaryIdentifier: 'text-slate-400 text-xs',
              formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all',
              formFieldLabel: 'text-slate-300 font-semibold text-xs uppercase tracking-wider',
              formFieldInput: 'bg-slate-950 border-slate-800 text-white rounded-xl focus:border-indigo-500 text-sm'
            }
          }}
        />
      </div>
    </div>
  )
}
