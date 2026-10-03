# 💬 LinkUp

LinkUp is a full-stack real-time chat application built with **Next.js, Node.js, Express, Socket.IO, and MySQL**.

The project focuses on real-time communication, user authentication, persistent messaging, online presence, and a clean messaging experience.

---

## ✨ Features

- User registration and login
- JWT-based authentication
- Password hashing with bcrypt
- User profile management
- User search
- Direct conversations
- Real-time messaging with Socket.IO
- Persistent message history
- Online/offline presence
- Last seen status
- Typing indicators
- Conversation deletion
- Responsive chat interface

---

## 🛠️ Tech Stack

### Frontend

- Next.js
- React
- JavaScript
- Tailwind CSS
- Axios
- Socket.IO Client

### Backend

- Node.js
- Express.js
- Socket.IO
- JWT
- bcrypt.js

### Database

- MySQL
- mysql2

---

## 📁 Project Structure

```text
LinkUp/
├── client/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── hooks/
│   │   └── lib/
│   └── package.json
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/Nabil-Shartaj-Khan/LinkUp.git
```

Move into the project:

```bash
cd LinkUp
```

---

## 📦 Install Dependencies

Install frontend dependencies:

```bash
cd client
npm install
```

Install backend dependencies:

```bash
cd ../server
npm install
```

---

## ⚙️ Environment Variables

Create a `.env` file inside the `server` directory:

```text
server/.env
```

Add the following variables:

```env
PORT=5000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_database_password
DB_NAME=linkup
DB_PORT=3306

JWT_SECRET=your_secure_jwt_secret
JWT_EXPIRES_IN=7d
```

> Do not commit your `.env` file to GitHub.

---

## 🗄️ Database Setup

Create a MySQL database called:

```sql
CREATE DATABASE linkup;
```

The application currently uses the following main tables:

```text
users
conversations
conversation_members
messages
```

Make sure MySQL is running before starting the backend.

---

## ▶️ Running the Application

### Start the backend

From the `server` directory:

```bash
npm start
```

If your project currently uses Node directly instead:

```bash
node server.js
```

The backend runs on:

```text
http://localhost:5000
```

### Start the frontend

Open another terminal:

```bash
cd client
npm run dev
```

The frontend runs on:

```text
http://localhost:3000
```

Open the application in your browser:

```text
http://localhost:3000
```

---

## 🔌 Real-Time Communication

LinkUp uses **Socket.IO** for real-time communication.

Socket events currently handle functionality including:

```text
new_message
join_conversation
user_presence
typing_start
typing_stop
user_typing
conversation_deleted
```

This allows messages, presence changes, typing indicators, and conversation events to update without manually refreshing the page.

---

## 🔐 Authentication

Authentication is handled using **JSON Web Tokens (JWT)**.

Passwords are hashed with **bcrypt** before being stored in the database.

Protected API routes require an authorization header:

```text
Authorization: Bearer <token>
```

Socket.IO connections are also authenticated using the user's JWT.

---

## 🛣️ Planned Improvements

LinkUp is actively being developed. Planned features include:

- Group conversations
- Message delivery status
- Read receipts
- Unread message counts
- Reply to messages
- Edit and delete messages
- Message reactions
- Forward messages
- Image and file attachments
- Message search
- User blocking and privacy controls
- Conversation mute, pin, and archive
- Dark mode
- Improved mobile responsiveness

---

## 🔒 Security

Sensitive configuration values are stored using environment variables and are excluded from version control.

The project uses:

- bcrypt password hashing
- JWT authentication
- Protected API routes
- Authenticated Socket.IO connections
- Conversation membership validation

---

## 👨‍💻 Author

**Nabil Shartaj Khan**

---

## 📄 License

This project is currently intended for personal and portfolio use.
