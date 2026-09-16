# codeMate 🚀

codeMate is a real-time, highly collaborative coding platform designed to simulate technical interviews, pair-programming sessions, and competitive programming. Built with a robust modern tech stack, it allows developers to write code together, communicate via WebRTC, and receive AI-driven insights seamlessly.

## ✨ Features

- **Real-Time Collaborative Editor:** Conflict-free typing sync powered by `Yjs` and `y-monaco` running over Socket.io.
- **Advanced Matchmaking:** Queue up based on desired difficulty and topic to instantly pair with a peer.
- **Solo & Friend Modes:** Generate 6-digit alphanumeric room codes to invite friends, or practice completely solo.
- **Live Code Execution:** Compile and run C++, Python, and JavaScript directly in the browser via the Judge0 API.
- **Integrated WebRTC:** Built-in peer-to-peer video and voice calling for flawless communication without leaving the session.
- **AI-Powered Hints:** Stuck on a problem? Ask the Gemini API for contextual hints based on your current code snapshot.
- **Authentication:** Secure JWT-based Login and Registration flow with MongoDB.
- **Dark-Mode Glassmorphism UI:** A sleek, premium Next.js frontend styled with TailwindCSS/Vanilla CSS.

---

## 🛠️ Tech Stack

**Frontend:**
- [Next.js (App Router)](https://nextjs.org/)
- [React](https://react.dev/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Yjs](https://yjs.dev/) & `y-monaco`
- [Socket.io Client](https://socket.io/)
- [PeerJS](https://peerjs.com/) (WebRTC)
- [Framer Motion](https://www.framer.com/motion/)
- [TailwindCSS](https://tailwindcss.com/)

**Backend:**
- [Node.js](https://nodejs.org/) & [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- [Socket.io](https://socket.io/)
- [JSON Web Tokens (JWT)](https://jwt.io/)
- [Judge0 API](https://judge0.com/) (Code Execution)
- [Google Gemini API](https://ai.google.dev/) (AI Hints)

---

## 🚀 Local Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (Local instance or Atlas URI)
- Judge0 API Key / URL (Free tier available on RapidAPI or host your own)
- Google Gemini API Key

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/codeMate.git
cd codeMate
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Copy the `.env.example` file to `.env`:
```bash
cp .env.example .env
```
Fill in your MongoDB URI, JWT Secret, Judge0 API URL, and Gemini API Key in the `.env` file.

Start the development server:
```bash
npm run dev
```
*(The backend runs on `http://localhost:5000` by default)*

### 3. Frontend Setup
Open a new terminal and navigate to the frontend folder:
```bash
cd frontend
npm install
```
Copy the `.env.example` file to `.env.local`:
```bash
cp .env.example .env.local
```
Update the API and Socket URLs if your backend runs on a different port.

Start the Next.js development server:
```bash
npm run dev
```
*(The frontend runs on `http://localhost:3000` by default)*

---

## 🌍 Deployment Guide

codeMate is built to be easily deployed to modern cloud platforms.

### Deploying the Backend (Render, Railway, or Heroku)
1. Push your code to GitHub.
2. Connect your repository to your hosting provider (e.g., [Render](https://render.com/)).
3. Set the build command to `npm install` and the start command to `npm start` (which runs `node server.js`).
4. **Environment Variables:** Ensure you add all the variables from your `backend/.env` file to the deployment environment settings. Set your `MONGO_URI` to a cloud database like MongoDB Atlas.
5. Note the deployed backend URL (e.g., `https://codemate-backend.onrender.com`).

### Deploying the Frontend (Vercel)
1. Create a new project on [Vercel](https://vercel.com/) and import your GitHub repository.
2. Set the Root Directory to `frontend`.
3. The framework preset should automatically detect `Next.js`.
4. **Environment Variables:** Add the following variables:
   - `NEXT_PUBLIC_API_URL`: Your deployed backend URL + `/api` (e.g., `https://codemate-backend.onrender.com/api`)
   - `NEXT_PUBLIC_SOCKET_URL`: Your deployed backend URL (e.g., `https://codemate-backend.onrender.com`)
5. Click **Deploy**.

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.
# CodeMate
