import React from 'react'
import { Link } from 'react-router-dom'
import { Shield, Zap, FileText, BarChart3, Lock, Users, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function Landing() {
  return (
    <div className="relative overflow-hidden">
      {/* Hero Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950/60 border border-indigo-700/50 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-8 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            Next-Gen Enterprise Insurance Platform
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Automate & Scale Your <span className="gradient-text">Insurance Workflows</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto font-normal leading-relaxed">
            CoverFlow empowers carriers, brokers, and underwriters with real-time policy lifecycle administration, AI-assisted claims processing, and enterprise analytics.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/sign-up"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-600/30 flex items-center justify-center gap-3 transition-all duration-200 hover:-translate-y-0.5"
            >
              Start Enterprise Trial
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/sign-in"
              className="w-full sm:w-auto px-8 py-4 rounded-xl font-semibold text-slate-300 bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 flex items-center justify-center gap-2 transition-all duration-200"
            >
              Access Portal
            </Link>
          </div>

          {/* Stats Bar */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 glass-panel rounded-2xl p-8 max-w-5xl mx-auto">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">99.9%</div>
              <div className="text-sm text-slate-400 mt-1">Uptime SLA</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-indigo-400">10x</div>
              <div className="text-sm text-slate-400 mt-1">Faster Claim Processing</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-cyan-400">$2.4B+</div>
              <div className="text-sm text-slate-400 mt-1">Premiums Managed</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white">SOC 2</div>
              <div className="text-sm text-slate-400 mt-1">Type II Certified</div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Engineered for Modern Enterprise Operations
            </h2>
            <p className="text-slate-400 mt-3 max-w-xl mx-auto">
              Unified tools for policies, underwriting, claims management, and compliance risk modeling.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Policy Administration</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                End-to-end policy lifecycles from instant quoting, underwriting automation, bind requests to renewals and endorsements.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Claims Intelligent Hub</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Accelerate FNOL processing, fraud detection, risk scoring, and payout settlements with full audit transparency.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-8 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-6">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Portfolio Analytics</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Real-time loss ratio tracking, exposure heatmaps, and customizable actuarial reporting for executive leadership.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
