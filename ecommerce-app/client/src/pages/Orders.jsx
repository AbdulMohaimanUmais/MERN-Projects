import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    api.get('/orders/my-orders').then((res) => setOrders(res.data));
  }, []);

  const statusColor = {
    paid: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    failed: 'bg-red-100 text-red-700',
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-800">
            Order History
          </h1>

          <p className="mt-2 text-sm sm:text-base text-slate-500">
            View and track your previous orders.
          </p>
        </div>

        {/* Empty State */}
        {orders.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-slate-100 flex items-center justify-center">
              <span className="text-2xl">📦</span>
            </div>

            <h2 className="text-xl font-semibold text-slate-800">
              No orders yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Your completed and pending orders will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <div
                key={o._id}
                className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

                  {/* Order Info */}
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-slate-400 font-medium">
                      Order ID
                    </p>

                    <h2 className="mt-1 font-semibold text-slate-800 break-all">
                      #{o._id}
                    </h2>

                    <span
                      className={`inline-flex mt-3 text-xs font-semibold px-3 py-1 rounded-full ${
                        statusColor[o.status] ||
                        'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="sm:text-right">
                    <p className="text-xs uppercase tracking-wide text-slate-400 font-medium">
                      Total Amount
                    </p>

                    <p className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">
                      ${Number(o.totalAmount).toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}