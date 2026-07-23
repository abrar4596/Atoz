import AdminSidebar from '@/components/layout/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 lg:flex-row lg:px-6">
        <AdminSidebar />
        <main className="flex-1 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          {children}
        </main>
      </div>
    </div>
  )
}
