'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import { useCart } from '@/app/context/CartContext'; 
import { getProductBySlug } from '@/lib/api'; // Ensure this points to where MOCK_PRODUCTS is exported
import { Product, ProductImage } from '@/types/ecommerce';

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState<boolean>(false);

  // Fetch product since getProductBySlug returns a Promise
  useEffect(() => {
    let isMounted = true;
    if (slug) {
      setLoading(true);
      getProductBySlug(slug).then((data) => {
        if (isMounted) {
          setProduct(data);
          setLoading(false);
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <p className="text-sm font-medium text-gray-500">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="text-xl font-bold text-gray-900">Product not found</h1>
        <Link href="/" className="mt-4 inline-block text-sm text-indigo-600 underline">
          Return to catalog
        </Link>
      </div>
    );
  }

  const primaryImage =
    product.images?.find((img: ProductImage) => img.isPrimary) || product.images?.[0];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const CATEGORY_NAMES: Record<string, string> = {
  pantry: 'Pantry & Confectionery',
  supplements: 'Health & Supplements',
  'personal-care': 'Personal Care & Hygiene',
  };
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      {/* Dynamic Breadcrumb Navigation */}
<nav className="mb-6 flex items-center space-x-2 text-xs text-gray-500">
  <Link href="/" className="hover:text-indigo-600 transition">
    Home
  </Link>
  
  <span>/</span>
  
  {/* Dynamic Category Link */}
  <Link 
    href={`/search?category=${product.categorySlug}`} 
    className="hover:text-indigo-600 font-medium text-gray-700 transition"
  >
    {CATEGORY_NAMES[product.categorySlug] || product.categorySlug.replace('-', ' ')}
  </Link>

  <span>/</span>
  
  <span className="font-medium text-gray-900 truncate">
    {product.name}
  </span>
</nav>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Product Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <Image
            src={primaryImage?.url || '/placeholder.jpg'}
            alt={primaryImage?.altText || product.name}
            fill
            className="object-contain object-center"
            priority
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-between py-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              {product.brand}
            </p>
            <h1 className="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">
              {product.name}
            </h1>
            <p className="mt-3 text-2xl font-black text-gray-900">
              ${product.price ? product.price.toFixed(2) : '0.00'} <span className="text-sm font-normal text-gray-500">USD</span>
            </p>

            <p className="mt-4 text-sm text-gray-600 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="mt-6 flex items-center space-x-3">
              <label htmlFor="quantity" className="text-xs font-semibold text-gray-700">
                Quantity
              </label>
              <select
                id="quantity"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-900 focus:border-indigo-500 focus:outline-none"
              >
                {[1, 2, 3, 4, 5, 6, 8, 10].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Add To Cart Action Button */}
          <div className="mt-8">
            <button
              onClick={handleAddToCart}
              type="button"
              className={`w-full rounded-xl py-3.5 text-center text-sm font-semibold text-white shadow transition focus:outline-none cursor-pointer ${
                added 
                  ? 'bg-green-600 hover:bg-green-500' 
                  : 'bg-indigo-600 hover:bg-indigo-500'
              }`}
            >
              {added ? '✓ Added to Cart!' : 'Add to Cart'}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}