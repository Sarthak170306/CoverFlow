import React, { useState } from 'react'
import {
  FileSpreadsheet,
  Download,
  ShieldAlert,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  FileCheck,
  Zap,
  HardDrive
} from 'lucide-react'
import useApiClient from '../lib/api'

export default function Reports() {
  const api = useApiClient()

  const [downloading, setDownloading] = useState(null) // 'claims' | 'premiums' | null
  const [error, setError] = useState(null)
  const [successMsg, setSuccessMsg] = useState(null)

  const handleDownloadCSV = async (endpoint, defaultFilename, typeKey) => {
    setDownloading(typeKey)
    setError(null)
    setSuccessMsg(null)

    try {
      const response = await api.get(endpoint, {
        responseType: 'blob'
      })

      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', defaultFilename)
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)

      setSuccessMsg(`Successfully exported ${defaultFilename}`)
    } catch (err) {
      console.error('Error downloading report CSV:', err)
      setError(err.response?.data?.message || 'Failed to generate and download report CSV. Please try again.')
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="glass-panel rounded-3xl p-8 border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-2">
            <FileSpreadsheet className="w-4 h-4" /> Compliance & Financial Exports
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white">System Reports & Exports</h1>
          <p className="text-slate-400 text-sm mt-1 max-w-2xl">
            Generate and stream real-time CSV data exports for claims auditing, loss ratios, premium revenues, and regulatory reporting.
          </p>
        </div>
      </div>

      {/* Error & Success Feedback Alerts */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Card 1: Claims Master Report */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6 relative overflow-hidden hover:border-amber-500/30 transition-all group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-semibold">
                CSV Export
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors">
                Claims Master Report
              </h2>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                Export complete history of all loss claims, settlement statuses, requested amounts, policy numbers, and policyholder contact details.
              </p>
            </div>

            <div className="pt-2 space-y-2 text-xs text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Includes PENDING, VERIFIED, APPROVED, and REJECTED claims</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Extracts formatted submission dates and claim numbers</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleDownloadCSV('/reports/claims/csv', 'claims_report.csv', 'claims')}
            disabled={downloading !== null}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-600/20 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 hover:-translate-y-0.5"
          >
            {downloading === 'claims' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Claims CSV...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Claims CSV
              </>
            )}
          </button>
        </div>

        {/* Card 2: Premium Revenue Report */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col justify-between space-y-6 relative overflow-hidden hover:border-emerald-500/30 transition-all group">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                <CreditCard className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400 text-xs font-semibold">
                CSV Export
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-white group-hover:text-emerald-300 transition-colors">
                Premium Revenue Report
              </h2>
              <p className="text-slate-400 text-sm mt-2 leading-relaxed">
                Export comprehensive financial transaction logs, transaction reference IDs, payment methods (Credit Card, Bank Transfer, UPI, Cash), and payment dates.
              </p>
            </div>

            <div className="pt-2 space-y-2 text-xs text-slate-400 border-t border-slate-800/80">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Includes PAID, PENDING, and OVERDUE transactions</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Auditable reference IDs and policyholder relations</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => handleDownloadCSV('/reports/premiums/csv', 'premiums_report.csv', 'premiums')}
            disabled={downloading !== null}
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2.5 transition-all disabled:opacity-50 hover:-translate-y-0.5"
          >
            {downloading === 'premiums' ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Generating Premiums CSV...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Download Premium Revenue CSV
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}