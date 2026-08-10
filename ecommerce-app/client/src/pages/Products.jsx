import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    const { data } = await api.get('/products', {
      params: { search },
    });
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Hero */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
            Shop the Latest Collection
          </h1>

          <p className="mt-2 text-slate-500 text-sm sm:text-base">
            Quality products, fast checkout, happy shopping.
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative w-full max-w-xl">
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-slate-300 rounded-xl px-4 py-3 pr-12 text-slate-800 placeholder:text-slate-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              🔍
            </span>
          </div>
        </div>

        {/* Products */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {products.map((p) => (
              <Link
                key={p._id}
                to={`/products/${p._id}`}
                className="group bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200"
              >
                {/* Product Image Placeholder */}
                <div className="h-44 sm:h-48 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                  <span className="text-4xl sm:text-5xl opacity-70 group-hover:scale-110 transition-transform duration-200">
                    🛍️
                  </span>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <span className="inline-block text-xs font-medium uppercase tracking-wide text-slate-400">
                    {p.category}
                  </span>

                  <h4 className="font-semibold text-slate-800 mt-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {p.name}
                  </h4>

                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-lg font-bold text-blue-600">
                      ${Number(p.price).toFixed(2)}
                    </p>

                    <span className="text-sm text-slate-400 group-hover:text-blue-600 transition-colors">
                      View →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
            <div className="text-4xl mb-3">🔍</div>

            <h2 className="text-lg font-semibold text-slate-800">
              No products found
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Try searching with a different keyword.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}