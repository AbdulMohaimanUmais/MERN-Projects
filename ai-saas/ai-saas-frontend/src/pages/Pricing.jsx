import { useState } from 'react';
import api from '../api/axios';

export default function Pricing() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      const { data } = await api.post('/subscription/checkout');
      window.location.href = data.url;
    } catch (err) {
      alert(err.response?.data?.message || 'Something went wrong');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm text-center space-y-4">
        <h1 className="text-2xl font-bold">Upgrade to Pro</h1>
        <p className="text-gray-500">500 messages/month — $9/mo</p>
        <button onClick={handleUpgrade} disabled={loading} className="w-full bg-black text-white rounded-lg p-2">
          {loading ? 'Redirecting...' : 'Upgrade Now'}
        </button>
      </div>
    </div>
  );
}