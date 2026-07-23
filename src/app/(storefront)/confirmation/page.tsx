import { Suspense } from 'react'
import OrderConfirmation from '@/components/storefront/OrderConfirmation'
import { Loader2 } from 'lucide-react'

export default function ConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
      </div>
    }>
      <OrderConfirmation />
    </Suspense>
  )
}
