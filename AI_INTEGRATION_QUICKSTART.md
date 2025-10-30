# 🚀 Quick Start - DigiAssistant with AI Agent

## ✅ What's Been Integrated

Your **FastAPI AI Agent** (with Google Gemini) is now fully integrated with the DigiAssistant backend!

### Architecture
```
Frontend (React) → Backend (Node.js) → AI Agent (FastAPI + Gemini)
   Port 5173         Port 3002            Port 8000
```

## 🔧 Setup Steps

### 1. Verify AI Agent `.env` File
Make sure `c:\Digi-Assistant\ai-agent\.env` contains:
```
GEMINI_API_KEY=your_actual_google_gemini_api_key
```

### 2. Backend `.env` File
Already configured at `c:\Digi-Assistant\backend\.env`:
```
PORT=3002
AI_AGENT_URL=http://localhost:8000
```

### 3. Dependencies
All dependencies are installed:
- ✅ Backend: axios added for HTTP calls to AI Agent
- ✅ AI Agent: FastAPI, uvicorn, google-generativeai
- ✅ Frontend: React, framer-motion, axios

## 🚀 Start the System

### Single Command (Recommended):
```powershell
cd c:\Digi-Assistant
.\start.ps1
```

This automatically starts:
1. 🤖 **AI Agent** on port 8000
2. ⚙️  **Backend** on port 3002  
3. 🎨 **Frontend** on port 5173

### Or Start Manually:

**Terminal 1 - AI Agent:**
```powershell
cd c:\Digi-Assistant\ai-agent
python -m uvicorn main:app --reload --port 8000
```

**Terminal 2 - Backend:**
```powershell
cd c:\Digi-Assistant\backend
npm run dev
```

**Terminal 3 - Frontend:**
```powershell
cd c:\Digi-Assistant\frontend
npm run dev
```

## 🧪 Test the Integration

### 1. Check Services Are Running

**AI Agent:** http://localhost:8000
- Should show: `{"Welcome": "DigiAssistant AI Agent is running!"}`

**Backend:** http://localhost:3002
- Should show API info with available endpoints

**Frontend:** http://localhost:5173
- Should open the chat interface

### 2. Test the Conversational Flow

1. **Start diagnostic** - Frontend calls backend to create session
2. **First question appears** - Backend calls AI Agent's `/formulate_first_question`
3. **Type your answer** - Natural language, e.g., "Nous utilisons Excel et quelques outils basiques"
4. **AI analyzes** - Backend sends to AI Agent's `/process_turn`
5. **See AI reaction** - "Je comprends..." + next question
6. **Check score** - Look for score badge (0-3) with confidence level
7. **Continue conversation** - Answer more questions

### 3. Verify AI Integration

**Look for these in the Backend console:**
```
🚀 Digi-Assistant Backend is running on port 3002
📊 Adaptive Engine initialized
```

**Look for these in AI Agent console:**
```
INFO:     Uvicorn running on http://0.0.0.0:8000
INFO:     Application startup complete
```

**When you submit an answer, check:**
- Backend console: Should show HTTP POST to AI Agent
- AI Agent console: Should show incoming `/process_turn` request
- Frontend: Should display AI reaction and next question

## 🎯 How It Works

### Flow for Each Answer:

1. **User types answer:** "Nous avons un CRM mais pas très bien configuré"

2. **Frontend → Backend:**
```json
POST /api/diagnostic/:sessionId/response
{
  "questionId": "STRAT-P1-C2",
  "userText": "Nous avons un CRM mais pas très bien configuré"
}
```

3. **Backend → AI Agent:**
```json
POST /api/v1/process_turn
{
  "history": [...],
  "user_answer": "Nous avons un CRM...",
  "current_criterion": {...},
  "next_linear_criterion": {...},
  "next_jump_criterion": {...}
}
```

4. **AI Agent (Gemini) analyzes and returns:**
```json
{
  "evaluation": {
    "score": 1,
    "justification": "CRM présent mais configuration basique"
  },
  "ai_reaction": "Je vois, vous avez un CRM mais il n'est pas optimisé.",
  "chosen_next_criterion_id": "STRAT-P1-C3",
  "next_question": "Parlons maintenant de vos indicateurs de performance..."
}
```

