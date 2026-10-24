'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/types/ecommerce';
// IMPORTANT: Path must match layout.tsx exactly so they share the same state instance!
import { useCart } from '@/app/context/CartContext'; 

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const primaryImage = product?.images?.find((img) => img.isPrimary) || product?.images?.[0];
  const productCategory = product.categorySlug || 'pantry';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addToCart(product);

    // Show temporary visual feedback
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  // Helper to format prices in Ethiopian Birr
  const formatBirr = (amount?: number) => {
    if (!amount) return '0.00 ETB';
    return `${amount.toLocaleString('en-ET', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ETB`;
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      
      {/* Product Image Link */}
      <Link 
        href={`/products/${productCategory}/${product.slug}`} 
        className="aspect-square relative w-full bg-gray-50 overflow-hidden block"
      >
        <Image
          src={primaryImage?.url || '/placeholder.jpg'}
          alt={primaryImage?.altText || product.name}
          fill
          className="object-cover object-center group-hover:scale-105 transition duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </Link>

      {/* Product Info */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            {product.brand}
          </p>
          <h3 className="mt-1 text-sm font-semibold text-gray-900 line-clamp-2">
            <Link 
              href={`/products/${productCategory}/${product.slug}`} 
              className="hover:text-indigo-600"
            >
              {product.name}
            </Link>
          </h3>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 pt-2 border-t border-gray-100">
          <div>
            <p className="text-base font-bold text-gray-900">
              {formatBirr(product.price)}
            </p>
          </div>

          {/* Quick Add To Cart Button */}
          <button
            onClick={handleQuickAdd}
            type="button"
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold text-white shadow-sm transition shrink-0 z-10 cursor-pointer ${
              added 
                ? 'bg-green-600 hover:bg-green-500' 
                : 'bg-indigo-600 hover:bg-indigo-500 focus:outline-none'
            }`}
          >
            {added ? '✓ Added' : '+ Add to Cart'}
          </button>
        </div>
      </div>

    </div>
  );
}