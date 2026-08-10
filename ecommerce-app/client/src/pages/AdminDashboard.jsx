import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);

  const [form, setForm] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
  });

  const fetchData = async () => {
    const [statsRes, productsRes] = await Promise.all([
      api.get('/admin/analytics'),
      api.get('/products'),
    ]);

    setStats(statsRes.data);
    setProducts(productsRes.data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();

    await api.post('/products', {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    });

    setForm({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: '',
    });

    fetchData();
  };

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    fetchData();
  };

  if (!stats) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-500 text-lg">Loading...</p>
      </div>
    );
  }

  const inputClass =
    'w-full border border-slate-300 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
            Admin Dashboard
          </h1>

          <p className="mt-2 text-sm sm:text-base text-slate-500">
            Manage your store, products and sales overview.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Total Orders */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Total Orders
            </p>

            <p className="text-3xl font-bold text-slate-800 mt-2">
              {stats.totalOrders}
            </p>
          </div>

          {/* Paid Orders */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Paid Orders
            </p>

            <p className="text-3xl font-bold text-slate-800 mt-2">
              {stats.paidOrders}
            </p>
          </div>

          {/* Revenue */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Revenue
            </p>

            <p className="text-3xl font-bold text-blue-600 mt-2">
              ${Number(stats.totalRevenue).toFixed(2)}
            </p>
          </div>

          {/* Products */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
              Products
            </p>

            <p className="text-3xl font-bold text-slate-800 mt-2">
              {stats.totalProducts}
            </p>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-800">
                Top Products
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Best performing products by sales.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {stats.topProducts.length > 0 ? (
              stats.topProducts.map((p, index) => (
                <div
                  key={p._id}
                  className="flex items-center justify-between gap-4 border-b border-slate-100 last:border-0 pb-3 last:pb-0"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-7 h-7 shrink-0 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </span>

                    <span className="text-sm font-medium text-slate-700 truncate">
                      {p._id}
                    </span>
                  </div>

                  <span className="shrink-0 text-sm font-semibold text-slate-600">
                    {p.totalSold} sold
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                No sales data available.
              </p>
            )}
          </div>
        </div>

        {/* Add Product */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm mb-8">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-800">
              Add Product
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Add a new product to your store.
            </p>
          </div>

          <form
            onSubmit={handleCreate}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4"
          >
            <input
              placeholder="Product name"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
              className={inputClass}
            />

            <input
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              required
              className={inputClass}
            />

            <input
              placeholder="Price"
              type="number"
              min="0"
              step="0.01"
              value={form.price}
              onChange={(e) =>
                setForm({ ...form, price: e.target.value })
              }
              required
              className={inputClass}
            />

            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) =>
                setForm({ ...form, category: e.target.value })
              }
              required
              className={inputClass}
            />

            <input
              placeholder="Stock"
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) =>
                setForm({ ...form, stock: e.target.value })
              }
              required
              className={inputClass}
            />

            <button
              type="submit"
              className="sm:col-span-2 lg:col-span-5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white py-3 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
            >
              Add Product
            </button>
          </form>
        </div>

        {/* Products */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-slate-800">
              Products
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Manage products currently available in your store.
            </p>
          </div>

          <div className="space-y-3">
            {products.length > 0 ? (
              products.map((p) => (
                <div
                  key={p._id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-100 rounded-xl p-4 hover:bg-slate-50 transition-colors"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 text-sm sm:text-base truncate">
                      {p.name}
                    </p>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs sm:text-sm text-slate-500">
                      <span>
                        ${Number(p.price).toFixed(2)}
                      </span>

                      <span>
                        Stock: {p.stock}
                      </span>

                      <span>
                        {p.category}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDelete(p._id)}
                    className="w-full sm:w-auto shrink-0 border border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500 text-center py-6">
                No products available.
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}