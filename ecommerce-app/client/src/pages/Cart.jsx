import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Cart() {
  const [cart, setCart] = useState(null);

  const fetchCart = async () => {
    const { data } = await api.get('/cart');
    setCart(data);
  };

  useEffect(() => { fetchCart(); }, []);

  const removeItem = async (productId) => {
    await api.delete(`/cart/${productId}`);
    fetchCart();
  };

  const checkout = async () => {
    const { data } = await api.post('/orders/checkout');
    window.location.href = data.url;
  };

  if (!cart) return <p className="p-6 text-slate-500">Loading...</p>;

  const total = cart.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Your Cart</h2>
      {cart.items.length === 0 && <p className="text-slate-500">Cart is empty.</p>}
      <div className="space-y-3">
        {cart.items.map((item) => (
          <div key={item._id} className="flex justify-between items-center bg-white border border-slate-200 rounded-lg p-4">
            <div>
              <p className="font-medium text-slate-800">{item.product.name}</p>
              <p className="text-sm text-slate-500">Qty: {item.quantity} × ${item.product.price}</p>
            </div>
            <button onClick={() => removeItem(item.product._id)} className="text-red-600 hover:text-red-700 text-sm">
              Remove
            </button>
          </div>
        ))}
      </div>
      {cart.items.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <p className="text-lg font-bold text-slate-800">Total: ${total.toFixed(2)}</p>
          <button onClick={checkout} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg">
            Checkout
          </button>
        </div>
      )}
    </div>
  );
}