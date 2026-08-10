import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Cart() {
  const [cart, setCart] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState('');

  const fetchCart = async () => {
    try {
      const { data } = await api.get('/cart');
      setCart(data);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to load cart'
      );
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const removeItem = async (itemId) => {
    setRemovingId(itemId);
    setError('');

    try {
      await api.delete(`/cart/${itemId}`);

      // Immediately update UI
      setCart((prev) => ({
        ...prev,
        items: prev.items.filter(
          (item) => item._id !== itemId
        ),
      }));
    } catch (err) {
      setError(
        err.response?.data?.message || 'Failed to remove item'
      );
    } finally {
      setRemovingId(null);
    }
  };

  if (!cart) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-slate-500">
          <span className="w-5 h-5 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
          Loading cart...
        </div>
      </div>
    );
  }

  const total = cart.items.reduce(
    (sum, item) =>
      sum + item.product.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
            Your Cart
          </h1>

          <p className="mt-2 text-slate-500">
            Review your items before checkout.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3">
            <p className="text-sm font-medium text-red-600">
              {error}
            </p>
          </div>
        )}

        {/* Empty Cart */}
        {cart.items.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 sm:p-14 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-slate-100 flex items-center justify-center">
              <span className="text-2xl">🛒</span>
            </div>

            <h2 className="text-xl font-semibold text-slate-800">
              Your cart is empty
            </h2>

            <p className="mt-2 text-slate-500">
              Add some products to your cart to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => {
                const isRemoving =
                  removingId === item._id;

                return (
                  <div
                    key={item._id}
                    className={`bg-white border border-slate-200 rounded-2xl p-5 shadow-sm transition-all duration-200 ${
                      isRemoving
                        ? 'opacity-50 scale-[0.99]'
                        : 'hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-semibold text-slate-800 truncate">
                          {item.product.name}
                        </h2>

                        <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                          <span>
                            Qty:{' '}
                            <span className="font-medium text-slate-700">
                              {item.quantity}
                            </span>
                          </span>

                          <span>×</span>

                          <span className="font-medium text-slate-700">
                            $
                            {Number(
                              item.product.price
                            ).toFixed(2)}
                          </span>
                        </div>

                        <p className="mt-2 text-sm font-semibold text-blue-600">
                          $
                          {(
                            item.product.price *
                            item.quantity
                          ).toFixed(2)}
                        </p>
                      </div>

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() =>
                          removeItem(item._id)
                        }
                        disabled={isRemoving}
                        className="shrink-0 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isRemoving ? (
                          <span className="flex items-center gap-2">
                            <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
                            Removing...
                          </span>
                        ) : (
                          'Remove'
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm lg:sticky lg:top-6">

                <h2 className="text-xl font-semibold text-slate-800">
                  Order Summary
                </h2>

                <div className="mt-6 flex items-center justify-between border-b border-slate-100 pb-4">
                  <span className="text-slate-500">
                    Subtotal
                  </span>

                  <span className="font-medium text-slate-800">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-semibold text-slate-800">
                    Total
                  </span>

                  <span className="text-xl font-bold text-blue-600">
                    ${total.toFixed(2)}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const { data } =
                        await api.post(
                          '/orders/checkout'
                        );

                      window.location.href =
                        data.url;
                    } catch (err) {
                      setError(
                        err.response?.data
                          ?.message ||
                          'Checkout failed'
                      );
                    }
                  }}
                  className="w-full mt-6 bg-blue-600 text-white py-3.5 px-4 rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all shadow-sm"
                >
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}