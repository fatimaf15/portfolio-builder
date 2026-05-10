# DevPorto — Full-Stack Developer Portfolio Builder

Welcome to **DevPorto**, a high-fidelity, production-grade full-stack web application that allows software engineers to build, preview, custom-theme, and persist their professional CV portfolios in real-time.

Built as a classic **MERN (MongoDB, Express, React, Node)** architecture, DevPorto isolates responsibilities between an interactive Next.js frontend client and a high-performance Express REST API backend.

---

## 🏗️ Folder Structure

DevPorto is organized into two completely isolated folders at the workspace root to ensure a clean separation of concerns, scalability, and easy deployments:

```text
d:\proj\
├── backend/                        # Node.js + Express + MongoDB Server
│   ├── config/                     # Database and service configurations
│   │   └── db.js                   # Mongoose MongoDB connection handler
│   ├── controllers/                # Core endpoint controllers (business logic)
│   │   └── portfolioController.js  # CRUD actions & database seeding logic
│   ├── middleware/                 # Express pipeline middlewares
│   │   └── errorHandler.js         # Global JSON error formatting & logger
│   ├── models/                     # Mongoose Schema definitions (ORM)
│   │   └── Portfolio.js            # Structured CV, project, and experience models
│   ├── routes/                     # API Router mappings
│   │   └── portfolioRoutes.js      # REST API route endpoints
│   ├── .env                        # Local secret configurations
│   ├── .env.example                # Shared secret placeholders template
│   ├── package.json                # Backend NPM dependencies and run scripts
│   └── server.js                   # Express server entry point
│
└── frontend/                       # Next.js App Router Client
    ├── src/
    │   ├── app/                    # Next.js routes and layouts
    │   │   ├── globals.css         # Tailwind CSS v4 configuration and themes
    │   │   ├── layout.tsx          # Root HTML layout & Google Font loaders
    │   │   └── page.tsx            # Main Landing Page (State manager & grid)
    │   ├── components/             # Reusable interactive React components
    │   │   ├── Hero.tsx            # Premium animated headline with dashboard mockup
    │   │   ├── Navbar.tsx          # Responsive, glassmorphic navigation bar
    │   │   ├── PortfolioCreator.tsx# Multi-step wizard form modal with dynamic lists
    │   │   └── PortfolioList.tsx   # MongoDB explorer grid and CV inspector overlays
    │   ├── types/                  # Strict TypeScript interfaces
    │   │   └── index.ts            # Shared API & schema types
    │   └── utils/                  # Utility libraries
    │       └── api.ts              # Axios instance configuration & endpoints
    ├── .env.local                  # Local frontend secret bindings
    ├── .env.local.example          # Shared frontend secret template
    └── package.json                # Frontend NPM dependencies (React 19 + Framer Motion)
```

---

## 📂 Detailed Folder Breakdown

### 1. Backend Service (`/backend`)
*   **`server.js`**: Integrates the Express pipeline. It enables customized CORS rules, hooks up standard body parsers, registers CRUD routers, and handles catch-all server rejections.
*   **`config/db.js`**: Connects Node.js to your MongoDB daemon using Mongoose. It features custom color-coded terminal alerts for startup success or diagnostic failures.
*   **`models/Portfolio.js`**: Declares the structure of your data. Includes fields for basic profiles, social credentials, job milestones, project spotlights, and layout templates with built-in timestamps.
*   **`controllers/portfolioController.js`**: Implements CRUD functions (`find`, `findById`, `create`, `findByIdAndUpdate`, `deleteOne`). Also features a specialized `/seed` controller that instantly wipes and populates the database with template portfolios.
*   **`middleware/errorHandler.js`**: Captures exceptions thrown in controllers, logs details, and formats standard JSON error payloads. Stack traces are automatically hidden in production mode for security.

