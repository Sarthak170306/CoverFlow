import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'
import Landing from './pages/Landing'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'
import Dashboard from './pages/Dashboard'
import Customers from './pages/Customers'
import CustomerDetail from './pages/CustomerDetail'
import Policies from './pages/Policies'
import PolicyDetail from './pages/PolicyDetail'
import Premiums from './pages/Premiums'
import Claims from './pages/Claims'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers"
              element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customers/:id"
              element={
                <ProtectedRoute>
                  <CustomerDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/policies"
              element={
                <ProtectedRoute>
                  <Policies />
                </ProtectedRoute>
              }
            />
            <Route
              path="/policies/:id"
              element={
                <ProtectedRoute>
                  <PolicyDetail />
                </ProtectedRoute>
              }
            />
            <Route
              path="/premiums"
              element={
                <ProtectedRoute>
                  <Premiums />
                </ProtectedRoute>
              }
            />
            <Route
              path="/claims"
              element={
                <ProtectedRoute>
                  <Claims />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
