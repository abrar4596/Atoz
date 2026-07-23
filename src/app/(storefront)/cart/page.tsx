import Link from 'next/link'

export default function CartPlaceholder() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center space-y-4">
      <h1 className="text-3xl font-black uppercase">Shopping Cart</h1>
      <p className="text-zinc-400">Your shopping cart can be accessed via the side drawer.</p>
      <Link href="/" className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-full transition">
        Go Back Home
      </Link>
    </div>
  )
}
