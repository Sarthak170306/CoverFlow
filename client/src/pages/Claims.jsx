import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldAlert,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar,
  DollarSign,
  FileCheck,
  FileWarning
} from 'lucide-react'
import useApiClient from '../lib/api'
import FileClaimModal from '../components/FileClaimModal'

export default function Claims() {
  const api = useApiClient()

  const [claims, setClaims] = useState([])
  const [pagination, setPagination] = useState({ totalCount: 0, totalPages: 1, currentPage: 1, limit: 10 })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)

  const fetchClaims = useCallback(async (page = 1, searchQuery = '', status = 'ALL') => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/claims', {
        params: {
          page,
          limit: 10,
          search: searchQuery,
          status: status === 'ALL' ? '' : status
        }
      })
      setClaims(response.data.claims || [])
      if (response.data.pagination) {
        setPagination(response.data.pagination)
      }
    } catch (err) {
      console.error('Error fetching claims:', err)
      setError(err.response?.data?.message || 'Failed to load insurance claims.')
    } finally {
      setLoading(false)
    }
  }, [api])

  useEffect(() => {
    fetchClaims(1, search, statusFilter)
  }, [fetchClaims, search, statusFilter])

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id)
    try {
      await api.put(`/claims/${id}/status`, { status: newStatus })
      fetchClaims(pagination.currentPage, search, statusFilter)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update claim status.')
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Approved
          </span>
        )
      case 'VERIFIED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold">
            <FileCheck className="w-3.5 h-3.5" /> Verified
          </span>
        )
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" /> Pending Review
          </span>
        )
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            <XCircle className="w-3.5 h-3.5" /> Rejected
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
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
            <ShieldAlert className="w-4 h-4" /> Claims & FNOL Center
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Claims Management</h1>
          <p className="text-slate-400 text-sm mt-1">
            Process loss notifications, verify policy coverage, and manage settlement payouts
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="self-start md:self-auto px-5 py-3 rounded-xl font-semibold text-white bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-600/30 flex items-center gap-2.5 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          File New Claim
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
            placeholder="Search by Claim ID, reason, Policy #, or Customer..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700/70 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 text-sm transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {['ALL', 'PENDING', 'VERIFIED', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                statusFilter === st
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                  : 'bg-slate-900/80 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Claims Data Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-4 px-6 font-semibold">Claim ID</th>
                <th className="py-4 px-6 font-semibold">Policy Number</th>
                <th className="py-4 px-6 font-semibold">Policyholder</th>
                <th className="py-4 px-6 font-semibold">Claim Amount</th>
                <th className="py-4 px-6 font-semibold">Reason</th>
                <th className="py-4 px-6 font-semibold">Submission Date</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-6 h-6 animate-spin text-amber-400" />
                      <span>Loading claims data...</span>
                    </div>
                  </td>
                </tr>
              ) : claims.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileWarning className="w-10 h-10 text-slate-600 mb-2" />
                      <p className="text-base font-semibold text-slate-300">No Claims Found</p>
                      <p className="text-xs text-slate-500 max-w-sm">
                        {search || statusFilter !== 'ALL'
                          ? 'No claim records match your filter criteria.'
                          : 'Get started by filing a new policyholder claim.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                claims.map((clm) => (
                  <tr key={clm.id} className="hover:bg-slate-900/40 transition-colors">
                    {/* Claim ID */}
                    <td className="py-4 px-6 font-bold text-white font-mono text-xs">
                      #CLM-{clm.id.substring(0, 8).toUpperCase()}
                    </td>

                    {/* Policy Number */}
                    <td className="py-4 px-6">
                      {clm.policy ? (
                        <Link
                          to={`/policies/${clm.policy.id}`}
                          className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors text-xs"
                        >
                          #{clm.policy.policyNumber}
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Unlinked</span>
                      )}
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-6">
                      {clm.policy?.customer ? (
                        <div>
                          <Link
                            to={`/customers/${clm.policy.customer.id}`}
                            className="font-semibold text-slate-200 hover:text-indigo-400 transition-colors text-sm block"
                          >
                            {clm.policy.customer.name}
                          </Link>
                          <span className="text-xs text-slate-400">{clm.policy.customer.email}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">N/A</span>
                      )}
                    </td>

                    {/* Claim Amount */}
                    <td className="py-4 px-6 font-extrabold text-white text-base">
                      ${clm.claimAmount?.toLocaleString()}
                    </td>

                    {/* Reason */}
                    <td className="py-4 px-6 text-xs text-slate-300 max-w-xs truncate" title={clm.reason}>
                      {clm.reason}
                    </td>

                    {/* Submission Date */}
                    <td className="py-4 px-6 text-xs text-slate-400">
                      {new Date(clm.submissionDate).toLocaleDateString()}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">{getStatusBadge(clm.status)}</td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {updatingId === clm.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                        ) : (
                          <>
                            {clm.status === 'PENDING' && (
                              <button
                                onClick={() => handleUpdateStatus(clm.id, 'VERIFIED')}
                                className="px-2 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[11px] font-semibold transition-all"
                                title="Mark as Verified"
                              >
                                Verify
                              </button>
                            )}
                            {clm.status !== 'APPROVED' && (
                              <button
                                onClick={() => handleUpdateStatus(clm.id, 'APPROVED')}
                                className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[11px] font-semibold transition-all"
                                title="Approve Claim"
                              >
                                Approve
                              </button>
                            )}
                            {clm.status !== 'REJECTED' && (
                              <button
                                onClick={() => handleUpdateStatus(clm.id, 'REJECTED')}
                                className="px-2 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] font-semibold transition-all"
                                title="Reject Claim"
                              >
                                Reject
                              </button>
                            )}
                          </>
                        )}
                      </div>
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
                onClick={() => fetchClaims(pagination.currentPage - 1, search, statusFilter)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-all disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={pagination.currentPage >= pagination.totalPages || loading}
                onClick={() => fetchClaims(pagination.currentPage + 1, search, statusFilter)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-all disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* File Claim Modal */}
      <FileClaimModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => fetchClaims(pagination.currentPage, search, statusFilter)}
      />
    </div>
  )
}
