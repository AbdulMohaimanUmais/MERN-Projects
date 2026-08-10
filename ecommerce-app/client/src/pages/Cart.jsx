import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Cart() {
  const [cart, setCart] = useState(null);

  const fetchCart = async () => {
    const { data } = await api.get('/cart');
    setCart(data);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (productId) => {
    await api.delete(`/cart/${productId}`);
    fetchCart();
  };

  const checkout = async () => {
    const { data } = await api.post('/orders/checkout');
    window.location.href = data.url;
  };

  if (!cart) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  );

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Your Cart
        </h1>
        <p className="mt-2 text-gray-500">
          Review your items before checkout.
        </p>
      </div>

      {cart.items.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-2xl">🛒</span>
          </div>

          <h2 className="text-xl font-semibold text-gray-900">
            Your cart is empty
          </h2>

          <p className="mt-2 text-gray-500">
            Add some products to your cart to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div
                key={item.product._id}
                className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-semibold text-gray-900 truncate">
                      {item.product.name}
                    </h2>

                    <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-gray-500">
                      <span>
                        Qty: <span className="font-medium">{item.quantity}</span>
                      </span>

                      <span>×</span>

                      <span className="font-medium text-gray-700">
                        ${item.product.price.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.product._id)}
                    className="shrink-0 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm lg:sticky lg:top-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Order Summary
              </h2>

              <div className="mt-6 flex items-center justify-between border-b border-gray-100 pb-4">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">
                  ${total.toFixed(2)}
                </span>
              </div>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-semibold text-gray-900">
                  Total
                </span>
                <span className="text-xl font-bold text-gray-900">
                  ${total.toFixed(2)}
                </span>
              </div>

              <button
                onClick={checkout}
                className="w-full mt-6 bg-black text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-gray-800 active:scale-[0.98] transition-all"
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}