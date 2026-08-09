'use client';

import { useState } from 'react';
import { Product } from '@/types/ecommerce';
import { useCartStore } from '@/store/useCartStore';

export default function ProductBuySection({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const [announcement, setAnnouncement] = useState('');
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem(product, quantity);
    
    setAnnouncement(
      `Added ${quantity} ${quantity === 1 ? 'unit' : 'units'} of${product.name} to your shopping cart.`
    );

    setTimeout(() => setAnnouncement(''), 4000);
  };

  return (
    <div className="mt-8 flex flex-col gap-y-4">
      <div 
        role="status" 
        aria-live="polite" 
        aria-atomic="true" 
        className="sr-only"
      >
        {announcement}
      </div>

      <div className="flex items-center gap-x-4">
        <label htmlFor="quantity-select" className="text-sm font-medium text-gray-700">
          Quantity
        </label>
        <select
          id="quantity-select"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="rounded-md border border-gray-300 py-1.5 px-3 text-base focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
        >
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={!product.inStock}
        type="button"
        className="w-full sm:w-auto rounded-lg bg-indigo-600 px-6 py-3.5 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
      >
        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
}