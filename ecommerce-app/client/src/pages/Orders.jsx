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
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Order History</h2>
      <div className="space-y-3">
        {orders.map((o) => (
          <div key={o._id} className="bg-white border border-slate-200 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <p className="font-medium text-slate-800 text-sm">#{o._id}</p>
              <span className={`text-xs px-2 py-1 rounded-full ${statusColor[o.status]}`}>{o.status}</span>
            </div>
            <p className="text-blue-600 font-bold mt-2">${o.totalAmount}</p>
          </div>
        ))}
      </div>
    </div>
  );
}