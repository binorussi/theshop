import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { MOCK_PRODUCTS } from '@/lib/api';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function CategoryDetailPage({ params }: Props) {
  const { slug } = await params;

  const categoryProducts = MOCK_PRODUCTS.filter(
    (p) => p.categorySlug === slug
  );

  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-gray-600">
          <li><Link href="/" className="hover:underline">Home</Link></li>
          <li>/</li>
          <li><Link href="/categories" className="hover:underline">Categories</Link></li>
          <li>/</li>
          <li aria-current="page" className="font-semibold text-gray-900 uppercase">{slug}</li>
        </ol>
      </nav>

      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 uppercase">
        {slug.replace('-', ' ')}
      </h1>
      <p className="mt-2 text-gray-600">
        Showing {categoryProducts.length} items available in this category.
      </p>

      {categoryProducts.length === 0 ? (
        <div className="mt-12 rounded-xl bg-gray-50 border border-gray-200 p-8 text-center">
          <p className="text-gray-600">No products found in this category yet. Expansion coming soon!</p>
          <Link href="/categories" className="mt-4 inline-block font-semibold text-indigo-600 hover:underline">
            View other categories &rarr;
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="aspect-square relative w-full overflow-hidden rounded-lg bg-gray-50 mb-4">
                  <Image
                    src={product.images[0].url}
                    alt={product.images[0].altText}
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">{product.brand}</span>
                <h2 className="mt-1 font-bold text-lg text-gray-900 line-clamp-1">{product.name}</h2>
                <p className="mt-1 text-sm text-gray-600 line-clamp-2">{product.description}</p>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
                <Link
                  href={`/products/${product.categorySlug}/${product.slug}`}
                  className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-600"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}