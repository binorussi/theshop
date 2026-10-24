import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-white py-8 text-xs text-gray-500">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <p>© {new Date().getFullYear()} The Shop. All rights reserved.</p>
        
        <div className="flex gap-6">
          <Link href="/search" className="hover:text-indigo-600">
            All Products
          </Link>
          <Link href="/contact" className="hover:text-indigo-600">
            Contact Us
          </Link>
          <Link href="/checkout" className="hover:text-indigo-600">
            Cart & Checkout
          </Link>
        </div>
      </div>
    </footer>
  );
}