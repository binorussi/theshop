'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MOCK_PRODUCTS } from '@/lib/api';
import ProductCard from '@/components/product/ProductCard';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q')?.toLowerCase().trim() || '';

  const filteredProducts = MOCK_PRODUCTS.filter((product) => {
    if (!query) return true;
    return (
      product.name.toLowerCase().includes(query) ||
      product.brand.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.categorySlug.toLowerCase().includes(query)
    );
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">
        {query ? `Search Results for "${query}"` : 'All Products'}
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Found {filteredProducts.length} product{filteredProducts.length === 1 ? '' : 's'}
      </p>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-12 text-center">
          <p className="text-gray-500">No products match your search criteria.</p>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading products...</div>}>
      <SearchContent />
    </Suspense>
  );
}