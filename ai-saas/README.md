# AI SaaS Platform

A full-stack AI-powered SaaS application with chat, subscription billing, and usage limits — built as a portfolio project demonstrating third-party API integration and SaaS architecture.

## Features

- 🔐 JWT authentication (signup/login)
- 💬 AI chat powered by Groq (Llama 3.3 70B)
- 🗂️ Persistent chat history with auto-generated titles
- 📊 Usage limits per plan (Free: 10 msgs, Pro: 500 msgs)
- 💳 Stripe subscription billing (checkout + webhooks)
- 🎨 Responsive UI with sidebar chat navigation

## Tech Stack

**Frontend:** React (Vite), Tailwind CSS, Zustand, React Router, Axios
**Backend:** Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
**Integrations:** Groq API (OpenAI-compatible), Stripe

## Project Structure

```
ai-saas-app/
  ai-saas-backend/
    src/
      config/       # DB connection
      models/       # User, Chat schemas
      controllers/  # Auth, chat, subscription logic
      routes/
      middleware/   # JWT auth guard
      utils/        # Groq & Stripe clients
    server.js
  ai-saas-frontend/
    src/
      pages/        # Login, Signup, Dashboard, Pricing
      store/        # Zustand auth store
      api/          # Axios instance
```

## Setup

### Backend
```bash
cd ai-saas-backend
npm install
```
Create `.env`:
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
GROQ_API_KEY=your_groq_key
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
STRIPE_PRICE_ID=your_stripe_price_id
CLIENT_URL=http://localhost:5173
```
```bash
npm run dev
```

### Frontend
```bash
cd ai-saas-frontend
npm install
```
Create `.env`:
```
VITE_API_URL=http://localhost:5000/api
```
```bash
npm run dev
```

## API Overview

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/signup` | POST | Register new user |
| `/api/auth/login` | POST | Login |
| `/api/auth/me` | GET | Get current user + usage |
| `/api/chat/message` | POST | Send message, get AI reply |
| `/api/chat` | GET | List user's chats |
| `/api/chat/:id` | GET | Get single chat |
| `/api/subscription/checkout` | POST | Create Stripe checkout session |
| `/api/subscription/webhook` | POST | Stripe webhook handler |

## Live Demo

- Frontend: _coming soon_
- Backend API: _coming soon_