### 2. Frontend Client (`/frontend`)
*   **`src/app/page.tsx`**: Serves as the central state hub. It runs `useEffect` hooks to synchronize with MongoDB on load, maps callbacks to trigger creations/deletions, and monitors the backend's connection status.
*   **`src/utils/api.ts`**: Builds a specialized Axios HTTP client. An interceptor automatically bubbles up error responses with formatted messages. Exposes a typed object representing all valid backend transactions.
*   **`src/components/Navbar.tsx`**: Leverages Framer Motion to display a glassmorphic background that floats elegantly over your main screen, responding seamlessly to mobile views with an animated drawer.
*   **`src/components/Hero.tsx`**: Combines glowing spatial radial blobs, grid structures, and an animated IDE visual showing MongoDB's live status.
*   **`src/components/PortfolioCreator.tsx`**: A multi-step form wizard that tracks state variables. Allows you to append or remove job experiences and projects dynamically inside arrays before saving them to MongoDB.
*   **`src/components/PortfolioList.tsx`**: Displays saved profiles in a responsive grid. Offers a full-screen high-fidelity overlay modal to view a developer's full CV with active social links and styled themes.

---

## 📡 Frontend-Backend Communication Flow

The application relies on asynchronous RESTful web sockets and HTTP requests to keep data perfectly synchronized in real-time.

```text
+-----------------------+              HTTP Requests              +-------------------------+
|     Next.js Client    | -------------(Axios REST)-------------> |  Node / Express Server  |
|      (Port 3000)      | <-------------------------------------- |       (Port 5000)       |
+-----------------------+             JSON Responses              +-------------------------+
           |                                                                   |
     User Triggers                                                    Mongoose Queries
           v                                                                   v
+-----------------------+                                         +-------------------------+
|  React Render Cycles  |                                         |    MongoDB Database     |
|   (State Updates)     |                                         |       (Port 27017)      |
+-----------------------+                                         +-------------------------+
```

### Communication Mechanics
1.  **CORS Whitelisting**: The Express server uses the `cors` package to allow cross-origin requests from `http://localhost:3000` (and `3001` for testing fallback) while blocking unauthorized origins.
2.  **Environment Variables**: The client looks for `NEXT_PUBLIC_API_URL` to route requests. If undefined, it falls back gracefully to `http://localhost:5000/api`.
3.  **JSON Payload Handshake**: Express parses incoming client streams via `express.json()`. Mongoose validates inputs against Schema rules and returns standard 201 Created or 200 OK headers with JSON bodies.

---

## 🚀 How to Run Both Servers Locally

Follow these three simple steps to start your local developer environment:

### Step 1: Ensure MongoDB is Running
Make sure your local MongoDB server is active. If you are using MongoDB Community Server, it typically runs in the background on port `27017`.
*   *Alternatively, update the `MONGODB_URI` inside `backend/.env` with your secure Atlas cluster connection string.*

### Step 2: Run the Express Backend
Open a terminal in the root workspace and run:
```powershell
# Navigate into backend directory
cd backend

# Start the development server (runs nodemon for hot-reloads)
npm run dev
```
The server will boot on port `5000`. You can confirm its health status by opening:
👉 [http://localhost:5000/api/health](http://localhost:5000/api/health)

### Step 3: Run the Next.js Frontend
Open a separate terminal window and run:
```powershell
# Navigate into frontend directory
cd frontend

# Start the Next.js development server
npm run dev
```
The frontend will boot on port `3000`. Open your browser and navigate to:
👉 [http://localhost:3000](http://localhost:3000)

---

## 🛠️ Verification Checklist
*   [x] **Build Verification**: Run `npm run build` in the `/frontend` directory to ensure perfect TypeScript compiling and production bundling.
*   [x] **Tailwind CSS v4 Configuration**: Integrated inside `/frontend/src/app/globals.css` with instant hot-reload bindings.
*   [x] **State Management**: Built-in state sync inside Next.js handles live creations, updates, seeds, and deletions against local state arrays instantly.
