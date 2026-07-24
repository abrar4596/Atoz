import ProductGrid from "@/components/storefront/ProductGrid"

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-12">
      <div className="absolute inset-0 bg-radial-gradient from-indigo-950/15 via-transparent to-transparent -z-10" />
      <ProductGrid />
    </div>
  )
}
