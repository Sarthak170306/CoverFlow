import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  FileText,
  Search,
  ShieldPlus,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Calendar,
  DollarSign
} from 'lucide-react'
import useApiClient from '../lib/api'
import CreatePolicyModal from '../components/CreatePolicyModal'

export default function Policies() {
  const navigate = useNavigate()
  const api = useApiClient()

  const [policies, setPolicies] = useState([])
  const [pagination, setPagination] = useState({ totalCount: 0, totalPages: 1, currentPage: 1, limit: 10 })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [modalOpen, setModalOpen] = useState(false)

  const fetchPolicies = useCallback(async (page = 1, searchQuery = '', status = 'ALL') => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/policies', {
        params: {
          page,
          limit: 10,
          search: searchQuery,
          status: status === 'ALL' ? '' : status
        }
      })
      setPolicies(response.data.policies || [])
      if (response.data.pagination) {
        setPagination(response.data.pagination)
      }
    } catch (err) {
      console.error('Error fetching policies:', err)
      setError(err.response?.data?.message || 'Failed to load insurance policies.')
    } finally {
      setLoading(false)
    }
  }, [api])

  useEffect(() => {
    fetchPolicies(1, search, statusFilter)
  }, [fetchPolicies, search, statusFilter])

  const handleStatusChange = (status) => {
    setStatusFilter(status)
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
            <FileText className="w-4 h-4" /> Underwriting Registry
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Policy Management</h1>
          <p className="text-slate-400 text-sm mt-1">
            Track policy lifecycles, active coverages, premium schedules, and expirations
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="self-start md:self-auto px-5 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 flex items-center gap-2.5 transition-all hover:-translate-y-0.5"
        >
          <ShieldPlus className="w-4 h-4" />
          Issue New Policy
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Policy #, type, or customer name..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700/70 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {['ALL', 'ACTIVE', 'EXPIRED', 'CANCELLED'].map((st) => (
            <button
              key={st}
              onClick={() => handleStatusChange(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Policies Data Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-4 px-6 font-semibold">Policy Details</th>
                <th className="py-4 px-6 font-semibold">Policyholder</th>
                <th className="py-4 px-6 font-semibold">Annual Premium</th>
                <th className="py-4 px-6 font-semibold">Coverage Period</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                      <span>Loading policy data...</span>
                    </div>
                  </td>
                </tr>
              ) : policies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText className="w-10 h-10 text-slate-600 mb-2" />
                      <p className="text-base font-semibold text-slate-300">No Policies Found</p>
                      <p className="text-xs text-slate-500 max-w-sm">
                        {search || statusFilter !== 'ALL'
                          ? 'No policies match your search query or status filter.'
                          : 'Get started by issuing your first insurance policy.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                policies.map((pol) => (
                  <tr
                    key={pol.id}
                    onClick={() => navigate(`/policies/${pol.id}`)}
                    className="cursor-pointer hover:bg-slate-800/50 transition-colors"
                  >
                    {/* Policy Number & Type */}
                    <td className="py-4 px-6">
                      <div>
                        <span className="font-bold text-white hover:text-indigo-400 transition-colors block">
                          #{pol.policyNumber}
                        </span>
                        <div className="text-xs font-medium text-indigo-400 mt-0.5">
                          {pol.policyType} Insurance
                        </div>
                      </div>
                    </td>

                    {/* Customer Info */}
                    <td className="py-4 px-6">
                      {pol.customer ? (
                        <div>
                          <span className="font-semibold text-slate-200 block">{pol.customer.name}</span>
                          <span className="text-xs text-slate-400">{pol.customer.email}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Unassigned</span>
                      )}
                    </td>

                    {/* Premium Amount */}
                    <td className="py-4 px-6">
                      <div className="font-extrabold text-white flex items-center gap-0.5 text-base">
                        <DollarSign className="w-4 h-4 text-emerald-400" />
                        {pol.premiumAmount?.toLocaleString()}
                      </div>
                    </td>

                    {/* Dates */}
                    <td className="py-4 px-6 text-xs text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span>
                          {new Date(pol.startDate).toLocaleDateString()} — {new Date(pol.endDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6">{getStatusBadge(pol.status)}</td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <Link
                        to={`/policies/${pol.id}`}
                        className="p-2 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg transition-colors inline-block"
                        title="View Policy Details"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {pagination.totalPages > 1 && (
          <div className="p-4 bg-slate-900/60 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              Page <span className="text-white font-bold">{pagination.currentPage}</span> of{' '}
              <span className="text-white font-bold">{pagination.totalPages}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={pagination.currentPage <= 1 || loading}
                onClick={() => fetchPolicies(pagination.currentPage - 1, search, statusFilter)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-all disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={pagination.currentPage >= pagination.totalPages || loading}
                onClick={() => fetchPolicies(pagination.currentPage + 1, search, statusFilter)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-all disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <CreatePolicyModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => fetchPolicies(pagination.currentPage, search, statusFilter)}
      />
    </div>
  )
}
