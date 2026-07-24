import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Users,
  Search,
  UserPlus,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Loader2,
  AlertCircle
} from 'lucide-react'
import useApiClient from '../lib/api'
import CustomerModal from '../components/CustomerModal'

export default function Customers() {
  const navigate = useNavigate()
  const api = useApiClient()

  const [customers, setCustomers] = useState([])
  const [pagination, setPagination] = useState({ totalCount: 0, totalPages: 1, currentPage: 1, limit: 10 })
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingCustomer, setEditingCustomer] = useState(null)

  const fetchCustomers = useCallback(async (page = 1, searchQuery = '') => {
    setLoading(true)
    setError(null)
    try {
      const response = await api.get('/customers', {
        params: { page, limit: 10, search: searchQuery }
      })
      setCustomers(response.data.customers || [])
      if (response.data.pagination) {
        setPagination(response.data.pagination)
      }
    } catch (err) {
      console.error('Error fetching customers:', err)
      setError(err.response?.data?.message || 'Failed to load customers list.')
    } finally {
      setLoading(false)
    }
  }, [api])

  useEffect(() => {
    fetchCustomers(1, search)
  }, [fetchCustomers, search])

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  const handleOpenAddModal = () => {
    setEditingCustomer(null)
    setModalOpen(true)
  }

  const handleOpenEditModal = (e, customer) => {
    e.stopPropagation()
    setEditingCustomer(customer)
    setModalOpen(true)
  }

  const handleDeleteCustomer = async (e, id, name) => {
    e.stopPropagation()
    if (!window.confirm(`Are you sure you want to delete customer "${name}"?`)) return

    try {
      await api.delete(`/customers/${id}`)
      fetchCustomers(pagination.currentPage, search)
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete customer.')
    }
  }

  const handleRowClick = (id) => {
    navigate(`/customers/${id}`)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-400 mb-1">
            <Users className="w-4 h-4" /> Policyholder Registry
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Customer Management</h1>
          <p className="text-slate-400 text-sm mt-1">
            Manage enterprise clients, policyholders, and contact profiles
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="self-start md:self-auto px-5 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/30 flex items-center gap-2.5 transition-all hover:-translate-y-0.5"
        >
          <UserPlus className="w-4 h-4" />
          Add New Customer
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name, email, or phone..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900/90 border border-slate-700/70 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 text-sm transition-all"
          />
        </div>

        <div className="text-xs text-slate-400 font-medium">
          Showing <span className="text-white font-bold">{customers.length}</span> of{' '}
          <span className="text-indigo-400 font-bold">{pagination.totalCount}</span> total policyholders
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Customers Data Table */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-4 px-6 font-semibold">Customer Details</th>
                <th className="py-4 px-6 font-semibold">Contact Info</th>
                <th className="py-4 px-6 font-semibold">Location</th>
                <th className="py-4 px-6 font-semibold">Policies</th>
                <th className="py-4 px-6 font-semibold">Registered</th>
                <th className="py-4 px-6 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
                      <span>Loading policyholder data...</span>
                    </div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Users className="w-10 h-10 text-slate-600 mb-2" />
                      <p className="text-base font-semibold text-slate-300">No Customers Found</p>
                      <p className="text-xs text-slate-500 max-w-sm">
                        {search ? `No results found matching "${search}"` : 'Get started by creating your first policyholder record.'}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                customers.map((cust) => (
                  <tr
                    key={cust.id}
                    onClick={() => handleRowClick(cust.id)}
                    className="cursor-pointer hover:bg-slate-800/50 transition-colors"
                  >
                    {/* Name & Avatar */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-400 flex items-center justify-center text-white font-bold text-sm shadow-md">
                          {cust.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-white hover:text-indigo-400 transition-colors">
                            {cust.name}
                          </span>
                          {cust.dob && (
                            <div className="text-xs text-slate-400 mt-0.5">
                              DOB: {new Date(cust.dob).toLocaleDateString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="py-4 px-6">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2 text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>{cust.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400">
                          <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                          <span>{cust.phone || 'N/A'}</span>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-4 px-6 text-xs text-slate-400 max-w-xs truncate">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate" title={cust.address}>
                          {cust.address || 'Unspecified'}
                        </span>
                      </div>
                    </td>

                    {/* Policies badge */}
                    <td className="py-4 px-6">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold">
                        <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
                        {cust.policies?.length || cust._count?.policies || 0} Policies
                      </div>
                    </td>

                    {/* Registered Date */}
                    <td className="py-4 px-6 text-xs text-slate-400">
                      {new Date(cust.createdAt).toLocaleDateString()}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <Link
                          to={`/customers/${cust.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="p-2 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded-lg transition-colors"
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={(e) => handleOpenEditModal(e, cust)}
                          className="p-2 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Edit Customer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => handleDeleteCustomer(e, cust.id, cust.name)}
                          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                          title="Delete Customer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
                onClick={() => fetchCustomers(pagination.currentPage - 1, search)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-all disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={pagination.currentPage >= pagination.totalPages || loading}
                onClick={() => fetchCustomers(pagination.currentPage + 1, search)}
                className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-all disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal Component */}
      <CustomerModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={() => fetchCustomers(pagination.currentPage, search)}
        initialData={editingCustomer}
      />
    </div>
  )
}
