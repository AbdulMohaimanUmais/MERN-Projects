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
      await api.post('/cart', {
        productId: id,
        quantity: 1,
      });
      setMsg('Added to cart');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  const addToWishlist = async () => {
    try {
      await api.post('/wishlist', {
        productId: id,
      });
      setMsg('Added to wishlist');
    } catch (err) {
      setMsg(err.response?.data?.message || 'Error');
    }
  };

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-slate-500 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">

            {/* Product Image */}
            <div className="min-h-[300px] sm:min-h-[400px] bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
              <span className="text-7xl sm:text-8xl opacity-70">
                🛍️
              </span>
            </div>

            {/* Product Details */}
            <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                {product.category}
              </span>

              <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mt-2">
                {product.name}
              </h1>

              <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-5">
                ${Number(product.price).toFixed(2)}
              </p>

              <p className="text-slate-600 leading-7 mt-5">
                {product.description}
              </p>

              {/* Stock */}
              <div className="mt-6 flex items-center gap-2">
                <span className="text-sm text-slate-500">
                  Stock:
                </span>

                <span
                  className={`text-sm font-semibold ${
                    product.stock > 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {product.stock > 0
                    ? `${product.stock} available`
                    : 'Out of stock'}
                </span>
              </div>

              {/* Actions */}
              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={addToCart}
                  disabled={product.stock <= 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 disabled:bg-slate-300 disabled:cursor-not-allowed text-white py-3 px-5 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
                >
                  Add to Cart
                </button>

                <button
                  onClick={addToWishlist}
                  className="flex-1 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 py-3 px-5 rounded-xl font-semibold transition-colors"
                >
                  ♡ Add to Wishlist
                </button>
              </div>

              {/* Message */}
              {msg && (
                <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3">
                  <p className="text-sm font-medium text-blue-700">
                    {msg}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}