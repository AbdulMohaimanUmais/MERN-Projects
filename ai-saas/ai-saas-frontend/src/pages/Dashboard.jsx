import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';

const LIMIT_BY_PLAN = { free: 10, pro: 500 };

export default function Dashboard() {
  const { user, logout } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [chatId, setChatId] = useState(null);
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usage, setUsage] = useState({ count: 0, limit: 10 });
  const [limitReached, setLimitReached] = useState(false);
  const bottomRef = useRef(null);

  const loadChats = () => api.get('/chat').then(({ data }) => setChats(data)).catch(() => {});

  const loadUsage = () => {
    api.get('/auth/me').then(({ data }) => {
      const limit = LIMIT_BY_PLAN[data.plan] || 10;
      setUsage({ count: data.usageCount, limit });
      setLimitReached(data.usageCount >= limit);
    }).catch(() => {});
  };

  useEffect(() => {
    loadChats();
    loadUsage();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const openChat = async (id) => {
    const { data } = await api.get(`/chat/${id}`);
    setChatId(data._id);
    setMessages(data.messages);
  };

  const newChat = () => {
    setChatId(null);
    setMessages([]);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || limitReached) return;

    const userMsg = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const { data } = await api.post('/chat/message', { chatId, message: userMsg.content });
      setChatId(data.chatId);
      setUsage({ count: data.usageCount, limit: data.limit });
      setLimitReached(data.usageCount >= data.limit);
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }]);
      loadChats();
    } catch (err) {
      const msg = err.response?.data?.message || 'Error occurred';
      setMessages((prev) => [...prev, { role: 'assistant', content: msg }]);
      if (err.response?.status === 403) setLimitReached(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-3">
          <button onClick={newChat} className="w-full bg-white text-black rounded-lg py-2 text-sm font-medium hover:bg-gray-200 transition">
            + New Chat
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {chats.map((c) => (
            <button
              key={c._id}
              onClick={() => openChat(c._id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm truncate transition ${
                c._id === chatId ? 'bg-gray-700' : 'hover:bg-gray-800 text-gray-300'
              }`}
            >
              {c.title || 'New Chat'}
            </button>
          ))}
        </div>
        <div className="p-3 border-t border-gray-800 text-xs text-gray-400">
          {user?.name} · {usage.count}/{usage.limit} msgs
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="flex justify-between items-center px-6 py-3 border-b bg-white">
          <h1 className="font-semibold">AI SaaS</h1>
          <button onClick={logout} className="text-sm text-gray-500 hover:text-black">Logout</button>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-3 max-w-2xl mx-auto w-full">
          {messages.length === 0 && (
            <p className="text-center text-gray-400 mt-20">Start a new conversation</p>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`p-3 rounded-2xl max-w-[75%] text-sm ${
              m.role === 'user' ? 'bg-black text-white ml-auto rounded-br-sm' : 'bg-white border rounded-bl-sm'
            }`}>
              {m.content}
            </div>
          ))}
          {loading && <div className="text-sm text-gray-400">Thinking...</div>}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={sendMessage} className="p-4 border-t bg-white flex gap-2 max-w-2xl mx-auto w-full">
          <input
            className="flex-1 border rounded-full px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-black"
            placeholder={limitReached ? 'Message limit reached — upgrade to continue' : 'Type a message...'}
            value={input}
            disabled={limitReached}
            onChange={(e) => setInput(e.target.value)}
          />
          <button className="bg-black text-white px-5 rounded-full text-sm disabled:opacity-40" disabled={loading || limitReached}>
            Send
          </button>
        </form>
        {limitReached && (
          <p className="text-center text-xs text-red-500 pb-3">
            Limit reached. <a href="/pricing" className="underline">Upgrade to Pro</a>
          </p>
        )}
      </div>
    </div>
  );
}