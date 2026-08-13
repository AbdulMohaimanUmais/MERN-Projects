import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { getNotifications, markRead } from '../api/notifications';
import socket from '../socket';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const [notifs, setNotifs] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchNotifs = async () => {
    const { data } = await getNotifications();
    setNotifs(data);
  };

  useEffect(() => {
    fetchNotifs();
    socket.emit('join', user._id);

    socket.on('notification:new', (notif) => {
      setNotifs((prev) => [notif, ...prev]);
    });

    return () => socket.off('notification:new');
  }, []);

  const handleRead = async (id) => {
    await markRead(id);
    setNotifs((prev) => prev.map((n) => (n._id === id ? { ...n, read: true } : n)));
  };

  const unreadCount = notifs.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center relative">
      <span className="font-semibold text-slate-900 text-base tracking-tight">Jira Clone</span>

      <div className="flex items-center gap-5">
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="relative w-8 h-8 flex items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
            </svg>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-indigo-600 text-white text-[10px] font-medium rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg max-h-96 overflow-y-auto z-50">
              <div className="px-4 py-2.5 border-b border-slate-100">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Notifications</p>
              </div>
              {notifs.length === 0 && (
                <p className="px-4 py-6 text-sm text-slate-400 text-center">You're all caught up</p>
              )}
              {notifs.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleRead(n._id)}
                  className={`px-4 py-3 text-sm border-b border-slate-50 last:border-0 cursor-pointer transition-colors ${
                    n.read ? 'text-slate-500 hover:bg-slate-50' : 'text-slate-800 bg-indigo-50/60 hover:bg-indigo-50'
                  }`}
                >
                  {n.message}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
          <div className="w-7 h-7 rounded-full bg-indigo-600 text-white text-xs font-medium flex items-center justify-center">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <span className="text-sm text-slate-600">{user?.name}</span>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-500 hover:text-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}