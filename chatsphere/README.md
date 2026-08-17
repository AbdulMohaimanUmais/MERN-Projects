# ChatSphere 💬

A full-stack, real-time chat application built with the MERN stack and Socket.io — supporting one-to-one messaging, group chats, file sharing, and a complete set of modern messaging features.

**Live Demo:** [chat.umais.online](https://chat.umais.online/)
**Backend API:** [umais-chat-app.bonto.run](https://umais-chat-app.bonto.run)

---

## ✨ Features

- **Authentication** — JWT-based register/login with hashed passwords (bcrypt)
- **One-to-one & Group Chat** — create direct conversations or multi-member groups
- **Real-time Messaging** — instant delivery via Socket.io, no refresh needed
- **Online/Offline Status** — live presence indicators
- **Typing Indicators** — see when the other person is typing
- **Read Receipts** — WhatsApp-style single/double tick system
- **Message Reactions** — emoji reactions (👍 ❤️ 😂 😮 😢 🙏)
- **Reply to Messages** — quote and reply to specific messages, including in groups
- **Edit & Delete Messages** — edit sent messages or delete them for everyone
- **File & Image Sharing** — upload and share files via Cloudinary
- **Message Search** — search within a conversation
- **Browser Notifications** — get notified of new messages when not actively viewing a chat
- **Avatar Upload** — custom profile pictures
- **Dark Mode** — toggle between light and dark themes
- **Fully Responsive UI** — clean, WhatsApp-inspired interface built with Tailwind CSS

---

## 🛠️ Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- React Router
- Socket.io Client
- Axios

**Backend**
- Node.js + Express
- MongoDB (Atlas) with Mongoose
- Socket.io
- JWT Authentication
- Cloudinary (file storage)
- bcrypt.js

**Deployment**
- Frontend → Vercel
- Backend → Bonto (containerized Node.js hosting)
- Database → MongoDB Atlas

---

## 📁 Project Structure

```
chatsphere/
├── backend/
│   ├── src/
│   │   ├── config/          # DB & Cloudinary config
│   │   ├── controllers/     # Route logic (auth, chat, message, upload)
│   │   ├── middleware/      # JWT auth middleware
│   │   ├── models/          # Mongoose schemas (User, Chat, Message)
│   │   ├── routes/          # Express routes
│   │   └── server.js        # Entry point + Socket.io setup
│   ├── Dockerfile
│   └── package.json
└── frontend/
    ├── src/
    │   ├── api/              # Axios instance
    │   ├── context/          # Auth context
    │   ├── pages/            # Login, Register, Chat
    │   └── App.jsx
    └── package.json
```

---

## 🚀 Getting Started (Local Setup)

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- Cloudinary account

### 1. Clone the repo
```bash
git clone https://github.com/AbdulMohaimanUmais/chatsphere.git
cd chatsphere
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```env
PORT=3000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

---

## 🔑 API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| GET | `/api/auth/users` | Get all users (excluding self) |
| PUT | `/api/auth/avatar` | Update user avatar |
| GET | `/api/chats` | Get all chats for logged-in user |
| POST | `/api/chats` | Create or access a one-to-one chat |
| POST | `/api/chats/group` | Create a group chat |
| GET | `/api/messages/:chatId` | Get messages for a chat |
| POST | `/api/messages` | Send a message |
| PUT | `/api/messages/edit/:id` | Edit a message |
| DELETE | `/api/messages/:id` | Delete a message |
| POST | `/api/messages/react/:id` | React to a message |
| GET | `/api/messages/:chatId/search` | Search messages in a chat |
| POST | `/api/upload` | Upload a file (Cloudinary) |

All routes except register/login require a `Bearer` JWT token.

---

## 📸 Screenshots

*(Add screenshots of the login page, chat interface, and dark mode here)*

---

## 👤 Author

**Umais**
Freelance Full-Stack Developer
[Fiverr](#) · [LinkedIn](#) · [Portfolio](#)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).