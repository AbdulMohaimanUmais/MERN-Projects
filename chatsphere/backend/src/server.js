require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const User = require('./models/User');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: '*' }
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.io = io;
  next();
});

connectDB();

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chats', chatRoutes);

const messageRoutes = require('./routes/messageRoutes');
app.use('/api/messages', messageRoutes);

const uploadRoutes = require('./routes/uploadRoutes');
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.send('ChatSphere API running');
});

io.on('connection', (socket) => {
  socket.on('userOnline', async (userId) => {
    socket.userId = userId;
    await User.findByIdAndUpdate(userId, { status: 'online' });
    io.emit('statusUpdate', { userId, status: 'online' });
  });

  socket.on('joinChat', (chatId) => {
    socket.join(chatId);
  });

  socket.on('messagesRead', ({ chatId, userId }) => {
  socket.to(chatId).emit('messagesReadUpdate', { chatId, userId });
});

  socket.on('disconnect', async () => {
    if (socket.userId) {
      await User.findByIdAndUpdate(socket.userId, { status: 'offline' });
      io.emit('statusUpdate', { userId: socket.userId, status: 'offline' });
    }
    console.log('User disconnected:', socket.id);
  });

  socket.on('typing', ({ chatId, username }) => {
  socket.to(chatId).emit('userTyping', { username });
});

socket.on('stopTyping', ({ chatId }) => {
  socket.to(chatId).emit('userStoppedTyping');
});
});


const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));