import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    api.get(`/products/${id}`).then((res) => setProduct(res.data));
  }, [id]);

  const addToCart = async () => {
    try {
      await api.post('/cart', { productId: id, quantity: 1 });
      setMsg('Added to cart');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  const addToWishlist = async () => {
    try {
      await api.post('/wishlist', { productId: id });
      setMsg('Added to wishlist');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  if (!product) return <p className="p-6 text-slate-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white border border-slate-200 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-slate-800">{product.name}</h2>
        <p className="text-slate-600 mt-2">{product.description}</p>
        <p className="text-blue-600 font-bold text-xl mt-4">${product.price}</p>
        <p className="text-sm text-slate-500 mt-1">Stock: {product.stock}</p>
        <div className="flex gap-3 mt-6">
          <button onClick={addToCart} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg">
            Add to Cart
          </button>
          <button onClick={addToWishlist} className="border border-slate-300 hover:bg-slate-50 px-5 py-2 rounded-lg">
            Add to Wishlist
          </button>
        </div>
        {msg && <p className="text-green-600 mt-3 text-sm">{msg}</p>}
      </div>
    </div>
  );
}