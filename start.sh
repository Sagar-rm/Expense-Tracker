#!/bin/bash

echo "🚀 Starting FinTrack AI - Smart Expense Tracker"
echo "================================================"

# Start MongoDB (if not running)
if ! pgrep -x "mongod" > /dev/null; then
  echo "📦 Starting MongoDB..."
  mongod --fork --logpath /tmp/mongod.log
else
  echo "✅ MongoDB already running"
fi

# Start ML Service in background
echo "🤖 Starting Python ML Service on port 8000..."
cd ml-service
source venv/bin/activate
python app.py &
ML_PID=$!
cd ..

# Start Backend Server in background
echo "⚙️  Starting Node.js Backend on port 5000..."
cd server
npm run dev &
SERVER_PID=$!
cd ..

# Start Frontend
echo "🎨 Starting React Frontend on port 5173..."
cd client
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ All services started!"
echo "   Frontend:   http://localhost:5173"
echo "   Backend:    http://localhost:5000"
echo "   ML Service: http://localhost:8000"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait and cleanup on exit
trap "kill $ML_PID $SERVER_PID $FRONTEND_PID 2>/dev/null; exit" SIGINT
wait
