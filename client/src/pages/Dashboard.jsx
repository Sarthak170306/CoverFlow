import React, { useEffect, useState } from 'react'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { FileCheck, ShieldAlert, DollarSign, TrendingUp, Activity, CheckCircle, Server, RefreshCw } from 'lucide-react'

export default function Dashboard() {
  const { user } = useUser()
  const [apiHealth, setApiHealth] = useState(null)
  const [loadingHealth, setLoadingHealth] = useState(true)

  const checkHealth = async () => {
    setLoadingHealth(true)
    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'
      const response = await axios.get(`${apiBase}/health`)
      setApiHealth(response.data)
    } catch (err) {
      setApiHealth({ status: 'offline', error: err.message })
    } finally {
      setLoadingHealth(false)
    }
  }

  useEffect(() => {
    checkHealth()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
              <Activity className="w-3.5 h-3.5" />
              Enterprise Operations Center
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Welcome back, <span className="gradient-text">{user?.firstName || 'Underwriter'}</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              CoverFlow Insurance Management Portal — Day 1 Overview
            </p>
          </div>

          {/* API Backend Health Badge */}
          <div className="glass-card rounded-2xl p-4 border border-slate-800/80 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-indigo-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium flex items-center gap-2">
                Express API Status
                <button
                  onClick={checkHealth}
                  className="hover:text-indigo-400 transition-colors"
                  title="Refresh API Status"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingHealth ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="text-sm font-bold flex items-center gap-2 mt-0.5">
                {loadingHealth ? (
                  <span className="text-slate-400">Checking status...</span>
                ) : apiHealth?.status === 'ok' ? (
                  <span className="text-emerald-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    Online ({apiHealth.app})
                  </span>
                ) : (
                  <span className="text-rose-400 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    Offline / Connection Refused
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Overview Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Active Policies</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-white">1,482</div>
          <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +12.4% vs last month
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Claims Pending</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-white">37</div>
          <div className="mt-2 text-xs text-slate-400">
            Average resolution: 2.4 days
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Written Premium</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-white">$4.82M</div>
          <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> +8.1% target quota
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Risk Score</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-emerald-400">Low Risk</div>
          <div className="mt-2 text-xs text-slate-400">
            Portfolio Loss Ratio: 41.2%
          </div>
        </div>
      </div>
    </div>
  )
}
