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
    <nav className="bg-white shadow px-6 py-3 flex justify-between items-center relative">
      <span className="font-bold text-lg">Jira Clone</span>
      <div className="flex items-center gap-4">
        <div className="relative">
          <button onClick={() => setOpen(!open)} className="relative">
            🔔
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-72 bg-white shadow rounded max-h-80 overflow-y-auto z-50">
              {notifs.length === 0 && <p className="p-3 text-sm text-gray-400">No notifications</p>}
              {notifs.map((n) => (
                <div
                  key={n._id}
                  onClick={() => handleRead(n._id)}
                  className={`p-3 text-sm border-b cursor-pointer ${n.read ? 'bg-white' : 'bg-blue-50'}`}
                >
                  {n.message}
                </div>
              ))}
            </div>
          )}
        </div>
        <span className="text-sm text-gray-600">{user?.name}</span>
        <button onClick={handleLogout} className="text-sm bg-red-500 text-white px-3 py-1 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
}