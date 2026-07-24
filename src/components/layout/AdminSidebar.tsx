import Link from 'next/link'
import { Package, Package2, PackageCheck, ShieldCheck, TrendingUp, PlusCircle } from 'lucide-react'

const navLinks = [
  { href: '/admin', label: 'ROI Dashboard', icon: TrendingUp },
  { href: '/admin/catalog', label: 'Product Catalog', icon: Package },
  { href: '/admin/inventory', label: 'Inventory Alerts', icon: Package2 },
  { href: '/admin/orders', label: 'Order Management', icon: PackageCheck },
  { href: '/admin/catalog/new', label: 'Add Product', icon: PlusCircle },
]

export default function AdminSidebar() {
  return (
    <aside className="w-full rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm lg:w-72">
      <div className="flex items-center gap-3 border-b border-zinc-200 pb-4">
        <div className="rounded-2xl bg-zinc-950 p-3 text-amber-400">
          <ShieldCheck className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-zinc-500">Admin</p>
          <h2 className="text-lg font-semibold text-zinc-950">Inventory Control</h2>
        </div>
      </div>
      <nav className="mt-6 space-y-3">
        {navLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link
              key={link.href}
              href={link.href}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-950"
            >
              <Icon className="h-4 w-4" />
              {link.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
