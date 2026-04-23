#!/bin/bash

# Aura Cinema - Concurrent Startup Script

echo "🎬 Starting Aura Cinema..."

# Start Backend
echo "Starting FastAPI Backend..."
cd backend
if [ ! -d "venv" ]; then
    echo "Creating python venv and installing packages..."
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
else
    source venv/bin/activate
fi

# Run backend in background
uvicorn app:app --reload --port 8000 --host 0.0.0.0 &
BACKEND_PID=$!
cd ..

# Start Frontend
echo "Starting Vite Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing NPM packages..."
    npm install
fi

# Run frontend in background
npm run dev -- --port 3000 --host 0.0.0.0 &
FRONTEND_PID=$!

echo "✅ Aura Cinema is running!"
echo "Backend API: http://localhost:8000"
echo "Frontend UI: http://localhost:3000"
echo "Press Ctrl+C to stop both servers."

# Wait for user interrupt
trap "echo 'Stopping servers...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
