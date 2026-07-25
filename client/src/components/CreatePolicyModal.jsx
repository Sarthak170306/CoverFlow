import React, { useState, useEffect } from 'react'
import { X, ShieldPlus, Sparkles, AlertCircle, Loader2 } from 'lucide-react'
import useApiClient from '../lib/api'

export default function CreatePolicyModal({ isOpen, onClose, onSuccess, preselectedCustomerId = '' }) {
  const api = useApiClient()

  const [customers, setCustomers] = useState([])
  const [loadingCustomers, setLoadingCustomers] = useState(false)

  const [formData, setFormData] = useState({
    customerId: preselectedCustomerId || '',
    policyType: 'Health',
    policyNumber: '',
    premiumAmount: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  })

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (isOpen) {
      fetchCustomers()
      generateAutoNumber()
      if (preselectedCustomerId) {
        setFormData((prev) => ({ ...prev, customerId: preselectedCustomerId }))
      }
      setError(null)
    }
  }, [isOpen, preselectedCustomerId])

  const fetchCustomers = async () => {
    setLoadingCustomers(true)
    try {
      const response = await api.get('/customers', { params: { limit: 100 } })
      setCustomers(response.data.customers || [])
    } catch (err) {
      console.error('Error fetching customers list for policy creation:', err)
    } finally {
      setLoadingCustomers(false)
    }
  }

  const generateAutoNumber = () => {
    const year = new Date().getFullYear()
    const randomNum = Math.floor(100000 + Math.random() * 900000)
    setFormData((prev) => ({ ...prev, policyNumber: `POL-${year}-${randomNum}` }))
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

    if (!formData.customerId || !formData.policyType || !formData.premiumAmount || !formData.startDate || !formData.endDate) {
      setError('Please fill in all required fields.')
      setSubmitting(false)
      return
    }

    try {
      await api.post('/policies', formData)
      onSuccess()
      onClose()
    } catch (err) {
      console.error('Error creating policy:', err)
      setError(err.response?.data?.message || 'Failed to create policy. Please try again.')
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
              <ShieldPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Issue Insurance Policy</h2>
              <p className="text-xs text-slate-400">Create and bind a new policy for a registered customer</p>
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
          {/* Customer Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Select Policyholder <span className="text-rose-400">*</span>
            </label>
            {loadingCustomers ? (
              <div className="px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-400 flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                Loading customers...
              </div>
            ) : (
              <select
                name="customerId"
                value={formData.customerId}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition-all"
              >
                <option value="">-- Choose Customer --</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Policy Type & Policy Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Policy Type <span className="text-rose-400">*</span>
              </label>
              <select
                name="policyType"
                value={formData.policyType}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition-all"
              >
                <option value="Health">Health Insurance</option>
                <option value="Life">Life Insurance</option>
                <option value="Auto">Auto Insurance</option>
                <option value="Property">Property Insurance</option>
                <option value="Commercial">Commercial Insurance</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                  Policy Number
                </label>
                <button
                  type="button"
                  onClick={generateAutoNumber}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition-colors"
                >
                  <Sparkles className="w-3 h-3" /> Auto
                </button>
              </div>
              <input
                type="text"
                name="policyNumber"
                value={formData.policyNumber}
                onChange={handleChange}
                placeholder="e.g. POL-2026-10492"
                className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-all"
              />
            </div>
          </div>

          {/* Premium Amount */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Annual Premium Amount ($) <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              name="premiumAmount"
              value={formData.premiumAmount}
              onChange={handleChange}
              placeholder="e.g. 2400.00"
              className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-all"
            />
          </div>

          {/* Coverage Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Effective Start Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Policy Expiration Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-700/70 rounded-xl text-white focus:outline-none focus:border-indigo-500 text-sm transition-all"
              />
            </div>
          </div>

          {/* Actions */}
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
                  Issuing...
                </>
              ) : (
                'Issue Policy'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
