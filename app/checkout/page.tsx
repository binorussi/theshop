'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/app/context/CartContext';

const formatBirr = (amount: number) =>
  `${amount.toLocaleString('en-ET', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} ETB`;

export default function CheckoutPage() {
  const { cart, removeFromCart, clearCart, subtotal } = useCart();

  const [paymentMethod, setPaymentMethod] = useState<
    'cod' | 'telebirr' | 'cbe'
  >('cod');

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Keep the final order total after the cart is cleared.
  const [submittedTotal, setSubmittedTotal] = useState(0);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    city: 'Addis Ababa',
    subcity: '',
    woreda: '',
    houseNo: '',
    notes: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      alert('Your cart is empty.');
      return;
    }

    setLoading(true);

    // Capture the total BEFORE clearing the cart.
    const orderTotal = subtotal;
    setSubmittedTotal(orderTotal);

    // Detect Telegram Mini App context.
    let telegramUser = 'N/A';

    if (
      typeof window !== 'undefined' &&
      (window as any).Telegram?.WebApp
    ) {
      const user = (window as any).Telegram.WebApp.initDataUnsafe?.user;

      if (user) {
        telegramUser = `@${user.username || user.first_name}`;
      }
    }

    // Prepare items for Telegram/backend.
    const formattedItems = cart.map((item) => ({
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      currency: 'ETB',
      lineTotal: item.product.price * item.quantity,
    }));

    const fullAddress = `${formData.city}, Subcity: ${
      formData.subcity || 'N/A'
    }, Woreda: ${formData.woreda || 'N/A'}${
      formData.houseNo
        ? `, Landmark/House: ${formData.houseNo}`
        : ''
    }`;

    const payload = {
      source:
        telegramUser !== 'N/A'
          ? 'Telegram Mini App'
          : 'Website',

      items: formattedItems,

      // Send the actual calculated subtotal.
      totalAmount: orderTotal,

      currency: 'ETB',

      paymentMethod,

      customerInfo: {
        name: formData.fullName,
        phone: formData.phone,
        address: fullAddress,
        telegramUser,
      },
    };

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setSubmitted(true);

        // Clear cart only after successful order submission.
        clearCart();
      } else {
        alert(
          result?.error ||
            'Could not submit order. Please verify your details.'
        );
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  /*
   * SUCCESS SCREEN
   */
  if (submitted) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="rounded-2xl border border-green-100 bg-green-50 p-8 shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-600">
            ✓
          </div>

          <h1 className="text-2xl font-bold text-gray-900">
            Order Received!
          </h1>

          <p className="mt-2 text-sm text-gray-600">
            Thank you,{' '}
            <strong className="text-gray-800">
              {formData.fullName}
            </strong>
            . We will contact you at{' '}
            <strong className="text-gray-800">
              {formData.phone}
            </strong>{' '}
            shortly to confirm delivery.
          </p>

          <div className="mt-6 rounded-lg border border-green-200 bg-white p-5 text-left">
            <p className="text-sm text-gray-600">
              Order Total
            </p>

            <p className="mt-1 text-2xl font-bold text-gray-900">
              {formatBirr(submittedTotal)}
            </p>
          </div>

          {paymentMethod === 'telebirr' && (
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 text-left text-sm">
              <p className="mb-1 font-semibold text-gray-900">
                Telebirr Payment
              </p>

              <p className="text-gray-600">
                Please complete your Telebirr payment of{' '}
                <strong>{formatBirr(submittedTotal)}</strong>.
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Payment instructions will be confirmed by our
                team.
              </p>
            </div>
          )}

          {paymentMethod === 'cbe' && (
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-4 text-left text-sm">
              <p className="mb-1 font-semibold text-gray-900">
                CBE Transfer Instructions
              </p>

              <p className="text-gray-600">
                Please complete your transfer of{' '}
                <strong>{formatBirr(submittedTotal)}</strong>{' '}
                to:
              </p>

              <p className="mt-2 font-mono text-base font-bold text-indigo-600">
                1000123456789
              </p>

              <p className="mt-1 text-sm text-gray-600">
                Account Name: The Shop P.L.C
              </p>

              <p className="mt-2 text-xs text-gray-500">
                Send confirmation screenshot via Telegram or
                SMS after completing the transfer.
              </p>
            </div>
          )}

          <Link
            href="/search"
            className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
          >
            Continue Shopping
          </Link>
        </div>
      </main>
    );
  }

  /*
   * EMPTY CART
   */
  if (cart.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Your Cart is Empty
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Add products from the catalog to place an order.
        </p>

        <Link
          href="/search"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
        >
          Browse Products
        </Link>
      </main>
    );
  }

  /*
   * CHECKOUT
   */
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">
        Guest Checkout
      </h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-8 lg:grid-cols-12"
      >
        {/* DELIVERY + PAYMENT */}
        <div className="space-y-6 lg:col-span-7">
          {/* DELIVERY ADDRESS */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              1. Delivery Address
            </h2>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700">
                  Full Name *
                </label>

                <input
                  type="text"
                  name="fullName"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Abebe Bikila"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-700">
                  Phone Number (For Delivery) *
                </label>

                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="+251 9..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">
                  City
                </label>

                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm text-gray-700"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Subcity / Zone *
                </label>

                <input
                  type="text"
                  name="subcity"
                  required
                  value={formData.subcity}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="e.g. Bole / Kirkos"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">
                  Woreda / Neighborhood
                </label>

                <input
                  type="text"
                  name="woreda"
                  value={formData.woreda}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">
                  House / Landmark
                </label>

                <input
                  type="text"
                  name="houseNo"
                  value={formData.houseNo}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                  placeholder="Near Edna Mall"
                />
              </div>
            </div>
          </div>

          {/* PAYMENT */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              2. Select Payment Method
            </h2>

            <div className="space-y-3">
              {/* CASH */}
              <label
                className={`flex cursor-pointer items-start rounded-lg border p-4 transition ${
                  paymentMethod === 'cod'
                    ? 'border-indigo-600 bg-indigo-50/30'
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="mt-1 text-indigo-600 focus:ring-indigo-500"
                />

                <div className="ml-3">
                  <span className="block text-sm font-semibold text-gray-900">
                    Pay On Delivery (Cash)
                  </span>

                  <span className="block text-xs text-gray-500">
                    Pay when items arrive at your doorstep.
                  </span>
                </div>
              </label>

              {/* TELEBIRR */}
              <label
                className={`flex cursor-pointer items-start rounded-lg border p-4 transition ${
                  paymentMethod === 'telebirr'
                    ? 'border-indigo-600 bg-indigo-50/30'
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'telebirr'}
                  onChange={() => setPaymentMethod('telebirr')}
                  className="mt-1 text-indigo-600 focus:ring-indigo-500"
                />

                <div className="ml-3">
                  <span className="block text-sm font-semibold text-gray-900">
                    Telebirr
                  </span>

                  <span className="block text-xs text-gray-500">
                    Pay using your Telebirr wallet.
                  </span>
                </div>
              </label>

              {/* CBE */}
              <label
                className={`flex cursor-pointer items-start rounded-lg border p-4 transition ${
                  paymentMethod === 'cbe'
                    ? 'border-indigo-600 bg-indigo-50/30'
                    : 'border-gray-200'
                }`}
              >
                <input
                  type="radio"
                  name="paymentMethod"
                  checked={paymentMethod === 'cbe'}
                  onChange={() => setPaymentMethod('cbe')}
                  className="mt-1 text-indigo-600 focus:ring-indigo-500"
                />

                <div className="ml-3">
                  <span className="block text-sm font-semibold text-gray-900">
                    Commercial Bank of Ethiopia (CBE)
                  </span>

                  <span className="block text-xs text-gray-500">
                    Direct mobile banking or branch transfer.
                  </span>
                </div>
              </label>
            </div>

            {paymentMethod === 'cbe' && (
              <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 p-4 text-xs text-blue-900">
                <p className="mb-1 text-sm font-semibold">
                  CBE Account Number:
                </p>

                <p className="font-mono text-base font-bold text-blue-700">
                  1000123456789
                </p>

                <p className="mt-1">
                  Account Name:{' '}
                  <strong>The Shop P.L.C</strong>
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="lg:col-span-5">
          <div className="sticky top-20 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Order Items
            </h2>

            <div className="mb-4 max-h-72 divide-y divide-gray-100 overflow-y-auto">
              {cart.map((item) => {
                const lineTotal =
                  item.product.price * item.quantity;

                return (
                  <div
                    key={item.product.id}
                    className="flex items-center justify-between py-3"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-gray-100">
                        <Image
                          src={
                            item.product.images[0]?.url ||
                            '/placeholder.jpg'
                          }
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div>
                        <p className="line-clamp-1 text-xs font-semibold text-gray-900">
                          {item.product.name}
                        </p>

                        <p className="text-xs text-gray-500">
                          {item.quantity} ×{' '}
                          {formatBirr(item.product.price)}
                        </p>

                        <p className="text-xs font-semibold text-gray-900">
                          = {formatBirr(lineTotal)}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        removeFromCart(item.product.id)
                      }
                      className="text-xs font-semibold text-red-500 hover:text-red-700"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>

            {/* SUBTOTAL */}
            <div className="space-y-3 border-t border-gray-100 pt-4 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>

                <span className="font-semibold text-gray-900">
                  {formatBirr(subtotal)}
                </span>
              </div>

              <div className="flex justify-between text-gray-600">
                <span>Delivery</span>

                <span className="font-medium text-green-600">
                  FREE
                </span>
              </div>
            </div>

            {/* TOTAL */}
            <div className="my-4 flex justify-between border-t border-gray-100 pt-4 text-base font-bold text-gray-900">
              <span>Total Amount</span>

              <span>{formatBirr(subtotal)}</span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-center text-sm font-semibold text-white shadow hover:bg-indigo-500 focus:outline-none transition disabled:opacity-50"
            >
              {loading
                ? 'Processing Order...'
                : 'Complete Guest Order'}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}