#!/bin/bash
# DigiAssistant Startup Script for Railpack
# This script starts the FastAPI backend server

set -e

echo "🚀 Starting DigiAssistant Backend..."

# Navigate to backend directory
cd backend

# Install dependencies if requirements.txt exists (Railpack should handle this, but just in case)
if [ -f "requirements.txt" ]; then
    echo "📦 Installing Python dependencies..."
    pip install --upgrade pip
    pip install -r requirements.txt
fi

# Start the FastAPI server
echo "🚀 Starting FastAPI server on port ${PORT:-8000}..."
exec python -m uvicorn main:app --host 0.0.0.0 --port ${PORT:-8000}