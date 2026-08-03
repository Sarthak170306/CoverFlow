import React, { useEffect, useState, useCallback } from 'react'
import { useUser } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import {
  Users,
  ShieldCheck,
  DollarSign,
  ShieldAlert,
  Activity,
  Server,
  RefreshCw,
  TrendingUp,
  CreditCard,
  FileCheck,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Loader2,
  Printer
} from 'lucide-react'
import useApiClient from '../lib/api'
import axios from 'axios'

export default function Dashboard() {
  const { user } = useUser()
  const api = useApiClient()

  const [stats, setStats] = useState({
    totalCustomers: 0,
    activePolicies: 0,
    totalRevenue: 0,
    pendingClaims: 0
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loadingStats, setLoadingStats] = useState(true)
  const [errorStats, setErrorStats] = useState(null)

  // API Backend Health State
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

  const fetchDashboardData = useCallback(async () => {
    setLoadingStats(true)
    setErrorStats(null)
    try {
      const response = await api.get('/dashboard/stats')
      if (response.data.stats) {
        setStats(response.data.stats)
      }
      if (response.data.recentActivity) {
        setRecentActivity(response.data.recentActivity)
      }
    } catch (err) {
      console.error('Error fetching dashboard analytics:', err)
      setErrorStats(err.response?.data?.message || 'Failed to load executive analytics.')
    } finally {
      setLoadingStats(false)
    }
  }, [api])

  useEffect(() => {
    checkHealth()
    fetchDashboardData()
  }, [fetchDashboardData])

  const getActivityBadge = (type, status) => {
    if (type === 'CLAIM') {
      switch (status) {
        case 'APPROVED':
          return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">Claim Approved</span>
        case 'VERIFIED':
          return <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">Claim Verified</span>
        case 'REJECTED':
          return <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">Claim Rejected</span>
        default:
          return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">Claim Pending</span>
      }
    } else {
      switch (status) {
        case 'PAID':
          return <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">Payment Received</span>
        case 'OVERDUE':
          return <span className="px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">Payment Overdue</span>
        default:
          return <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">Payment Pending</span>
      }
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8 p-4 md:p-8 dark:bg-slate-900 dark:text-white transition-colors duration-200">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-6 md:p-8 border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-600/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
              <Activity className="w-3.5 h-3.5" />
              Executive Operations Center
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
              Welcome back, <span className="gradient-text">{user?.firstName || user?.fullName || 'Underwriter'}</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              CoverFlow Real-Time Enterprise Analytics Overview
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Download Report Button (PDF Export via window.print) */}
            <button
              type="button"
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Download Report
            </button>

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
                  ) : apiHealth?.status === 'active' || apiHealth?.status === 'ok' ? (
                    <span className="text-emerald-400 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      System Operational
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
      </div>

      {/* Analytics Error */}
      {errorStats && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorStats}</span>
        </div>
      )}

      {/* KPI Metric Cards Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Customers */}
        <Link to="/customers" className="glass-card rounded-2xl p-6 border border-slate-800 transition-all hover:-translate-y-1 block">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Total Customers</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-white">
            {loadingStats ? <Loader2 className="w-6 h-6 animate-spin text-slate-500" /> : stats.totalCustomers.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-indigo-400 flex items-center gap-1 font-semibold">
            Manage Policyholders &rarr;
          </div>
        </Link>

        {/* Active Policies */}
        <Link to="/policies" className="glass-card rounded-2xl p-6 border border-slate-800 transition-all hover:-translate-y-1 block">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Active Policies</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-white">
            {loadingStats ? <Loader2 className="w-6 h-6 animate-spin text-slate-500" /> : stats.activePolicies.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-emerald-400 flex items-center gap-1 font-semibold">
            View Policy Registry &rarr;
          </div>
        </Link>

        {/* Total Revenue */}
        <Link to="/premiums" className="glass-card rounded-2xl p-6 border border-slate-800 transition-all hover:-translate-y-1 block">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Total Revenue</span>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-white">
            {loadingStats ? <Loader2 className="w-6 h-6 animate-spin text-slate-500" /> : `$${stats.totalRevenue.toLocaleString()}`}
          </div>
          <div className="mt-2 text-xs text-cyan-400 flex items-center gap-1 font-semibold">
            Track Collections &rarr;
          </div>
        </Link>

        {/* Pending Claims */}
        <Link to="/claims" className="glass-card rounded-2xl p-6 border border-slate-800 transition-all hover:-translate-y-1 block">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-400">Pending Claims</span>
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 text-3xl font-extrabold text-amber-400">
            {loadingStats ? <Loader2 className="w-6 h-6 animate-spin text-slate-500" /> : stats.pendingClaims.toLocaleString()}
          </div>
          <div className="mt-2 text-xs text-amber-400 flex items-center gap-1 font-semibold">
            Process Open Claims &rarr;
          </div>
        </Link>
      </div>

      {/* Combined Recent Activity Feed Section */}
      <div className="glass-panel rounded-2xl border border-slate-800 p-6 space-y-4 shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-400" /> Recent Operations & Transactions
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Real-time feed combining recent claims and premium payments</p>
          </div>
          <button
            onClick={fetchDashboardData}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Refresh Feed"
          >
            <RefreshCw className={`w-4 h-4 ${loadingStats ? 'animate-spin text-indigo-400' : ''}`} />
          </button>
        </div>

        {loadingStats ? (
          <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
            <span>Loading recent activity feed...</span>
          </div>
        ) : recentActivity.length === 0 ? (
          <div className="py-12 text-center text-slate-500">
            <p className="text-sm font-semibold text-slate-400">No Recent Activity Recorded</p>
            <p className="text-xs mt-1">Issue policies, file claims, or record premium payments to populate your feed.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentActivity.map((act) => (
              <div
                key={act.id}
                className="glass-card p-4 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-700/80 transition-all"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      act.type === 'CLAIM'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    }`}
                  >
                    {act.type === 'CLAIM' ? <FileCheck className="w-5 h-5" /> : <CreditCard className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-white text-sm">{act.title}</span>
                      {getActivityBadge(act.type, act.status)}
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-2 flex-wrap">
                      <span>Policyholder: <strong className="text-slate-300">{act.customerName}</strong></span>
                      <span>•</span>
                      <span>Policy: <strong className="text-indigo-400">#{act.policyNumber}</strong></span>
                      <span>•</span>
                      <span className="text-slate-500">{act.description}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="font-extrabold text-white text-base">
                    ${act.amount?.toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {new Date(act.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
