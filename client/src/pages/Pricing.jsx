import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  Zap,
  Sparkles,
  ArrowRight
} from 'lucide-react'
import useApiClient from '../lib/api'

export default function Pricing() {
  const api = useApiClient()

  const [billingCycle, setBillingCycle] = useState('monthly') // 'monthly' | 'annual'
  const [currentSub, setCurrentSub] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscriptionStatus()
  }, [])

  const fetchSubscriptionStatus = async () => {
    setLoading(true)
    try {
      const response = await api.get('/subscription/status')
      setCurrentSub(response.data)
    } catch (err) {
      console.error('Error fetching subscription status:', err)
    } finally {
      setLoading(false)
    }
  }

  const isAnnual = billingCycle === 'annual'

  const handlePayPremium = (planName) => {
    console.log(`Pay Premium clicked for ${planName}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-16 space-y-12">
      {/* Header Section */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
          <Zap className="w-3.5 h-3.5 text-indigo-400" />
          Flexible Enterprise Billing
        </div>

        <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Choose Your <span className="gradient-text">CoverFlow Plan</span>
        </h1>

        <p className="text-slate-400 text-base sm:text-lg">
          Scale your enterprise insurance operations with automated policy lifecycles, intelligent FNOL claims processing, and portfolio analytics.
        </p>

        {/* Monthly vs Annual Toggle */}
        <div className="pt-6 flex items-center justify-center gap-4">
          <span className={`text-sm font-semibold ${!isAnnual ? 'text-white' : 'text-slate-400'}`}>
            Monthly Billing
          </span>

          <button
            type="button"
            onClick={() => setBillingCycle(isAnnual ? 'monthly' : 'annual')}
            className="relative z-50 pointer-events-auto cursor-pointer w-16 h-8 rounded-full bg-slate-900 border border-slate-700 p-1 transition-colors focus:outline-none"
          >
            <div
              className={`w-6 h-6 rounded-full bg-indigo-500 transition-transform ${
                isAnnual ? 'translate-x-8 bg-cyan-400' : 'translate-x-0'
              }`}
            />
          </button>

          <div className="flex items-center gap-2">
            <span className={`text-sm font-semibold ${isAnnual ? 'text-white' : 'text-slate-400'}`}>
              Annual Billing
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold animate-pulse">
              Save 20%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
        {/* Starter Plan (Free) */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col justify-between relative space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Starter</h3>
                <p className="text-xs text-slate-400 mt-1">For independent brokers & underwriters</p>
              </div>
              {currentSub?.plan === 'Starter' && (
                <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold">
                  Current Plan
                </span>
              )}
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">$0</span>
              <span className="text-slate-400 text-sm">/ month</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-slate-800">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>1 Underwriter Seat</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Up to 50 Active Policies</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Standard Claims & FNOL Processing</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Basic Premium Payment Tracking</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Community & Knowledge Base Access</span>
              </li>
            </ul>
          </div>

          <button
            type="button"
            disabled={currentSub?.plan === 'Starter'}
            onClick={() => handlePayPremium('Starter')}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 relative z-50 pointer-events-auto cursor-pointer ${
              currentSub?.plan === 'Starter'
                ? 'bg-slate-800/80 text-slate-400 border border-slate-700/50 cursor-not-allowed pointer-events-none'
                : 'bg-slate-800 hover:bg-slate-700 text-white hover:scale-105 active:scale-95'
            }`}
          >
            {currentSub?.plan === 'Starter' ? 'Current Active Plan' : 'Select Starter Plan'}
          </button>
        </div>

        {/* Pro Plan (Highlight Most Popular) */}
        <div className="glass-panel p-8 rounded-3xl border-2 border-indigo-500 shadow-2xl shadow-indigo-600/20 flex flex-col justify-between relative space-y-6 bg-slate-900/90 hover:border-indigo-400 transition-all">
          {/* Badge */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white text-xs font-extrabold uppercase tracking-wider shadow-md flex items-center gap-1.5 z-20 pointer-events-none">
            <Sparkles className="w-3.5 h-3.5" /> Most Popular
          </div>

          <div className="space-y-6 pt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-extrabold text-white">Pro Enterprise</h3>
                <p className="text-xs text-slate-400 mt-1">Workflow automation for growing agencies</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-extrabold text-white">
                ${isAnnual ? '15' : '19'}
              </span>
              <span className="text-slate-400 text-sm">/ month</span>
              {isAnnual && <span className="text-xs text-emerald-400 ml-2 font-semibold">billed annually</span>}
            </div>

            <ul className="space-y-3.5 text-xs text-slate-200 pt-4 border-t border-slate-800">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">Up to 5 Team Seats</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="font-semibold text-white">Unlimited Active Policies</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Priority FNOL & AI Fraud Risk Scoring</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automated Premium Invoicing</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>CSV Reporting & Data Exports</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>24/7 Priority Support</span>
              </li>
            </ul>
          </div>

          <Link
            to="/premiums"
            onClick={() => handlePayPremium('Pro Enterprise')}
            className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:opacity-95 shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all duration-200 relative z-50 pointer-events-auto cursor-pointer hover:scale-105 active:scale-95 text-center"
          >
            Pay Premium
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Enterprise Plan */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-800 flex flex-col justify-between relative space-y-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white">Carrier Enterprise</h3>
                <p className="text-xs text-slate-400 mt-1">For insurance carriers & reinsurance firms</p>
              </div>
            </div>

            <div className="flex items-baseline gap-1">
              <span className="text-4xl font-extrabold text-white">
                ${isAnnual ? '79' : '99'}
              </span>
              <span className="text-slate-400 text-sm">/ month</span>
              {isAnnual && <span className="text-xs text-emerald-400 ml-2 font-semibold">billed annually</span>}
            </div>

            <ul className="space-y-3 text-xs text-slate-300 pt-4 border-t border-slate-800">
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Unlimited Underwriter Seats</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Multi-Carrier Portfolio Heatmaps</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Custom REST API & Webhooks</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Dedicated Account Manager & Actuarial SLA</span>
              </li>
              <li className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>SOC 2 Type II Audit Log Export</span>
              </li>
            </ul>
          </div>

          <Link
            to="/premiums"
            onClick={() => handlePayPremium('Carrier Enterprise')}
            className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 flex items-center justify-center gap-2 transition-all duration-200 relative z-50 pointer-events-auto cursor-pointer hover:scale-105 active:scale-95 text-center"
          >
            Pay Premium
          </Link>
        </div>
      </div>
    </div>
  )
}
