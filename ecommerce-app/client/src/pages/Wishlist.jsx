import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(null);

  const fetchWishlist = async () => {
    const { data } = await api.get('/wishlist');
    setWishlist(data);
  };

  useEffect(() => { fetchWishlist(); }, []);

  const remove = async (productId) => {
    await api.delete(`/wishlist/${productId}`);
    fetchWishlist();
  };

  if (!wishlist) return <p className="p-6 text-slate-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Wishlist</h2>
      {wishlist.products.length === 0 && <p className="text-slate-500">No items yet.</p>}
      <div className="space-y-3">
        {wishlist.products.map((p) => (
          <div key={p._id} className="flex justify-between items-center bg-white border border-slate-200 rounded-lg p-4">
            <p className="font-medium text-slate-800">{p.name} — <span className="text-blue-600">${p.price}</span></p>
            <button onClick={() => remove(p._id)} className="text-red-600 hover:text-red-700 text-sm">Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}