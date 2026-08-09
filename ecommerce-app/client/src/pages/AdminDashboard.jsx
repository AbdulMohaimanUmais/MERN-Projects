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

  if (!stats) return <p>Loading...</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>

      <h3>Analytics</h3>
      <p>Total Orders: {stats.totalOrders}</p>
      <p>Paid Orders: {stats.paidOrders}</p>
      <p>Total Revenue: ${stats.totalRevenue}</p>
      <p>Total Products: {stats.totalProducts}</p>
      <h4>Top Products</h4>
      {stats.topProducts.map((p) => <p key={p._id}>{p._id}: {p.totalSold} sold</p>)}

      <h3>Add Product</h3>
      <form onSubmit={handleCreate}>
        <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
        <input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
        <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
        <input placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
        <button type="submit">Add</button>
      </form>

      <h3>Products</h3>
      {products.map((p) => (
        <div key={p._id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <p>{p.name} - ${p.price} - Stock: {p.stock}</p>
          <button onClick={() => handleDelete(p._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}