5. **Backend → Frontend:**
```json
{
  "success": true,
  "analysis": {...},
  "followUp": "Je vois, vous avez un CRM...\n\nParlons maintenant de...",
  "currentScores": {...}
}
```

6. **Frontend displays:**
- ✅ User message bubble
- ✅ AI reaction message
- ✅ Score badge (1/3 - Basique)
- ✅ Confidence indicator
- ✅ Next question

## 🐛 Troubleshooting

### ❌ Error: "AI Agent Error" in console

**Check:**
1. AI Agent running on port 8000?
   ```powershell
   # Test manually:
   curl http://localhost:8000
   ```

2. GEMINI_API_KEY set in `ai-agent/.env`?
   ```powershell
   cd c:\Digi-Assistant\ai-agent
   cat .env
   ```

3. Backend `.env` has correct AI_AGENT_URL?
   ```powershell
   cd c:\Digi-Assistant\backend
   cat .env
   # Should show: AI_AGENT_URL=http://localhost:8000
   ```

**Solution:** Backend will use fallback scoring (based on text length) if AI unavailable

### ❌ Questions not appearing

**Check:**
1. Backend console for errors
2. Frontend console (F12) for network errors
3. Session initialized correctly

### ❌ Scores always 0 or wrong

**Check:**
1. AI Agent receiving requests (check its console)
2. Gemini API key is valid
3. No rate limiting from Google

## 📊 What Changed

### ❌ Removed:
- `backend/services/AIAnalyzer.js` - Old JavaScript analyzer
- `backend/test-ai-analyzer.js` - Old test file

### ✅ Added:
- `axios` dependency in backend
- HTTP calls to FastAPI AI Agent
- Conversation history tracking
- First question special handling
- Fallback scoring mechanism

### ✅ Updated:
- `backend/engine/AdaptiveEngine.js` - Now calls FastAPI
- `backend/server.js` - Made response handler async
- `backend/.env` - Added AI_AGENT_URL
- `start.ps1` - Now starts AI Agent first

## 🎉 Success Indicators

You'll know it's working when:

1. ✅ Three terminal windows open (AI Agent, Backend, Frontend)
2. ✅ Browser opens to http://localhost:5173
3. ✅ Chat interface loads with welcome message
4. ✅ First question appears naturally formulated
5. ✅ When you type an answer, you see:
   - Loading indicator
   - AI reaction message
   - Score badge (0-3)
   - Confidence percentage
   - Next question naturally formulated
6. ✅ Progress bar updates
7. ✅ After 72 questions, results dashboard appears

## 📚 Next Steps

### Test Different Scenarios:

1. **Short answers:** "non" → Should score 0
2. **Basic answers:** "oui, on utilise Excel" → Should score 1
3. **Intermediate answers:** "Nous avons mis en place un CRM avec quelques automatisations" → Should score 2
4. **Advanced answers:** "Nous avons un CRM intégré avec notre ERP, avec des tableaux de bord et des KPIs mesurés quotidiennement" → Should score 3

### Check Adaptive Logic:

1. Answer first 3 questions of a dimension with low scores (0-1)
2. AI should skip advanced questions (Pillar 2-4)
3. Jump to next dimension's Pillar 1
4. Check Backend console for "chosen_next_criterion_id"

### View Complete Results:

1. Complete diagnostic (or answer enough questions)
2. Results dashboard shows:
   - Maturity profile (Beginner/Emergent/Challenger/Leader)
   - Global score (0-100%)
   - Dimension scores
   - Digital gaps
3. Download PDF report

## 🔗 Resources

- **Full Integration Guide:** `INTEGRATION_GUIDE.md`
- **Project Summary:** `PROJECT_SUMMARY.md`
- **Setup Instructions:** `SETUP.md`
- **Main README:** `README.md`

## ⚡ Quick Commands

```powershell
# Start everything
.\start.ps1

# Test AI Agent only
cd ai-agent
python -m uvicorn main:app --reload --port 8000

# Test Backend only
cd backend
npm run dev

# Test Frontend only
cd frontend
npm run dev

# Check AI Agent health
curl http://localhost:8000

# Check Backend health
curl http://localhost:3002/api/health
```

---

**🎊 Your AI-powered DigiAssistant is ready!**

Just run `.\start.ps1` and start chatting with the AI diagnostic assistant! 🚀
