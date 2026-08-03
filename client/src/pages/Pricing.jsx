import React, { useState } from 'react'
import {
  Zap,
  CheckCircle2,
  Sparkles,
  CreditCard,
  Loader2,
  AlertCircle
} from 'lucide-react'
import useApiClient from '../lib/api'

export default function Pricing() {
  const api = useApiClient()

  const [loading, setLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const handlePayPremium = async (amountVal = 999) => {
    setLoading(true)
    setSuccessMessage('')
    setErrorMessage('')

    try {
      const response = await api.post('/premiums/pay', {
        policyId: 'dummy_policy_123',
        amount: amountVal
      })

      if (response.data?.success || response.status === 200) {
        setSuccessMessage('Premium Paid Successfully!')
      } else {
        throw new Error(response.data?.message || 'Payment processing failed.')
      }
    } catch (err) {
      console.error('Error processing premium payment:', err)
      setErrorMessage(
        err.response?.data?.message || err.message || 'Failed to record premium payment.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-16 space-y-12 p-4 md:p-8 dark:bg-slate-900 dark:text-white transition-colors duration-200">
      {/* Header Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          Premium Payment Portal
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          CoverFlow <span className="gradient-text">Premium Tracking System</span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg">
          Process enterprise policy premium payments with real-time Zod request validation and database ledger tracking.
        </p>

        {/* Notifications */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm font-semibold flex items-center justify-center gap-2 max-w-xl mx-auto animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm font-semibold flex items-center justify-center gap-2 max-w-xl mx-auto animate-fadeIn">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {/* Premium Payment Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* Starter Policy Plan */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 flex flex-col justify-between relative space-y-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">Standard Policy Premium</h3>
              <p className="text-xs text-slate-400 mt-1">Single Underwriter Policy Coverage</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">$499</span>
              <span className="text-slate-400 text-sm">/ term</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-slate-800">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Policy ID: dummy_policy_123</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Instant Database Ledger Sync</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Zod Backend Input Validation</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => handlePayPremium(499)}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-slate-800 hover:bg-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 text-indigo-400" />
                Pay Premium
              </>
            )}
          </button>
        </div>

        {/* Pro Enterprise Policy Plan (Featured) */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border-2 border-indigo-500 shadow-2xl shadow-indigo-600/20 flex flex-col justify-between relative space-y-6 bg-slate-900/90 hover:border-indigo-400 transition-all">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white text-xs font-extrabold uppercase tracking-wider shadow-md flex items-center gap-1.5 z-20 pointer-events-none">
            <Sparkles className="w-3.5 h-3.5" /> Featured Plan
          </div>

          <div className="space-y-6 pt-2">
            <div>
              <h3 className="text-2xl font-extrabold text-white">Pro Enterprise Policy</h3>
              <p className="text-xs text-slate-400 mt-1">Comprehensive Risk & Liability Coverage</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-extrabold text-white">$999</span>
              <span className="text-slate-400 text-sm">/ term</span>
            </div>

            <ul className="space-y-3.5 text-xs text-slate-200 pt-4 border-t border-slate-800">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">Policy ID: dummy_policy_123</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">Full FNOL & Claims Tracking</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automatic Payment Record Generation</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Strict Zod Schema Validation</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => handlePayPremium(999)}
            className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4" />
                Pay Premium
              </>
            )}
          </button>
        </div>

        {/* Carrier Enterprise Plan */}
        <div className="glass-panel p-6 md:p-8 rounded-3xl border border-slate-800 flex flex-col justify-between relative space-y-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold text-white">Carrier Enterprise Policy</h3>
              <p className="text-xs text-slate-400 mt-1">Commercial Reinsurance Coverage</p>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">$2,499</span>
              <span className="text-slate-400 text-sm">/ term</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-slate-800">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Policy ID: dummy_policy_123</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Multi-Carrier Portfolio Sync</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Enterprise SLA Audit Trail</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() => handlePayPremium(2499)}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                Processing Payment...
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 text-cyan-400" />
                Pay Premium
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}