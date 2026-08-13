import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/auth';
import { useAuthStore } from '../store/authStore';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await registerUser(form);
      login(data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Register failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-lg font-semibold text-slate-900 tracking-tight">Jira Clone</h1>
          <p className="text-sm text-slate-500 mt-1">Create your workspace account</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6">
          {error && (
            <p className="text-red-600 text-sm mb-4 bg-red-50 border border-red-100 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <label className="text-xs font-medium text-slate-600 mb-1.5 block">Name</label>
          <input
            type="text" placeholder="Your name" required
            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm mb-4 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-shadow"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <label className="text-xs font-medium text-slate-600 mb-1.5 block">Email</label>
          <input
            type="email" placeholder="you@example.com" required
            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm mb-4 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-shadow"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <label className="text-xs font-medium text-slate-600 mb-1.5 block">Password</label>
          <input
            type="password" placeholder="••••••••" required
            className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm mb-5 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-shadow"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium py-2.5 rounded-md transition-colors">
            Create account
          </button>

          <p className="text-sm text-slate-500 mt-5 text-center">
            Have an account? <Link to="/login" className="text-indigo-600 font-medium hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}