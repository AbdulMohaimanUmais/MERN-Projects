import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Wishlist() {
  const [wishlist, setWishlist] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const fetchWishlist = async () => {
    const { data } = await api.get('/wishlist');
    setWishlist(data);
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  const remove = async (productId) => {
    setRemovingId(productId);

    try {
      await api.delete(`/wishlist/${productId}`);

      // UI se immediately remove
      setWishlist((prev) => ({
        ...prev,
        products: prev.products.filter(
          (product) => product._id !== productId
        ),
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setRemovingId(null);
    }
  };

  if (!wishlist) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
          Wishlist
        </h1>

        <p className="mt-2 text-gray-500">
          Products you've saved for later.
        </p>
      </div>

      {wishlist.products.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center shadow-sm">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-gray-100 flex items-center justify-center">
            <span className="text-2xl">♡</span>
          </div>

          <h2 className="text-xl font-semibold text-gray-900">
            No items yet
          </h2>

          <p className="mt-2 text-gray-500">
            Products you save will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {wishlist.products.map((p) => {
            const isRemoving = removingId === p._id;

            return (
              <div
                key={p._id}
                className={`bg-white border border-gray-200 rounded-2xl p-5 shadow-sm transition-all ${
                  isRemoving
                    ? 'opacity-50 scale-[0.99]'
                    : 'hover:shadow-md'
                }`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {p.name}
                    </h2>

                    <p className="mt-3 text-xl font-bold text-gray-900">
                      ${Number(p.price).toFixed(2)}
                    </p>
                  </div>

                  <button
                    onClick={() => remove(p._id)}
                    disabled={isRemoving}
                    className="w-full mt-5 py-2.5 px-4 rounded-xl border border-red-200 text-red-600 font-medium hover:bg-red-50 hover:text-red-700 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isRemoving ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
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
      )}
    </div>
  );
}