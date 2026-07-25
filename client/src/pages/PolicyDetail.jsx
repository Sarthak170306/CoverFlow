import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  FileText,
  User,
  Calendar,
  DollarSign,
  CheckCircle2,
  Clock,
  XCircle,
  RefreshCw,
  Ban,
  Shield,
  FileCheck,
  CreditCard,
  Loader2,
  AlertCircle,
  Mail,
  Phone
} from 'lucide-react'
import useApiClient from '../lib/api'

export default function PolicyDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const api = useApiClient()

  const [policy, setPolicy] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Renew Modal State
  const [renewModalOpen, setRenewModalOpen] = useState(false)
  const [renewEndDate, setRenewEndDate] = useState('')
  const [renewing, setRenewing] = useState(false)

  // Cancel State
  const [cancelling, setCancelling] = useState(false)

  const fetchPolicyDetail = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get(`/policies/${id}`)
      const fetchedPolicy = response.data.policy
      setPolicy(fetchedPolicy)

      // Set default renew end date to +1 year from current end date
      if (fetchedPolicy?.endDate) {
        const currentEnd = new Date(fetchedPolicy.endDate)
        const nextYear = new Date(currentEnd.setFullYear(currentEnd.getFullYear() + 1))
        setRenewEndDate(nextYear.toISOString().split('T')[0])
      }
    } catch (err) {
      console.error('Error fetching policy detail:', err)
      setError(err.response?.data?.message || 'Failed to load policy details.')
    } finally {
      setLoading(false)
    }
  }, [api, id])

  useEffect(() => {
    fetchPolicyDetail()
  }, [fetchPolicyDetail])

  const handleRenewPolicy = async (e) => {
    e.preventDefault()
    if (!renewEndDate) return
    setRenewing(true)
    try {
      await api.put(`/policies/${id}/renew`, { endDate: renewEndDate })
      setRenewModalOpen(false)
      fetchPolicyDetail()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to renew policy.')
    } finally {
      setRenewing(false)
    }
  }

  const handleCancelPolicy = async () => {
    if (!policy) return
    if (!window.confirm(`Are you sure you want to cancel policy #${policy.policyNumber}?`)) return

    setCancelling(true)
    try {
      await api.put(`/policies/${id}/cancel`)
      fetchPolicyDetail()
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel policy.')
    } finally {
      setCancelling(false)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ACTIVE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Active
          </span>
        )
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" /> Expired
          </span>
        )
      case 'CANCELLED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5" /> Cancelled
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-500/10 border border-slate-500/30 text-slate-400 text-xs font-semibold">
            {status}
          </span>
        )
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
        <span className="text-slate-400 text-sm">Loading policy specifications...</span>
      </div>
    )
  }

  if (error || !policy) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Policy Not Found</h2>
        <p className="text-slate-400 text-sm">{error || 'The requested policy details could not be loaded.'}</p>
        <Link
          to="/policies"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Policies List
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <div>
        <Link
          to="/policies"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Policies Directory
        </Link>
      </div>

      {/* Policy Header Banner */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
                {policy.policyType} Coverage
              </span>
              {getStatusBadge(policy.status)}
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">#{policy.policyNumber}</h1>
            <p className="text-xs text-slate-400">
              Created on {new Date(policy.createdAt).toLocaleDateString()}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setRenewModalOpen(true)}
              disabled={renewing}
              className="px-5 py-2.5 rounded-xl font-bold text-sm text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:-translate-y-0.5"
            >
              <RefreshCw className="w-4 h-4" /> Renew Policy
            </button>
            {policy.status !== 'CANCELLED' && (
              <button
                onClick={handleCancelPolicy}
                disabled={cancelling}
                className="px-5 py-2.5 rounded-xl font-semibold text-sm text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 flex items-center gap-2 transition-all"
              >
                {cancelling ? <Loader2 className="w-4 h-4 animate-spin" /> : <Ban className="w-4 h-4" />}
                Cancel Policy
              </button>
            )}
          </div>
        </div>

        {/* Coverage Overview Stats */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-6 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Annual Premium</div>
              <div className="text-xl font-extrabold text-white">${policy.premiumAmount?.toLocaleString()}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Effective Start Date</div>
              <div className="font-semibold text-white">{new Date(policy.startDate).toLocaleDateString()}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Expiration Date</div>
              <div className="font-semibold text-white">{new Date(policy.endDate).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Linked Customer & History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Policyholder Card */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <User className="w-4 h-4 text-indigo-400" /> Policyholder Profile
              </h2>
              {policy.customer && (
                <Link
                  to={`/customers/${policy.customer.id}`}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  View Full Profile &rarr;
                </Link>
              )}
            </div>

            {policy.customer ? (
              <div className="space-y-3 text-sm">
                <div className="font-bold text-white text-lg">{policy.customer.name}</div>
                <div className="flex items-center gap-2 text-slate-300 text-xs">
                  <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  <span>{policy.customer.email}</span>
                </div>
                {policy.customer.phone && (
                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{policy.customer.phone}</span>
                  </div>
                )}
                {policy.customer.address && (
                  <div className="text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <span className="block text-slate-500 font-medium mb-0.5">Address:</span>
                    {policy.customer.address}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-sm text-slate-500 italic">No customer linked to this policy.</div>
            )}
          </div>
        </div>

        {/* Claims & Premium Payments Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Claims History */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <FileCheck className="w-4 h-4 text-indigo-400" /> Claims History ({policy.claims?.length || 0})
            </h2>

            {!policy.claims || policy.claims.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No claims filed under this policy.</p>
            ) : (
              <div className="space-y-3">
                {policy.claims.map((claim) => (
                  <div key={claim.id} className="glass-card p-4 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white text-sm">${claim.claimAmount?.toLocaleString()}</div>
                      <div className="text-slate-400 mt-0.5">{claim.reason}</div>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-semibold">
                        {claim.status}
                      </span>
                      <div className="text-slate-500 text-[10px] mt-1">
                        {new Date(claim.submissionDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Premium Payments */}
          <div className="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <h2 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800/80 pb-3">
              <CreditCard className="w-4 h-4 text-indigo-400" /> Premium Payments ({policy.payments?.length || 0})
            </h2>

            {!policy.payments || policy.payments.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">No payment transactions recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {policy.payments.map((pmt) => (
                  <div key={pmt.id} className="glass-card p-4 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-white text-sm">${pmt.amount?.toLocaleString()}</div>
                      <div className="text-slate-400 mt-0.5">{new Date(pmt.paymentDate).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-semibold">
                        {pmt.paymentStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Renew Policy Modal */}
      {renewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md glass-panel border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-indigo-400" /> Renew Policy Coverage
              </h3>
              <button
                onClick={() => setRenewModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleRenewPolicy} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  New Policy Expiration Date <span className="text-rose-400">*</span>
                </label>
                <input
                  type="date"
                  value={renewEndDate}
                  onChange={(e) => setRenewEndDate(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setRenewModalOpen(false)}
                  className="px-4 py-2 text-sm text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={renewing}
                  className="px-5 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                >
                  {renewing ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Renewal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
