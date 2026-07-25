import React, { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  CreditCard,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  AlertCircle,
  Calendar,
  DollarSign,
  FileText,
  User,
  MoreVertical
} from 'lucide-react'
import useApiClient from '../lib/api'
import RecordPaymentModal from '../components/RecordPaymentModal'

export default function Premiums() {
  const api = useApiClient()

  const [payments, setPayments] = useState([])
  const [pagination, setPagination] = useState({ totalCount: 0, totalPages: 1, currentPage: 1, limit: 10 })
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)

  const fetchPayments = useCallback(async (page = 1, searchQuery = '', status = 'ALL') => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/premiums', {
        params: {
          page,
          limit: 10,
          search: searchQuery,
          status: status === 'ALL' ? '' : status
        }
      })
      setPayments(response.data.payments || [])
      if (response.data.pagination) {
        setPagination(response.data.pagination)
      }
    } catch (err) {
      console.error('Error fetching premium payments:', err)
      setError(err.response?.data?.message || 'Failed to load premium payment records.')
    } finally {
      setLoading(false)
    }
  }, [api])

  useEffect(() => {
    fetchPayments(1, search, statusFilter)
  }, [fetchPayments, search, statusFilter])

  const handleUpdateStatus = async (id, newStatus) => {
    setUpdatingId(id)
    try {
      await api.put(`/premiums/${id}/status`, { status: newStatus })
      fetchPayments(pagination.currentPage, search, statusFilter)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update payment status.')
    } finally {
      setUpdatingId(null)
    }
  }

  const getStatusBadge = (status) => {
    switch (status) {
      case 'PAID':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Paid
          </span>
        )
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
            <Clock className="w-3.5 h-3.5" /> Pending
          </span>
        )
      case 'OVERDUE':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-semibold">
            <AlertTriangle className="w-3.5 h-3.5" /> Overdue
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
            <CreditCard className="w-4 h-4" /> Financial Operations
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Premium Payment Tracking</h1>
          <p className="text-slate-400 text-sm mt-1">
            Track policy collections, payment transactions, and overdue accounts
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="self-start md:self-auto px-5 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 flex items-center gap-2.5 transition-all hover:-translate-y-0.5"
        >
          <Plus className="w-4 h-4" />
          Record Premium Payment
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
            placeholder="Search by Transaction ID, Policy #, or Customer..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700/70 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1.5 mr-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {['ALL', 'PAID', 'PENDING', 'OVERDUE'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
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

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Premiums Data Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-4 px-6 font-semibold">Transaction ID</th>
                <th className="py-4 px-6 font-semibold">Policy Number</th>
                <th className="py-4 px-6 font-semibold">Policyholder</th>
                <th className="py-4 px-6 font-semibold">Amount</th>
                <th className="py-4 px-6 font-semibold">Method</th>
                <th className="py-4 px-6 font-semibold">Payment Date</th>
                <th className="py-4 px-6 font-semibold">Status</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                      <span>Loading payment transactions...</span>
                    </div>
                  </td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <CreditCard className="w-10 h-10 text-slate-600 mb-2" />
                      <p className="text-base font-semibold text-slate-300">No Premium Payments Found</p>
                      <p className="text-xs text-slate-500 max-w-sm">
                        {search || statusFilter !== 'ALL'
                          ? 'No payment records match your search criteria.'
                          : 'Get started by recording your first premium payment.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                payments.map((pmt) => (
                  <tr key={pmt.id} className="hover:bg-slate-900/40 transition-colors">
                    {/* Transaction ID */}
                    <td className="py-4 px-6 font-bold text-white font-mono text-xs">
                      {pmt.transactionId || `TXN-${pmt.id.substring(0, 8).toUpperCase()}`}
                    </td>

                    {/* Policy Number */}
                    <td className="py-4 px-6">
                      {pmt.policy ? (
                        <Link
                          to={`/policies/${pmt.policy.id}`}
                          className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors text-xs"
                        >
                          #{pmt.policy.policyNumber}
                        </Link>
                      ) : (
                        <span className="text-xs text-slate-500 italic">Unlinked</span>
                      )}
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-6">
                      {pmt.policy?.customer ? (
                        <div>
                          <Link
                            to={`/customers/${pmt.policy.customer.id}`}
                            className="font-semibold text-slate-200 hover:text-indigo-400 transition-colors text-sm block"
                          >
                            {pmt.policy.customer.name}
                          </Link>
                          <span className="text-xs text-slate-400">{pmt.policy.customer.email}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-slate-500 italic">N/A</span>
                      )}
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-6 font-extrabold text-white text-base">
                      ${pmt.amount?.toLocaleString()}
                    </td>

                    {/* Payment Method */}
                    <td className="py-4 px-6 text-xs text-slate-300">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 font-medium">
                        {pmt.paymentMethod || 'BANK_TRANSFER'}
                      </span>
                    </td>

                    {/* Payment Date */}
                    <td className="py-4 px-6 text-xs text-slate-400">
                      {new Date(pmt.paymentDate).toLocaleDateString()}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">{getStatusBadge(pmt.paymentStatus)}</td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {updatingId === pmt.id ? (
                          <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                        ) : (
                          <>
                            {pmt.paymentStatus !== 'PAID' && (
                              <button
                                onClick={() => handleUpdateStatus(pmt.id, 'PAID')}
                                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-semibold transition-all"
                                title="Mark as Paid"
                              >
                                Mark Paid
                              </button>
                            )}
                            {pmt.paymentStatus !== 'OVERDUE' && pmt.paymentStatus !== 'PAID' && (
                              <button
                                onClick={() => handleUpdateStatus(pmt.id, 'OVERDUE')}
                                className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all"
                                title="Mark as Overdue"
                              >
                                Mark Overdue
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
                onClick={() => fetchPayments(pagination.currentPage - 1, search, statusFilter)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-all disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={pagination.currentPage >= pagination.totalPages || loading}
                onClick={() => fetchPayments(pagination.currentPage + 1, search, statusFilter)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-all disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Record Payment Modal */}
      <RecordPaymentModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => fetchPayments(pagination.currentPage, search, statusFilter)}
      />
    </div>
  )
}
