import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    const { data } = await api.get('/products', { params: { search } });
    setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, [search]);

  return (
    <div>
      <div className="bg-slate-900 text-white py-14 px-6 text-center">
        <h1 className="text-3xl font-bold">Shop the Latest Collection</h1>
        <p className="text-slate-300 mt-2">Quality products, fast checkout, happy shopping.</p>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md border border-slate-300 rounded-lg px-4 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => (
            <Link
              key={p._id}
              to={`/products/${p._id}`}
              className="group border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow bg-white"
            >
              <div className="h-36 bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-400 text-3xl">
                🛍️
              </div>
              <div className="p-4">
                <span className="text-xs uppercase text-slate-400 tracking-wide">{p.category}</span>
                <h4 className="font-semibold text-slate-800 mt-1 group-hover:text-blue-600">{p.name}</h4>
                <p className="text-blue-600 font-bold mt-1">${p.price}</p>
              </div>
            </Link>
          ))}
        </div>
        {products.length === 0 && <p className="text-slate-500 mt-6">No products found.</p>}
      </div>
    </div>
  );
}