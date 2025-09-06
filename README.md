Odoo NMIT

A full-stack web application built with React (Vite + TypeScript + TailwindCSS) on the frontend and Node.js + Express + MongoDB on the backend. The project includes Docker support for easy deployment and development.

🚀 Features

Frontend: Modern UI with React, Vite, and TailwindCSS

Backend: Node.js, Express, and TypeScript

Database: MongoDB with initialization scripts

Authentication: Integration-ready with AuthProvider examples

Dockerized: Run everything with Docker Compose

Cross-platform setup: setup.sh for Linux/macOS, setup.bat for Windows

📂 Project Structure
odoo-nmit/
├── backend/          # Node.js + Express + MongoDB backend
│   ├── src/          # Backend source code
│   ├── Dockerfile    # Backend Dockerfile
│   ├── docker-compose.yml
│   ├── package.json
│   └── ...
├── frontend/         # React + Vite + Tailwind frontend
│   ├── src/          # Frontend source code
│   ├── vite.config.ts
│   ├── package.json
│   └── ...
🛠️ Installation & Setup
Prerequisites

Node.js (v16+)

Docker & Docker Compose

Clone the Repository
git clone https://github.com/your-username/odoo-nmit.git
cd odoo-nmit
Backend Setup
cd backend
cp .env.example .env
npm install
npm run dev
Frontend Setup
cd frontend
cp .env.example .env
npm install
npm run dev
Run with Docker (Recommended)
docker-compose up --build
📖 Usage

Frontend runs on http://localhost:5173

Backend API runs on http://localhost:5000

MongoDB runs inside Docker (default port: 27017)

🧑‍💻 Development Scripts
Backend

npm run dev → Start backend in dev mode

npm run build → Build backend

npm run start → Start production server

Frontend

npm run dev → Start dev server

npm run build → Build frontend

npm run preview → Preview production build

🤝 Contributing

Contributions are welcome!

Fork the repository

Create a new branch (git checkout -b feature/my-feature)

Commit changes (git commit -m 'Add my feature')

Push to branch (git push origin feature/my-feature)

Open a Pull Request

📜 License

This project is licensed under the MIT License.

🌟 Acknowledgements

React

Vite

TailwindCSS

Node.js

Express

MongoDB

Docker

🏆 Badges
