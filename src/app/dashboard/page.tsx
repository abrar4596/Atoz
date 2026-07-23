import { Suspense } from 'react'
import CustomerDashboard from '@/components/storefront/CustomerDashboard'
import { Loader2 } from 'lucide-react'

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-6">
        <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
        <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Loading dashboard...</p>
      </div>
    }>
      <CustomerDashboard />
    </Suspense>
  )
}
