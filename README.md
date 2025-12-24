# 🏙️ CrowdSense

> **Real-time crowd density tracking and analysis system.**
> Leverages GPS data to monitor crowd levels without hardware sensors, providing visual analytics and safety alerts.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 📖 Table of Contents

- [About the Project](#-about-the-project)
- [Tech Stack](#-tech-stack)
- [Git Flow & Development Process](#-git-flow--development-process)
- [Getting Started](#-getting-started)
- [Running with Docker](#-running-with-docker-recommended)
- [Manual Setup](#-manual-setup)
- [Deployment](#-deployment)
- [Command Reference](#-command-reference)

---

## 💡 About the Project

CrowdSense is a full-stack web application designed to track user locations in real-time. It aggregates geospatial data to calculate crowd density in specific zones, visualizing this data on an interactive map.

**Key Features:**

- 📍 **Real-time Tracking**: Live user positions on Leaflet maps.
- 🚦 **Density Analysis**: Dynamic zoning (Green: Low, Yellow: Moderate, Red: High).
- 🔔 **Safety Alerts**: Instant notifications when entering high-density zones.
- 🔐 **Secure Auth**: JWT-based authentication for data privacy.
- 📱 **Responsive**: Mobile-first design for on-the-go usage.

---

## � Project Structure

A quick look at the top-level files and directories you'll see in this project.

```text
CrowdSense/
├── backend/                # Java Spring Boot Application
│   ├── src/main/java       # Source code (Controllers, Services)
│   ├── src/main/resources  # Configuration (props, static files)
│   └── Dockerfile          # Backend container instructions
├── frontend/               # React Vite Application
│   ├── src/components      # Reusable UI components
│   ├── src/pages           # Main application pages
│   ├── src/services        # API & WebSocket services
│   └── Dockerfile          # Frontend container instructions
├── docker-compose.yml      # Orchestrates the full stack
└── README.md               # Project documentation
```

---

## �🛠 Tech Stack

### Frontend

- **React (Vite)**: Fast, modern UI library.
- **Tailwind CSS**: Utility-first styling for rapid design.
- **Leaflet / React-Leaflet**: Open-source mapping library.
- **Socket.io / Stomp**: Real-time bi-directional communication.

### Backend

- **Java 17 (Spring Boot)**: Robust, enterprise-grade backend framework.
- **MongoDB**: NoSQL database for efficient geospatial queries ($near, $geoWithin).
- **Spring Security + JWT**: Stateless authentication mechanism.

### DevOps

- **Docker**: Containerization for consistent environments.
- **Render**: Backend cloud hosting.
- **Vercel**: Frontend edge deployment.

---

## 🔄 Git Flow & Development Process

This project strictly follows the **Git Flow** methodology to ensure code quality and easier collaboration. Below are the steps and commands we use daily:

### 1. Initialize & Clone

Start by getting the repository to your local machine.

```bash
git clone https://github.com/ramsinghyadav4472/CrowdSense.git
# Why? Downloads the entire project history and files to your computer.
```

### 2. Feature Branch Workflow

Never commit directly to `master`. Always create a specific branch for your task.

```bash
git checkout -b feature/login-page
# Why? Creates and switches to a new branch. Isolates your new code so the main app doesn't break while you work.
```

### 3. Staging & Committing

Save your progress frequently with clear messages.

```bash
git status
# Why? Shows which files have changed.

git add .
# Why? Moves your changes to the "Staging Area", preparing them to be saved.

git commit -m "feat: implement responsive login form"
# Why? Saves a snapshot of your staged changes with a descriptive message.
```

### 4. Syncing & Pushing

Share your work with the team.

```bash
git push origin feature/login-page
# Why? Uploads your branch to GitHub so others can review it or help you.
```

### 5. Merging (Pull Request)

Once your feature is ready, you merge it back to the main branch (usually via GitHub interface, but here is the CLI equivalent).

```bash
git checkout master
git pull origin master
# Why? Updates your local main branch with the latest code from other developers.
```

### 6. Handling Merge Conflicts

Sometimes when merging, two developers might edit the same line of code. Git will stop and ask you to fix it manually.

1. **Identify Conflict**: Git warns you: `CONFLICT (content): Merge conflict in...`
2. **Open the File**: Look for conflict markers:

    ```
    <<<<<<< HEAD
    Your changes (Current Branch)
    =======
    Incoming changes (from Master/Other Branch)
    >>>>>>> feature/other-branch
    ```

3. **Resolve**: Delete the markers (`<<<<`, `====`, `>>>>`) and keep the correct code.

4. **Mark as Resolved**:

    ```bash
    git add .
    git commit -m "fix: resolve merge conflicts"
    ```

5. **Continue**: Proceed with your push or merge.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18+)
- **Java JDK** (v17)
- **Docker Desktop** (Optional, but recommended)
- **MongoDB** (Local or Atlas)

---

## 🐳 Running with Docker (Recommended)

The easiest way to run the full stack (Frontend + Backend + DB).

1. **Build and Start:**

    ```bash
    docker-compose up --build
    ```

    *Why?* Compiles the code and starts containers defined in `docker-compose.yml`.

2. **Access:**
    - Frontend: <http://localhost:3000>
    - Backend: <http://localhost:8081>

---

## ⚙️ Manual Setup

### Backend Setup

1. Navigate to the backend directory:

    ```bash
    cd backend
    ```

2. Configure Environment:
    Update `src/main/resources/application.properties` with your MongoDB URI.
3. Run the application:

    ```bash
    mvn spring-boot:run
    ```

    *Why?* Uses Maven to download dependencies and start the built-in Tomcat server.

### Frontend Setup

1. Navigate to the frontend directory:

    ```bash
    cd frontend
    ```

2. Install Dependencies:

    ```bash
    npm install
    ```

    *Why?* Downloads all libraries listed in `package.json` (React, Tailwind, etc.).
3. Start Development Server:

    ```bash
    npm run dev
    ```

    *Why?* Starts Vite's fast development server with Hot Module Replacement (HMR).

---

## ☁️ Deployment

### Backend (Render)

1. Connect your repo to **Render**.
2. Set Environment Variables:
    - `SPRING_DATA_MONGODB_URI`: Your MongoDB Atlas connection string.
    - `SPRING_DATA_MONGODB_DATABASE`: `crowdtracking`

### Frontend (Vercel)

1. Connect your repo to **Vercel**.
2. Set Environment Variables:
    - `VITE_API_URL`: `https://your-backend.onrender.com/api`
    - `VITE_SOCKET_URL`: `wss://your-backend.onrender.com/ws-crowd`

---

## 📚 Command Reference

A quick look at common commands used in this project.

| Command | Category | Description | Why use it? |
| :--- | :--- | :--- | :--- |
| `npm install` | NPM | Installs node modules. | Required to set up the project dependencies locally. |
| `npm run build` | NPM | Compiles frontend for production. | Optimizes code for performance before deployment. |
| `mvn clean install` | Maven | Builds Java project. | Compiles Java code and runs tests to ensure stability. |
| `docker-compose up` | Docker | Starts all services. | spins up the entire environment (DB, API, Client) in one go. |
| `git pull` | Git | Fetches remote changes. | Ensures you are working on the latest version of the code. |
| `git stash` | Git | Temporarily shelves changes. | Useful if you need to switch branches but aren't ready to commit. |

---
---

## 🤝 Contributing

We welcome contributions! Please follow these steps to contribute:

1. **Fork** the repository on GitHub.
2. **Clone** your fork locally.
3. **Create a Branch** (`git checkout -b feature/amazing-feature`).
4. **Commit** your changes (`git commit -m 'Add some amazing feature'`).
5. **Push** to the Branch (`git push origin feature/amazing-feature`).
6. Open a **Pull Request**.

---

## ❓ Troubleshooting

| Issue | Solution |
| :--- | :--- |
| **Port 8080 already in use** | Stop other services using this port or change `server.port` in `application.properties`. |
| **MongoDB connection failed** | Ensure MongoDB is running or check your connection string/IP whitelist in Atlas. |
| **Frontend CORS Error** | Check that `VITE_API_URL` is correct and the Backend allows the frontend origin. |

---

## 📞 Contact

If you have any questions, feel free to reach out to the project team or open an issue in the repository.

---
*Built with ❤️ by the CrowdSense Team*
