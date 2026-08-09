'use client';

import { ShoppingBag, X, Trash2 } from 'lucide-react';
import Image from 'next/image';
import { useCartStore } from '@/store/useCartStore';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity } = useCartStore();

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <div
      className="relative z-50"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="fixed inset-0 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="pointer-events-auto w-screen max-w-md bg-white shadow-xl flex flex-col">
              
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-6 sm:px-6 border-b border-gray-200">
                <h2 id="slide-over-title" className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-indigo-600" />
                  Your Cart ({items.reduce((a, b) => a + b.quantity, 0)})
                </h2>
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus-visible:outline-2 focus-visible:outline-indigo-600 p-2"
                  aria-label="Close cart panel"
                >
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {/* Items List */}
              <div className="flex-1 overflow-y-auto px-4 py-6 sm:px-6">
                {items.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="mx-auto h-12 w-12 text-gray-300" />
                    <p className="mt-4 text-gray-500 text-sm">Your shopping cart is currently empty.</p>
                  </div>
                ) : (
                  <ul role="list" className="-my-6 divide-y divide-gray-200">
                    {items.map(({ product, quantity }) => (
                      <li key={product.id} className="flex py-6">
                        <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 relative bg-gray-50">
                          {product.images[0] && (
                            <Image
                              src={product.images[0].url}
                              alt={product.images[0].altText}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>

                        <div className="ml-4 flex flex-1 flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3 className="line-clamp-1">{product.name}</h3>
                              <p className="ml-4">${(product.price * quantity).toFixed(2)}</p>
                            </div>
                            <p className="mt-1 text-xs uppercase tracking-wider text-indigo-600 font-semibold">{product.brand}</p>
                          </div>
                          
                          <div className="flex flex-1 items-end justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <label htmlFor={`cart-qty-${product.id}`} className="sr-only">
                                Quantity for {product.name}
                              </label>
                              <select
                                id={`cart-qty-${product.id}`}
                                value={quantity}
                                onChange={(e) => updateQuantity(product.id, Number(e.target.value))}
                                className="rounded border-gray-300 py-1 text-xs focus:ring-2 focus:ring-indigo-500"
                              >
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                                  <option key={n} value={n}>
                                    Qty {n}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <button
                              type="button"
                              onClick={() => removeItem(product.id)}
                              className="font-medium text-red-600 hover:text-red-500 flex items-center gap-1 text-xs focus-visible:outline-2 focus-visible:outline-red-600 rounded p-1"
                              aria-label={`Remove ${product.name} from cart`}
                            >
                              <Trash2 className="h-4 w-4" />
                              Remove
                            </button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Checkout Section */}
              {items.length > 0 && (
                <div className="border-t border-gray-200 px-4 py-6 sm:px-6 bg-gray-50">
                  <div className="flex justify-between text-base font-semibold text-gray-900">
                    <p>Subtotal</p>
                    <p>${subtotal.toFixed(2)} USD</p>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">Shipping and taxes calculated at checkout.</p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => alert('Proceeding to accessible checkout...')}
                      className="w-full rounded-md border border-transparent bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}