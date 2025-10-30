# DigiAssistant Startup Script
# Run this script to start AI Agent, Backend, and Frontend servers

Write-Host "🚀 Starting DigiAssistant..." -ForegroundColor Cyan
Write-Host ""

# Start AI Agent (FastAPI) in new terminal
Write-Host "🤖 Starting AI Agent (FastAPI)..." -ForegroundColor Magenta
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Digi-Assistant\ai-agent'; python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"

# Wait a moment
Start-Sleep -Seconds 3

# Start Backend in new terminal
Write-Host "📦 Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Digi-Assistant\backend'; npm run dev"

# Wait a moment
Start-Sleep -Seconds 3

# Start Frontend in new terminal
Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'c:\Digi-Assistant\frontend'; npm run dev"

# Wait for servers to start
Start-Sleep -Seconds 5

Write-Host ""
Write-Host "✅ DigiAssistant is starting up!" -ForegroundColor Green
Write-Host ""
Write-Host "AI Agent:  http://localhost:8000" -ForegroundColor Magenta
Write-Host "Backend:   http://localhost:3002" -ForegroundColor Cyan
Write-Host "Frontend:  http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
Write-Host "The application will open automatically in a few seconds..." -ForegroundColor Yellow
Write-Host "Press Ctrl+C in each terminal window to stop the servers." -ForegroundColor Gray
Write-Host ""

# Wait for servers to fully start
Start-Sleep -Seconds 3

# Open browser
Write-Host "🌐 Opening browser..." -ForegroundColor Cyan
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "✨ DigiAssistant is ready!" -ForegroundColor Green
Write-Host "Have a great diagnostic experience! 🎯" -ForegroundColor Magenta