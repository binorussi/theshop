'use client';

import { useState } from 'react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900">Contact Us</h1>
        <p className="mt-2 text-sm text-gray-500">
          Have questions about your order or our delivery coverage? Reach out below!
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Contact Information */}
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-8 space-y-6">
          <h2 className="text-lg font-semibold text-gray-900">Get in Touch</h2>

          <div className="space-y-4 text-sm text-gray-600">
            <div>
              <p className="font-semibold text-gray-900">Phone & Telegram Support</p>
              <p>+251 91 123 4567</p>
            </div>

            <div>
              <p className="font-semibold text-gray-900">Email Address</p>
              <p>support@theshop.et</p>
            </div>

            <div>
              <p className="font-semibold text-gray-900">Location</p>
              <p>Bole, Addis Ababa, Ethiopia</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          {sent ? (
            <div className="py-12 text-center text-green-600 font-medium">
              Thank you! Your message has been sent. We will respond shortly.
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">Phone or Email</label>
                <input
                  type="text"
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700">Message</label>
                <textarea
                  rows={4}
                  required
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-indigo-600 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}