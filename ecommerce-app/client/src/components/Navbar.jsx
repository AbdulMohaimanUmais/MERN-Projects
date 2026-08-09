import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="flex items-center gap-6 px-6 py-4 bg-slate-900 text-white">
      <Link to="/" className="font-bold text-lg">ShopIt</Link>
      <Link to="/" className="hover:text-slate-300">Home</Link>
      <Link to="/cart" className="hover:text-slate-300">Cart</Link>
      <Link to="/wishlist" className="hover:text-slate-300">Wishlist</Link>
      <Link to="/orders" className="hover:text-slate-300">Orders</Link>
      {user?.role === 'admin' && <Link to="/admin" className="hover:text-slate-300">Admin</Link>}
      <div className="ml-auto flex items-center gap-4">
        {user ? (
          <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded text-sm">
            Logout ({user.name})
          </button>
        ) : (
          <>
            <Link to="/login" className="hover:text-slate-300">Login</Link>
            <Link to="/signup" className="bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded text-sm">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}