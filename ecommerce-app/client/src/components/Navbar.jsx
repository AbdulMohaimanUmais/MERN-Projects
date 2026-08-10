import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="bg-slate-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="flex items-center gap-2 text-xl font-bold tracking-tight"
          >
            <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-sm">
              S
            </span>
            ShopIt
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Home
            </Link>

            <Link
              to="/cart"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Cart
            </Link>

            <Link
              to="/wishlist"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Wishlist
            </Link>

            <Link
              to="/orders"
              className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
            >
              Orders
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin"
                className="px-3 py-2 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
              >
                Admin
              </Link>
            )}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-slate-300 max-w-[150px] truncate">
                  Hi, {user.name}
                </span>

                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 active:bg-red-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-3 py-2 text-sm font-medium text-slate-200 hover:text-white transition-colors"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                  Signup
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-slate-800 py-4">
            <div className="flex flex-col gap-1">

              <Link
                to="/"
                onClick={closeMenu}
                className="px-4 py-3 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
              >
                Home
              </Link>

              <Link
                to="/cart"
                onClick={closeMenu}
                className="px-4 py-3 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
              >
                Cart
              </Link>

              <Link
                to="/wishlist"
                onClick={closeMenu}
                className="px-4 py-3 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
              >
                Wishlist
              </Link>

              <Link
                to="/orders"
                onClick={closeMenu}
                className="px-4 py-3 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
              >
                Orders
              </Link>

              {user?.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={closeMenu}
                  className="px-4 py-3 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors"
                >
                  Admin
                </Link>
              )}

              <div className="border-t border-slate-800 mt-3 pt-3">
                {user ? (
                  <div className="px-4">
                    <p className="text-sm text-slate-400 mb-3">
                      Signed in as{' '}
                      <span className="text-white font-medium">
                        {user.name}
                      </span>
                    </p>

                    <button
                      onClick={handleLogout}
                      className="w-full bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2 px-4">
                    <Link
                      to="/login"
                      onClick={closeMenu}
                      className="w-full text-center px-4 py-3 rounded-lg text-sm font-medium text-slate-200 hover:bg-slate-800 transition-colors"
                    >
                      Login
                    </Link>

                    <Link
                      to="/signup"
                      onClick={closeMenu}
                      className="w-full text-center bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg text-sm font-medium transition-colors"
                    >
                      Signup
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}