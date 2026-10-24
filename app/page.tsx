import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Truck, Sparkles } from 'lucide-react';
import { MOCK_PRODUCTS } from '@/lib/api';
import ProductCard from '@/components/product/ProductCard'; // Import your updated card component

const CATEGORIES = [
  {
    name: 'Personal Care & Hygiene',
    slug: 'personal-care',
    description: 'Dove, Cetaphil, CeraVe, Sensodyne & Old Spice',
    image: '/products/stevepb-toothbrush-3191097.jpg',
  },
  {
    name: 'Health & Supplements',
    slug: 'supplements',
    description: 'Nature Made D3, Fish Oil, Youtheory Collagen & Ashwagandha',
    image: '/products/stevepb-vitamin-b-871135.jpg',
  },
  {
    name: 'Pantry & Snacks',
    slug: 'pantry',
    description: 'Kirkland Nuts, Mayorga Chia, Jif, Nutella & Lindt',
    image: '/products/louannclark-cabinet-334128.jpg',
  },
];

export default function HomePage() {
  return (
    <main id="main-content" tabIndex={-1}>
      {/* Hero Section */}
      <section aria-label="Hero Banner" className="bg-indigo-900 text-white py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-indigo-800 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-indigo-200 mb-6">
            <Sparkles className="h-4 w-4" /> Imported Consumer Goods
          </span>
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight">
            Authentic Essentials, Delivered Fast.
          </h1>
          <p className="mt-6 text-lg sm:text-xl text-indigo-200 max-w-2xl mx-auto leading-relaxed">
            Discover imported Personal Care, Vitamin Supplements, and Gourmet Pantry items directly stocked for fast delivery.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/categories"
              className="rounded-lg bg-white px-6 py-3.5 text-base font-bold text-indigo-900 hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors"
            >
              Browse Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section aria-label="Store Benefits" className="border-b border-gray-200 bg-gray-50 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <ShieldCheck className="h-6 w-6 text-indigo-600" />
            <span className="font-semibold text-gray-800">100% Guaranteed Authentic Imports</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Truck className="h-6 w-6 text-indigo-600" />
            <span className="font-semibold text-gray-800">Fast Local & Express Shipping</span>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section aria-label="Product Categories" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
          Shop Primary Categories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className="group relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow focus-visible:outline-2 focus-visible:outline-indigo-600"
            >
              <div className="aspect-video w-full relative bg-gray-100">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600">
                  {cat.name}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section aria-label="Featured Products" className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-8">
          Featured Essentials
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}