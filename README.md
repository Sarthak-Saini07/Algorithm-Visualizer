# Algorithm Visualizer SaaS Platform 🚀

Algorithm Visualizer is a full-stack, web-based interactive application designed to help users understand algorithms through clear, step-by-step visual execution. The project emphasizes clarity, structured learning, and performance awareness, making it suitable for computer science students, educators, and interview preparation.

Recently transformed into a premium SaaS platform, the application features an AI Copilot Dashboard that centralizes execution intelligence, analytics, and metrics into a comprehensive sidebar, creating an immersive, wide-screen visualization experience.

---

## Objectives

The main objectives of this project are:
- To visualize algorithms step by step for deeper conceptual understanding
- To provide real-time insight into algorithm behavior, execution flow, and complexity profiles
- To enable comparison of multiple algorithms on the same input
- To build an interactive and structured learning platform for algorithms and data structures

---

## Features

- **Step-by-step Visualization**: Incremental execution of sorting, graph, dynamic programming, and tree algorithms
- **AI Copilot Dashboard**: A centralized, structured sidebar for step-by-step analysis, performance metrics, and execution intelligence
- **Full-Stack Architecture**: User authentication, state management, and saved visualizations via a Node.js/Express backend
- **Playback Controls**: Play, pause, forward, backward, and reset execution flows
- **Premium UI/UX**: Built with modern aesthetics (glassmorphism, vibrant colors, dark mode support) using Tailwind CSS and Framer Motion
- **Containerized Workflows**: Docker support and CI/CD pipelines via GitHub Actions

---

## Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS, Shadcn UI, Framer Motion
- **State Management**: Zustand, React Query
- **Charts**: Recharts

### Backend
- **Framework**: Node.js, Express.js with TypeScript
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT, bcrypt
- **Security**: Helmet, CORS

### DevOps
- **Containerization**: Docker, Docker Compose
- **CI/CD**: GitHub Actions

---

## Project Structure

```text
.
├── backend/                  # Node.js Express API
│   ├── src/
│   │   ├── config/           # Database and environment configs
│   │   ├── controllers/      # Route controllers (auth, visualizations)
│   │   ├── models/           # Mongoose models
│   │   └── routes/           # Express routes
│   └── package.json
├── src/                      # React Frontend
│   ├── algorithms/           # Algorithm definitions and generator functions
│   ├── components/           # Reusable UI components (Shadcn UI)
│   ├── visualizers/          # Visualization logic for different algorithm types
│   ├── state/                # Zustand stores for state management
│   ├── pages/                # Application pages (Dashboard, Login, etc.)
│   └── App.tsx               # Application entry point
└── package.json              # Frontend dependencies
```

---

## How the System Works

1. **Algorithm Execution**: Algorithms are implemented as generator functions that yield intermediate steps rather than returning a final result.
2. **State Management**: Each yielded step updates the global visual state (managed via Zustand).
3. **Visualization Engine**: Visualizers read the global state and use Framer Motion to render smooth transitions on screen.
4. **AI Copilot & Metrics**: The backend processes performance metrics and execution histories to display analytical insights within the Copilot dashboard.
5. **Playback**: Users can navigate the yielded states via playback controls, cleanly separating logic from UI.
