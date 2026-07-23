'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ShieldCheck, Loader2, ArrowLeft } from 'lucide-react'
import { apiClient } from '@/services/apiClient'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const response = await apiClient.post('/auth/register', { name, phone, password })
      if (response.data.success) {
        router.push('/login')
      } else {
        setError(response.data.error || 'Registration failed')
        setLoading(false)
      }
    } catch (error: any) {
      console.error('Registration request error:', error)
      setError(error.response?.data?.error || error.message || 'Server error')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0,transparent_65%)] pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md z-10">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-xs font-bold uppercase tracking-wider mb-6 mx-auto">
          <ArrowLeft className="h-4 w-4" /> Back to Store
        </Link>
        <div className="flex justify-center">
          <div className="rounded-2xl bg-indigo-600/10 p-3.5 border border-indigo-500/20 text-indigo-400">
            <ShieldCheck className="h-8 w-8" />
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-black uppercase tracking-tight">
          Create a new account
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Or{' '}
          <Link href="/login" className="font-semibold text-indigo-400 hover:text-indigo-300">
            sign in to your existing account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md z-10">
        <div className="bg-zinc-900/50 border border-white/5 py-8 px-4 shadow-2xl rounded-3xl sm:px-10 backdrop-blur-xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                Full Name
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="block w-full rounded-2xl bg-black border border-white/10 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                Phone number
              </label>
              <div className="mt-2">
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="block w-full rounded-2xl bg-black border border-white/10 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  placeholder="e.g. 1234567890"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold uppercase tracking-wider text-zinc-400">
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full rounded-2xl bg-black border border-white/10 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-2xl shadow-sm text-sm font-bold uppercase tracking-wider text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Register'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
