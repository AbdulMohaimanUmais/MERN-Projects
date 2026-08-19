import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { io } from 'socket.io-client';

const socket = io('https://umais-chat-app.bonto.run');

export default function Chat() {
  const { user, logout } = useAuth();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [showNewChat, setShowNewChat] = useState(false);
  const bottomRef = useRef(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const fileInputRef = useRef(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [typingUser, setTypingUser] = useState('');
  const typingTimeoutRef = useRef(null);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [reactionPickerId, setReactionPickerId] = useState(null);
  const [showProfile, setShowProfile] = useState(false);
  const avatarInputRef = useRef(null);
  const [darkMode, setDarkMode] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (activeChat) fetchMessages(activeChat._id);
  }, [activeChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
  if (activeChat) {
    socket.emit('joinChat', activeChat._id);
  }
}, [activeChat]);

useEffect(() => {
  socket.on('newMessage', (msg) => {
    if (activeChat && msg.chat === activeChat._id) {
      setMessages((prev) => [...prev, msg]);
      if (msg.sender._id !== user._id) {
        socket.emit('messagesRead', { chatId: activeChat._id, userId: user._id });
      }
      } else if (msg.sender._id !== user._id) {
  console.log('Notification trigger', Notification.permission);
  if (Notification.permission === 'granted') {
        new Notification(msg.sender.username, { body: msg.content });
      }
      fetchChats();
    }
  });

  return () => socket.off('newMessage');
}, [activeChat]);



useEffect(() => {
  socket.on('messagesReadUpdate', ({ chatId, userId }) => {
    if (activeChat && chatId === activeChat._id) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.readBy.includes(userId) ? msg : { ...msg, readBy: [...msg.readBy, userId] }
        )
      );
    }
  });

  return () => socket.off('messagesReadUpdate');
}, [activeChat]);

useEffect(() => {
  socket.emit('userOnline', user._id);

  socket.on('statusUpdate', ({ userId, status }) => {
    setOnlineUsers((prev) => ({ ...prev, [userId]: status }));
  });

  return () => socket.off('statusUpdate');
}, []);

useEffect(() => {
  if (activeChat && messages.length > 0) {
    socket.emit('messagesRead', { chatId: activeChat._id, userId: user._id });
  }
}, [messages, activeChat]);

useEffect(() => {
  if (Notification.permission === 'default') {
    Notification.requestPermission();
  }
}, []);

useEffect(() => {
  socket.on('messageDeleted', ({ messageId }) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg._id === messageId ? { ...msg, content: 'This message was deleted', fileUrl: '', deleted: true } : msg
      )
    );
  });

  return () => socket.off('messageDeleted');
}, []);

useEffect(() => {
  socket.on('userTyping', ({ username }) => {
    if (username !== user.username) setTypingUser(username);
  });
  socket.on('userStoppedTyping', () => setTypingUser(''));

  return () => {
    socket.off('userTyping');
    socket.off('userStoppedTyping');
  };
}, []);

useEffect(() => {
  socket.on('messageEdited', ({ messageId, content }) => {
    setMessages((prev) =>
      prev.map((msg) => (msg._id === messageId ? { ...msg, content, edited: true } : msg))
    );
  });

  return () => socket.off('messageEdited');
}, []);

useEffect(() => {
  socket.on('messageReaction', ({ messageId, reactions }) => {
    setMessages((prev) =>
      prev.map((msg) => (msg._id === messageId ? { ...msg, reactions } : msg))
    );
  });

  return () => socket.off('messageReaction');
}, []);





const fetchChats = async () => {
  const { data } = await API.get('/chats');
  setChats(data);
  data.forEach((chat) => socket.emit('joinChat', chat._id));
};

const fetchMessages = async (chatId) => {
  const { data } = await API.get(`/messages/${chatId}`);
  setMessages(data);
  socket.emit('messagesRead', { chatId, userId: user._id });
};

const searchMessages = async () => {
  if (!searchQuery.trim() || !activeChat) return;
  const { data } = await API.get(`/messages/${activeChat._id}/search?q=${searchQuery}`);
  setSearchResults(data);
};

  const fetchUsers = async () => {
    const { data } = await API.get('/auth/users');
    setAllUsers(data);
  };

