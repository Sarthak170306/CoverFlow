import React from 'react'
import { SignIn } from '@clerk/clerk-react'

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="relative z-10">
        <SignIn
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          forceRedirectUrl="/dashboard"
          appearance={{
            elements: {
              card: 'glass-panel border-slate-800 shadow-2xl rounded-2xl',
              headerTitle: 'text-white font-bold text-xl',
              headerSubtitle: 'text-slate-400 text-sm',
              formButtonPrimary: 'bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition-all',
              formFieldLabel: 'text-slate-300 font-medium text-xs',
              formFieldInput: 'bg-slate-900/90 border-slate-700 text-white rounded-xl focus:border-indigo-500',
              footerActionLink: 'text-indigo-400 hover:text-indigo-300 font-semibold',
            }
          }}
        />
      </div>
    </div>
  )
}
