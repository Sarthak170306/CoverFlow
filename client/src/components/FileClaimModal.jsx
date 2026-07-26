import React, { useState, useEffect } from 'react'
import { X, ShieldAlert, AlertCircle, Loader2 } from 'lucide-react'
import useApiClient from '../lib/api'

export default function FileClaimModal({ isOpen, onClose, onSuccess, preselectedPolicyId = '' }) {
  const api = useApiClient()

  const [policies, setPolicies] = useState([])
  const [loadingPolicies, setLoadingPolicies] = useState(false)

  const [formData, setFormData] = useState({
    policyId: preselectedPolicyId || '',
    claimAmount: '',
    reason: ''
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen) {
      fetchPolicies()
      if (preselectedPolicyId) {
        setFormData((prev) => ({ ...prev, policyId: preselectedPolicyId }))
      } else {
        setFormData({ policyId: '', claimAmount: '', reason: '' })
      }
      setError(null)
    }
  }, [isOpen, preselectedPolicyId])

  const fetchPolicies = async () => {
    setLoadingPolicies(true)
    try {
      const response = await api.get('/policies', { params: { limit: 100 } })
      setPolicies(response.data.policies || [])
    } catch (err) {
      console.error('Error fetching policies list for claim filing:', err)
    } finally {
      setLoadingPolicies(false)
    }
  }

  if (!isOpen) return null

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (error) setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    if (!formData.policyId || !formData.claimAmount || !formData.reason.trim()) {
      setError('Please select a policy, enter the claim amount, and provide a detailed reason.')
      setSubmitting(false)
      return
    }

    try {
      await api.post('/claims', formData)
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error filing claim:', err)
      setError(err.response?.data?.message || 'Failed to submit claim. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg glass-panel border border-slate-800 rounded-2xl shadow-2xl p-6 sm:p-8 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">File Insurance Claim</h2>
              <p className="text-xs text-slate-400">Initiate FNOL and register policyholder claim request</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Policy Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Covered Policy <span className="text-rose-400">*</span>
            </label>
            {loadingPolicies ? (
              <div className="px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                Loading policy directory...
              </div>
            ) : (
              <select
                name="policyId"
                value={formData.policyId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-white focus:outline-none focus:border-amber-500 text-sm transition-all"
              >
                <option value="">-- Choose Policy --</option>
                {policies.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.policyNumber} ({p.policyType}) — {p.customer?.name || 'Customer'}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Claim Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Requested Claim Amount ($) <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              name="claimAmount"
              value={formData.claimAmount}
              onChange={handleChange}
              placeholder="e.g. 5000.00"
              className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 text-sm transition-all"
            />
          </div>

          {/* Reason Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Reason / Incident Description <span className="text-rose-400">*</span>
            </label>
            <textarea
              name="reason"
              rows={3}
              value={formData.reason}
              onChange={handleChange}
              placeholder="Provide a description of the loss or damage, date of incident, and supporting details..."
              className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 text-sm transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-5 py-2.5 text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 text-sm font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-xl shadow-lg shadow-amber-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Submitting Claim...
                </>
              ) : (
                'File Claim'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