const startChat = async (userId) => {
  const { data } = await API.post('/chats', { userId });
  socket.emit('joinChat', data._id);
  setChats((prev) => {
    const exists = prev.find((c) => c._id === data._id);
    return exists ? prev : [data, ...prev];
  });
  setActiveChat(data);
  setShowNewChat(false);
};


const toggleUserSelect = (userId) => {
  setSelectedUsers((prev) =>
    prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
  );
};

const createGroup = async () => {
  if (!groupName.trim() || selectedUsers.length < 2) return;
  const { data } = await API.post('/chats/group', { name: groupName, participants: selectedUsers });
  socket.emit('joinChat', data._id);
  setChats((prev) => [data, ...prev]);
  setActiveChat(data);
  setShowGroupModal(false);
  setGroupName('');
  setSelectedUsers([]);
};



const sendMessage = async () => {
  if (!text.trim() || !activeChat) return;
  await API.post('/messages', {
    chatId: activeChat._id,
    content: text,
    replyTo: replyingTo?._id || null,
  });
  setText('');
  setReplyingTo(null);
};


const deleteMessage = async (id) => {
  try {
    await API.delete(`/messages/${id}`);
  } catch (err) {
    console.error('Delete failed', err);
  }
  setConfirmDeleteId(null);
};

const startEdit = (msg) => {
  setEditingId(msg._id);
  setEditText(msg.content);
};

const saveEdit = async () => {
  if (!editText.trim()) return;
  try {
    await API.put(`/messages/edit/${editingId}`, { content: editText });
  } catch (err) {
    console.error('Edit failed', err);
  }
  setEditingId(null);
  setEditText('');
};

const addReaction = async (messageId, emoji) => {
  try {
    await API.post(`/messages/react/${messageId}`, { emoji });
  } catch (err) {
    console.error('Reaction failed', err);
  }
  setReactionPickerId(null);
};


const handleFileUpload = async (e) => {
  const file = e.target.files[0];
  if (!file || !activeChat) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const { data } = await API.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    await API.post('/messages', { chatId: activeChat._id, fileUrl: data.url });
  } catch (err) {
    console.error('Upload failed', err);
  }
  e.target.value = '';
};


const handleAvatarUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const { data } = await API.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const { data: updatedUser } = await API.put('/auth/avatar', { avatarUrl: data.url });
    const stored = JSON.parse(localStorage.getItem('chatUser'));
    const merged = { ...stored, avatar: updatedUser.avatar };
    localStorage.setItem('chatUser', JSON.stringify(merged));
    window.location.reload();
  } catch (err) {
    console.error('Avatar upload failed', err);
  }
};

  return (
    <div className={`flex h-screen ${darkMode ? 'bg-gray-900' : ''}`}>
      <div className="w-1/4 bg-gray-900 text-white flex flex-col">
  <div className="p-4 border-b border-gray-800 flex justify-between items-center">
    <div className="flex items-center gap-2">
<div
  onClick={() => setShowProfile(true)}
  className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center font-bold cursor-pointer overflow-hidden"
>
  {user.avatar ? (
    <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
  ) : (
    user.username[0].toUpperCase()
  )}
</div>
      <span className="font-semibold">{user.username}</span>
    </div>
    <button onClick={() => setDarkMode(!darkMode)} className="text-xs mr-2">
  {darkMode ? '☀️' : '🌙'}
</button>
    <button onClick={logout} className="text-xs text-red-400 hover:text-red-300">Logout</button>
  </div>
  

<div className="p-3 flex gap-2">
  <button
    onClick={() => { setShowNewChat(true); fetchUsers(); }}
    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm py-2 rounded-lg transition shadow-sm"
  >
    + Chat
  </button>

  <button
    onClick={() => { setShowGroupModal(true); fetchUsers(); }}
    className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm py-2 rounded-lg transition shadow-sm"
  >
    + Group
  </button>
</div>

  <div className="flex-1 overflow-y-auto px-2">
    {chats.map((chat) => {
      const other = !chat.isGroup ? chat.participants.find((p) => p._id !== user._id) : null;
      const isOnline = other && (onlineUsers[other._id] === 'online' || other.status === 'online');
      const label = chat.isGroup ? chat.name : other?.username || 'Unknown';
      return (
        <div
          key={chat._id}
          onClick={() => setActiveChat(chat)}
          className={`p-2 rounded-lg cursor-pointer mb-1 flex items-center gap-3 transition ${activeChat?._id === chat._id ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
        >
          <div className="relative">
<div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm overflow-hidden ${chat.isGroup ? 'bg-purple-600' : 'bg-gray-600'}`}>
  {!chat.isGroup && other?.avatar ? (
    <img src={other.avatar} alt="avatar" className="w-full h-full object-cover" />
  ) : (
    label[0]?.toUpperCase()
  )}
</div>
            {!chat.isGroup && (
              <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-gray-900 ${isOnline ? 'bg-green-500' : 'bg-gray-500'}`}></span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">{label}</div>
            {chat.lastMessage && (
              <div className="text-xs text-gray-400 truncate">{chat.lastMessage.content || '📎 File'}</div>
            )}
          </div>
        </div>
      );
    })}
  </div>
</div>

      <div className={`flex-1 flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        {activeChat ? (
          
          <>
<div className={`p-3 border-b flex justify-between items-center shadow-sm ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white'}`}>
  <div className="flex items-center gap-3">
<div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white overflow-hidden ${activeChat.isGroup ? 'bg-purple-600' : 'bg-gray-500'}`}>
  {!activeChat.isGroup && activeChat.participants.find(p => p._id !== user._id)?.avatar ? (
    <img src={activeChat.participants.find(p => p._id !== user._id).avatar} alt="avatar" className="w-full h-full object-cover" />
  ) : (
    (activeChat.isGroup ? activeChat.name : activeChat.participants.find(p => p._id !== user._id)?.username)?.[0]?.toUpperCase()
  )}
</div>
    <div>
      <div className="font-semibold text-sm">
        {activeChat.isGroup ? activeChat.name : activeChat.participants.find(p => p._id !== user._id)?.username}
      </div>
      {activeChat.isGroup && (
        <div className="text-xs text-gray-400">{activeChat.participants.length} members</div>
      )}
    </div>
  </div>
  <button onClick={() => setShowSearch(!showSearch)} className="text-sm text-blue-600 hover:text-blue-800">🔍</button>
</div>
{showSearch && (
  <div className="p-2.5 bg-gray-50 border-b flex gap-2 items-center">
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      onKeyDown={(e) => e.key === "Enter" && searchMessages()}
      placeholder="Search messages..."
      className="flex-1 border border-gray-300 px-3 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    />

    <button
      onClick={searchMessages}
      className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
    >
      Search
    </button>
  </div>
)}
{showSearch && searchResults.length > 0 && (
  <div className="bg-yellow-50 border-b max-h-48 overflow-y-auto">
    {searchResults.map((m) => (
      <div
        key={m._id}
        className="px-3 py-2 border-b border-yellow-100 last:border-b-0 hover:bg-yellow-100/60 transition-colors cursor-pointer"
      >
        <div className="text-sm">
          <span className="font-semibold text-gray-800">
            {m.sender.username}:
          </span>{" "}
          <span className="text-gray-600">{m.content}</span>
        </div>
      </div>
    ))}
  </div>
)}
            <div className="flex-1 overflow-y-auto p-4" style={{ backgroundColor: darkMode ? '#0d1418' : '#e5ddd5' }}>
{messages.map((msg) => {
  const isMine = msg.sender._id === user._id;
  const isRead = msg.readBy && msg.readBy.length > 1;
  const time = new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const isEditing = editingId === msg._id;
  return (
    <div key={msg._id} className={`mb-3 flex ${isMine ? 'justify-end' : 'justify-start'} group`}>
{!msg.deleted && !isEditing && (
  <div className="opacity-0 group-hover:opacity-100 flex gap-1 mr-2 self-center transition relative">
    <button onClick={() => setReplyingTo(msg)} className="text-xs text-gray-400 hover:text-green-500">↩️</button>
    <button onClick={() => setReactionPickerId(reactionPickerId === msg._id ? null : msg._id)} className="text-xs text-gray-400 hover:text-yellow-500">😊</button>
    {isMine && msg.content && !msg.fileUrl && (
      <button onClick={() => startEdit(msg)} className="text-xs text-gray-400 hover:text-blue-500">✏️</button>
    )}
    {isMine && (
      <button onClick={() => setConfirmDeleteId(msg._id)} className="text-xs text-gray-400 hover:text-red-500">🗑️</button>
    )}
    {reactionPickerId === msg._id && (
      <div className="absolute bottom-6 bg-white shadow-lg rounded-full px-2 py-1 flex gap-1 z-10">
        {['👍', '❤️', '😂', '😮', '😢', '🙏'].map((emoji) => (
          <button key={emoji} onClick={() => addReaction(msg._id, emoji)} className="hover:scale-125 transition">
            {emoji}
          </button>
        ))}
      </div>
    )}
  </div>
)}
      <div className={`px-3 py-2 rounded-2xl max-w-xs shadow-sm ${isMine ? 'bg-blue-600 text-white rounded-br-sm' : darkMode ? 'bg-gray-700 text-white rounded-bl-sm' : 'bg-white rounded-bl-sm'} ${msg.deleted ? 'italic opacity-60' : ''}`}>
        {!isMine && activeChat?.isGroup && !msg.deleted && (
          <div className="text-xs font-bold text-blue-600 mb-1">{msg.sender.username}</div>
        )}
        {msg.replyTo && (
  <div className={`text-xs border-l-2 pl-2 mb-1 opacity-70 ${isMine ? 'border-blue-200' : 'border-gray-400'}`}>
    <div className="font-semibold">{msg.replyTo.sender?.username}</div>
    <div className="truncate">{msg.replyTo.content || '📎 File'}</div>
  </div>
)}
        {isEditing ? (
<div className="flex gap-1">
  <input
    value={editText}
    onChange={(e) => setEditText(e.target.value)}
    onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
    className="text-black text-sm p-1 rounded flex-1 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-400"
    autoFocus
  />
  <button
    onClick={saveEdit}
    className="text-xs px-1 hover:scale-105 transition"
  >
    ✅
  </button>
  <button
    onClick={() => setEditingId(null)}
    className="text-xs px-1 hover:scale-105 transition"
  >
    ✕
  </button>
</div>
        ) : (
          <>
            {msg.content && <div className="break-words">{msg.content}</div>}
            {msg.edited && !msg.deleted && <span className="text-[10px] opacity-70">(edited)</span>}
            {msg.reactions && msg.reactions.length > 0 && (
  <div className="flex gap-1 mt-1 flex-wrap">
    {Object.entries(
      msg.reactions.reduce((acc, r) => {
        acc[r.emoji] = (acc[r.emoji] || 0) + 1;
        return acc;
      }, {})
    ).map(([emoji, count]) => (
      <span key={emoji} className="bg-white/20 text-xs px-1.5 py-0.5 rounded-full">
        {emoji} {count > 1 ? count : ''}
      </span>
    ))}
  </div>
)}
          </>
        )}
        {msg.fileUrl && !msg.deleted && (
          msg.fileUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
            <img src={msg.fileUrl} alt="attachment" className="max-w-full rounded mt-1" />
          ) : (
            <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="underline text-sm mt-1 block">
              📎 View File
            </a>
          )
        )}
        <div className={`text-[10px] mt-1 flex items-center gap-1 ${isMine ? 'text-blue-100 justify-end' : 'text-gray-400'}`}>
          {time}
          {isMine && <span>{isRead ? '✓✓' : '✓'}</span>}
        </div>
      </div>
    </div>
  );
})}
              <div ref={bottomRef} />
              {typingUser && (
  <div className="text-xs text-gray-500 italic px-2 pb-1">{typingUser} is typing...</div>
)}
            </div>

            {replyingTo && (
  <div className={`px-4 py-2 flex justify-between items-center border-t ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-50'}`}>
    <div className="text-xs">
      <span className="font-semibold">Replying to {replyingTo.sender.username}</span>
      <div className="truncate opacity-70">{replyingTo.content || '📎 File'}</div>
    </div>
    <button onClick={() => setReplyingTo(null)} className="text-sm ml-2">✕</button>
  </div>
)}

<div className={`p-4 flex gap-2 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
  <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
  <button onClick={() => fileInputRef.current.click()} className="px-3 border rounded text-gray-600">📎</button>
<input
  value={text}
  onChange={(e) => {
    setText(e.target.value);
    socket.emit('typing', { chatId: activeChat._id, username: user.username });
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping', { chatId: activeChat._id });
    }, 1500);
  }}
  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
  placeholder="Type a message"
  className={`flex-1 border rounded p-2 ${darkMode ? 'bg-gray-700 text-white border-gray-600' : ''}`}
/>
  <button onClick={sendMessage} className="bg-blue-600 text-white px-4 rounded">Send</button>
</div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">Select a chat</div>
        )}
      </div>

      {showNewChat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-80 max-h-96 overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h3 className="font-bold">Select User</h3>
              <button onClick={() => setShowNewChat(false)}>✕</button>
            </div>
            {allUsers.map((u) => (
              <div
                key={u._id}
                onClick={() => startChat(u._id)}
                className="p-2 hover:bg-gray-100 rounded cursor-pointer"
              >
                {u.username}
              </div>
            ))}
          </div>
        </div>
      )}

      {showGroupModal && (
<div className="fixed inset-0 bg-black/50 flex items-center justify-center">
  <div className="bg-white rounded-lg p-4 w-80 max-h-[28rem] overflow-y-auto shadow-lg">
    <div className="flex justify-between mb-4">
      <h3 className="font-bold">New Group</h3>
      <button
        onClick={() => {
          setShowGroupModal(false);
          setGroupName('');
          setSelectedUsers([]);
        }}
        className="hover:text-red-500 transition"
      >
        ✕
      </button>
    </div>

    <input
      value={groupName}
      onChange={(e) => setGroupName(e.target.value)}
      placeholder="Group name"
      className="w-full border p-2 rounded mb-3 focus:outline-none focus:ring-1 focus:ring-green-400"
    />

    <p className="text-xs text-gray-500 mb-2">Select at least 2 members</p>

    {allUsers.map((u) => (
      <label
        key={u._id}
        className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded cursor-pointer transition"
      >
        <input
          type="checkbox"
          checked={selectedUsers.includes(u._id)}
          onChange={() => toggleUserSelect(u._id)}
        />
        {u.username}
      </label>
    ))}

    <button
      onClick={createGroup}
      disabled={!groupName.trim() || selectedUsers.length < 2}
      className="w-full bg-green-600 hover:bg-green-700 text-white p-2 rounded mt-3 disabled:bg-gray-300 transition"
    >
      Create Group
    </button>
  </div>
</div>
)}

{confirmDeleteId && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-5 w-72 text-center">
      <p className="mb-4 text-sm">Delete this message?</p>
      <div className="flex gap-2">
        <button
          onClick={() => setConfirmDeleteId(null)}
          className="flex-1 border py-2 rounded text-sm"
        >
          Cancel
        </button>
        <button
          onClick={() => deleteMessage(confirmDeleteId)}
          className="flex-1 bg-red-600 text-white py-2 rounded text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
)}


{showProfile && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-5 w-72 text-center">
      <div className="w-20 h-20 rounded-full bg-blue-600 mx-auto mb-3 flex items-center justify-center font-bold text-2xl text-white overflow-hidden">
        {user.avatar ? (
          <img src={user.avatar} alt="avatar" className="w-full h-full object-cover" />
        ) : (
          user.username[0].toUpperCase()
        )}
      </div>
      <p className="font-semibold mb-3">{user.username}</p>
      <input type="file" ref={avatarInputRef} onChange={handleAvatarUpload} accept="image/*" className="hidden" />
      <button onClick={() => avatarInputRef.current.click()} className="bg-blue-600 text-white text-sm px-4 py-2 rounded mb-2">
        Change Avatar
      </button>
      <button onClick={() => setShowProfile(false)} className="block w-full text-sm text-gray-500 mt-2">
        Close
      </button>
    </div>
  </div>
)}



    </div>
  );
}