#!/bin/bash
# HEAL CONNECT ULTIMATE - Emergency System Repair Protocol
# Purpose: Complete system restoration with full display functionality

echo "🚨 EMERGENCY REPAIR PROTOCOL ACTIVATED"
echo "🔧 HEAL CONNECT ULTIMATE: Full system restoration in progress..."

# Kill all existing processes
pkill -f vite || true
pkill -f tsx || true  
pkill -f node || true
sleep 2

# Clean up any port conflicts
lsof -ti:5000 | xargs -r kill -9 || true
lsof -ti:5173 | xargs -r kill -9 || true
lsof -ti:5174 | xargs -r kill -9 || true
sleep 1

echo "✅ Process cleanup complete"
echo "🔧 Restarting system with emergency protocols..."

# Start the application fresh
export NODE_ENV=development
exec npm run dev