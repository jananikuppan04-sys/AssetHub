"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [devToken, setDevToken] = useState("") // Only for local testing

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus("loading")
    setMessage("")

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Failed to process request")
      }

      setStatus("success")
      setMessage(data.message)
      if (data._devToken) setDevToken(data._devToken)
    } catch (err: any) {
      setStatus("error")
      setMessage(err.message)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl border border-slate-100 w-full max-w-md">
        
        <Link href="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to login
        </Link>

        {status === "success" ? (
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
              <Mail className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-4">Check your email</h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              {message}
            </p>
            
            {/* For local development testing only */}
            {devToken && (
              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-left mb-6">
                <p className="text-xs text-yellow-800 font-semibold mb-2">DEV MODE: Reset link generated</p>
                <Link href={`/reset-password?token=${devToken}`} className="text-sm text-blue-600 hover:underline break-all">
                  Click here to reset password
                </Link>
              </div>
            )}
            
            <p className="text-sm text-slate-500">
              Didn't receive an email? <button onClick={() => setStatus("idle")} className="text-blue-600 font-medium hover:underline">Try again</button>
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Forgot password?</h1>
              <p className="text-sm text-slate-500 mt-2">
                No worries, we'll send you reset instructions.
              </p>
            </div>

            {status === "error" && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm flex items-start border border-red-100">
                <AlertCircle className="w-5 h-5 mr-3 shrink-0 text-red-500" />
                <p className="font-medium">{message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                    placeholder="name@company.com"
                    required
                  />
                </div>
              </div>
              
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all shadow-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center mt-2"
              >
                {status === "loading" ? "Sending..." : "Reset password"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
