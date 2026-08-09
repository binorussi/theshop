import Link from 'next/link';

const ALL_CATEGORIES = [
  {
    name: 'Personal Care & Hygiene',
    slug: 'personal-care',
    description: 'Lotions, Body Washes, Toothpaste, Deodorants, and Soaps from top brands like Dove, Cetaphil, CeraVe, and Gillette.',
  },
  {
    name: 'Health & Supplements',
    slug: 'supplements',
    description: 'Vitamins, Fish Oil, Collagen, and Herbal Wellness supplements from Nature Made, Youtheory, and One A Day.',
  },
  {
    name: 'Pantry, Snacks & Confectionery',
    slug: 'pantry',
    description: 'Gourmet Nuts, Maple Syrup, Honey, Chocolates, and Snacks from Kirkland Signature, Nutella, Lindt, and Ferrero Rocher.',
  },
];

export default function CategoriesPage() {
  return (
    <main id="main-content" tabIndex={-1} className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">
        All Product Categories
      </h1>
      <p className="mt-2 text-lg text-gray-600">
        Browse our organized CPG inventory by primary taxonomy.
      </p>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ALL_CATEGORIES.map((cat) => (
          <div
            key={cat.slug}
            className="border border-gray-200 rounded-xl p-6 bg-white shadow-sm flex flex-col justify-between"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{cat.name}</h2>
              <p className="mt-3 text-sm text-gray-600 leading-relaxed">{cat.description}</p>
            </div>
            <div className="mt-6">
              <Link
                href={`/categories/${cat.slug}`}
                className="inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 focus-visible:outline-2 focus-visible:outline-indigo-600"
              >
                Explore Category &rarr;
              </Link>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}