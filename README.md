# Remote Team Daily Stand-up Tool

A premium full-stack MERN application for remote teams to submit daily stand-up updates asynchronously.

## Tech Stack

- **Frontend:** React, Tailwind CSS, Vite, Lucide React, Axios, React Router
- **Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, Bcrypt
- **Design:** Premium Beige + White theme, Minimal luxury layout

## Features

- **Authentication:** Gmail-only registration, JWT-based protected routes.
- **Team Management:** Create or join teams using unique Team IDs.
- **Daily Stand-ups:** Submit what you did yesterday, today, and any blockers.
- **Team Feed:** View all team updates grouped by date with search and filtering.
- **Blocker Monitoring:** Dedicated panel for managers to track and resolve blockers.
- **Analytics:** Weekly productivity charts and contributor stats.

## Getting Started

### Prerequisites

- Node.js installed
- MongoDB Atlas account and URI

### Installation

1. Clone the repository
2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` folder:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_secret_key
   NODE_ENV=development
   ```
   Run the backend:
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd frontend
   npm install
   ```
   Run the frontend:
   ```bash
   npm run dev
   ```

4. Access the application at `http://localhost:5173`

## Authentication Rules
- Only `@gmail.com` emails are allowed for registration.
- Passwords must be at least 6 characters long.
- After login, users are redirected to the Dashboard.
