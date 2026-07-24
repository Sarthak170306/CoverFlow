import React, { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  ShieldCheck,
  FileText,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle
} from 'lucide-react'
import useApiClient from '../lib/api'
import CustomerModal from '../components/CustomerModal'

export default function CustomerDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const api = useApiClient()

  const [customer, setCustomer] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('policies') // 'policies' | 'documents'

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)

  const fetchCustomerDetail = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get(`/customers/${id}`)
      setCustomer(response.data.customer)
    } catch (err) {
      console.error('Error fetching customer detail:', err)
      setError(err.response?.data?.message || 'Failed to load customer profile.')
    } finally {
      setLoading(false)
    }
  }, [api, id])

  useEffect(() => {
    fetchCustomerDetail()
  }, [fetchCustomerDetail])

  const handleDelete = async () => {
    if (!customer) return
    if (!window.confirm(`Are you sure you want to delete customer "${customer.name}"?`)) return

    try {
      await api.delete(`/customers/${id}`)
      navigate('/customers')
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete customer.')
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
        <span className="text-slate-400 text-sm">Loading policyholder profile...</span>
      </div>
    )
  }

  if (error || !customer) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white">Customer Not Found</h2>
        <p className="text-slate-400 text-sm">{error || 'The requested customer profile could not be retrieved.'}</p>
        <Link
          to="/customers"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-medium text-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Customers List
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back Link */}
      <div>
        <Link
          to="/customers"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-indigo-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Customers
        </Link>
      </div>

      {/* Customer Profile Header Card */}
      <div className="glass-panel p-8 rounded-3xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center text-white font-extrabold text-2xl shadow-xl shadow-indigo-600/20 shrink-0">
              {customer.name.substring(0, 2).toUpperCase()}
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{customer.name}</h1>
                <span className="px-3 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                  Policyholder
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Registered on {new Date(customer.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setModalOpen(true)}
              className="px-4 py-2.5 rounded-xl font-semibold text-sm text-slate-200 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 flex items-center gap-2 transition-all"
            >
              <Edit className="w-4 h-4 text-amber-400" /> Edit Profile
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2.5 rounded-xl font-semibold text-sm text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 flex items-center gap-2 transition-all"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>

        {/* Contact Info Grid */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Email Address</div>
              <div className="font-semibold text-white truncate">{customer.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Phone Number</div>
              <div className="font-semibold text-white">{customer.phone || 'N/A'}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Date of Birth</div>
              <div className="font-semibold text-white">
                {customer.dob ? new Date(customer.dob).toLocaleDateString() : 'N/A'}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-indigo-400 shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-400 font-medium">Location</div>
              <div className="font-semibold text-white truncate" title={customer.address}>
                {customer.address || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setActiveTab('policies')}
            className={`flex items-center gap-2 px-4 py-2 font-semibold text-sm rounded-xl transition-all ${
              activeTab === 'policies'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Policy History ({customer.policies?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`flex items-center gap-2 px-4 py-2 font-semibold text-sm rounded-xl transition-all ${
              activeTab === 'documents'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" /> Documents ({customer.documents?.length || 0})
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'policies' ? (
        <div className="space-y-4">
          {!customer.policies || customer.policies.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center text-slate-400">
              <ShieldCheck className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-300">No Active or Past Policies</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                This customer has no insurance policies attached to their profile yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customer.policies.map((policy) => (
                <div key={policy.id} className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-indigo-400 font-semibold uppercase tracking-wider">
                        {policy.policyType}
                      </div>
                      <div className="text-lg font-bold text-white mt-0.5">#{policy.policyNumber}</div>
                    </div>
                    {getStatusBadge(policy.status)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs pt-3 border-t border-slate-800/80">
                    <div>
                      <span className="text-slate-400 block">Premium Amount</span>
                      <span className="font-extrabold text-white text-base mt-0.5">
                        ${policy.premiumAmount?.toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Coverage Duration</span>
                      <span className="font-medium text-slate-300 mt-0.5 block">
                        {new Date(policy.startDate).toLocaleDateString()} — {new Date(policy.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <span>Claims Filed: <strong className="text-white">{policy.claims?.length || 0}</strong></span>
                    <span>Payments: <strong className="text-white">{policy.payments?.length || 0}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {!customer.documents || customer.documents.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center text-slate-400">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-300">No Documents Uploaded</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                KYC records, passports, and proof of address will appear here once attached.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {customer.documents.map((doc) => (
                <div key={doc.id} className="glass-card rounded-2xl p-5 border border-slate-800 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-cyan-400 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-white truncate" title={doc.fileName}>
                      {doc.fileName}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {new Date(doc.uploadedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Edit Modal */}
      <CustomerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchCustomerDetail}
        initialData={customer}
      />
    </div>
  )
}
