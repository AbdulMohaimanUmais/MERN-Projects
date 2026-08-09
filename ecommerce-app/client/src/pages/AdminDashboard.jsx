import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', category: '', stock: '' });

  const fetchData = async () => {
    const [statsRes, productsRes] = await Promise.all([
      api.get('/admin/analytics'),
      api.get('/products')
    ]);
    setStats(statsRes.data);
    setProducts(productsRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await api.post('/products', { ...form, price: Number(form.price), stock: Number(form.stock) });
    setForm({ name: '', description: '', price: '', category: '', stock: '' });
    fetchData();
  };

  const handleDelete = async (id) => {
    await api.delete(`/products/${id}`);
    fetchData();
  };

  if (!stats) return <p className="p-6 text-slate-500">Loading...</p>;

  const inputClass = "border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Admin Dashboard</h2>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase">Total Orders</p>
          <p className="text-2xl font-bold text-slate-800">{stats.totalOrders}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase">Paid Orders</p>
          <p className="text-2xl font-bold text-slate-800">{stats.paidOrders}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase">Revenue</p>
          <p className="text-2xl font-bold text-blue-600">${stats.totalRevenue}</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4">
          <p className="text-xs text-slate-400 uppercase">Products</p>
          <p className="text-2xl font-bold text-slate-800">{stats.totalProducts}</p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-slate-800 mb-3">Top Products</h3>
        <div className="space-y-1">
          {stats.topProducts.map((p) => (
            <div key={p._id} className="flex justify-between text-sm text-slate-600">
              <span>{p._id}</span>
              <span className="font-medium">{p.totalSold} sold</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5 mb-8">
        <h3 className="font-semibold text-slate-800 mb-4">Add Product</h3>
        <form onSubmit={handleCreate} className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className={inputClass} />
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required className={inputClass} />
          <input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className={inputClass} />
          <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required className={inputClass} />
          <input placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required className={inputClass} />
          <button type="submit" className="col-span-2 sm:col-span-5 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg mt-1">
            Add Product
          </button>
        </form>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h3 className="font-semibold text-slate-800 mb-4">Products</h3>
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p._id} className="flex justify-between items-center border-b border-slate-100 pb-2">
              <div>
                <p className="font-medium text-slate-800 text-sm">{p.name}</p>
                <p className="text-xs text-slate-500">${p.price} · Stock: {p.stock}</p>
              </div>
              <button onClick={() => handleDelete(p._id)} className="text-red-600 hover:text-red-700 text-sm">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}