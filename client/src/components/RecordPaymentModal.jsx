import React, { useState, useEffect } from 'react'
import { X, CreditCard, Sparkles, AlertCircle, Loader2 } from 'lucide-react'
import useApiClient from '../lib/api'

export default function RecordPaymentModal({ isOpen, onClose, onSuccess, preselectedPolicyId = '' }) {
  const api = useApiClient()

  const [policies, setPolicies] = useState([])
  const [loadingPolicies, setLoadingPolicies] = useState(false)

  const [formData, setFormData] = useState({
    policyId: preselectedPolicyId || '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'Credit Card',
    transactionId: '',
    status: 'PAID'
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen) {
      fetchPolicies()
      generateAutoTxnId()
      if (preselectedPolicyId) {
        setFormData((prev) => ({ ...prev, policyId: preselectedPolicyId }))
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
      console.error('Error fetching policies list for payment recording:', err)
    } finally {
      setLoadingPolicies(false)
    }
  }

  const generateAutoTxnId = () => {
    const year = new Date().getFullYear()
    const randomNum = Math.floor(100000 + Math.random() * 900000)
    setFormData((prev) => ({ ...prev, transactionId: `TXN-${year}-${randomNum}` }))
  }

  const handlePolicyChange = (e) => {
    const selectedPolicyId = e.target.value
    setFormData((prev) => {
      const selected = policies.find((p) => p.id === selectedPolicyId)
      return {
        ...prev,
        policyId: selectedPolicyId,
        amount: selected ? selected.premiumAmount : prev.amount
      }
    })
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

    if (!formData.policyId || !formData.amount || !formData.paymentDate) {
      setError('Please select a policy and enter the payment amount.')
      setSubmitting(false)
      return
    }

    try {
      await api.post('/premiums', formData)
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error recording payment:', err)
      setError(err.response?.data?.message || 'Failed to record premium payment. Please try again.')
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
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Record Premium Payment</h2>
              <p className="text-xs text-slate-400">Log financial transactions and policy collections</p>
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
              Select Policy <span className="text-rose-400">*</span>
            </label>
            {loadingPolicies ? (
              <div className="px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                Loading policy registry...
              </div>
            ) : (
              <select
                name="policyId"
                value={formData.policyId}
                onChange={handlePolicyChange}
                className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition-all"
              >
                <option value="">-- Choose Policy --</option>
                {policies.map((p) => (
                  <option key={p.id} value={p.id}>
                    #{p.policyNumber} — {p.customer?.name || 'Customer'} (${p.premiumAmount})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Amount & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Payment Amount ($) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="e.g. 1200.00"
                className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Payment Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                name="paymentDate"
                value={formData.paymentDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition-all"
              />
            </div>
          </div>

          {/* Payment Method & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Payment Method
              </label>
              <select
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition-all"
              >
                <option value="Credit Card">Credit Card</option>
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="UPI">UPI Payment</option>
                <option value="Cash">Cash / Cheque</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Payment Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition-all"
              >
                <option value="PAID">PAID</option>
                <option value="PENDING">PENDING</option>
                <option value="OVERDUE">OVERDUE</option>
              </select>
            </div>
          </div>

          {/* Transaction Reference ID */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Transaction Reference ID
              </label>
              <button
                type="button"
                onClick={generateAutoTxnId}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
              >
                <Sparkles className="w-3 h-3" /> Auto
              </button>
            </div>
            <input
              type="text"
              name="transactionId"
              value={formData.transactionId}
              onChange={handleChange}
              placeholder="e.g. TXN-2026-94812"
              className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-all"
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
              className="px-6 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Recording...
                </>
              ) : (
                'Save Transaction'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
