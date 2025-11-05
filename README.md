# DigiAssistant - AI-Powered Digital Maturity Diagnostic Platform

## 🎯 Overview

DigiAssistant is an innovative prototype that transforms traditional, static form-based digital maturity assessments into a dynamic, conversational, and adaptive experience. Powered by AI (Google Gemini/OpenAI), users engage in natural language conversations rather than filling out forms. The system calculates scores in real-time and delivers a clear, actionable report with maturity profile, scores, and identified priorities.

## ✨ Key Features

- **🤖 AI-Powered Conversational Interface**: Natural language questions that adapt based on conversation history
- **📊 Real-time Scoring Engine**: Official methodology with pillar-level granularity
- **🎯 6 Dimension Assessment**: Strategy, Culture & Human, Customer Relations, Process, Technology, Security
- **📈 4 Maturity Levels**: Beginner (0-25%), Emergent (26-50%), Challenger (51-75%), Leader (76-100%)
- **🔍 Intelligent Gap Analysis**: Identifies dimensions below target for your maturity profile
- **📄 Professional PDF Reports**: Comprehensive reports with advantages, disadvantages, and recommendations
- **💾 JSON Export**: Complete diagnostic data export for further analysis
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## 🏗️ Architecture

### Backend (Python + FastAPI + MongoDB)
```
backend/
├── config/
│   ├── database.py              # MongoDB connection
│   └── settings.py              # Environment configuration
├── models/
│   └── schemas.py               # Pydantic data models
├── routes/
│   ├── company.py               # Company management
│   └── sessions.py              # Diagnostic sessions & results
├── services/
│   ├── ai_service.py            # AI question generation & evaluation
│   ├── scoring_service.py       # Official scoring methodology
│   └── pdf_service.py           # PDF report generation
├── main.py                      # FastAPI application
├── seed_database.py             # Database initialization
└── requirements.txt             # Python dependencies
```

### Frontend (React + Vite)
```
frontend/
├── src/
│   ├── pages/
│   │   ├── DashboardPage.jsx    # Company creation & session start
│   │   ├── DiagnosticPage.jsx   # Conversational diagnostic interface
│   │   └── ResultsPage.jsx      # Results display & reports
│   ├── services/
│   │   └── api.js               # API communication
│   ├── App.jsx                  # Main application & routing
│   └── main.jsx                 # Application entry point
└── package.json                 # Frontend dependencies
```

## 📊 Diagnostic Structure

### Dimensions (6)
1. **Stratégie** (STRAT) - Strategic digital awareness and integration
2. **Culture & Humain** (CULT) - Digital culture and human aspects
3. **Relation Client** (REL) - Digital customer relationships
4. **Processus** (PROC) - Process digitalization
5. **Technologie** (TECH) - Technology infrastructure
6. **Sécurité** (SEC) - Cybersecurity practices

### Pillars (4 per dimension)
- Pillar 1: Foundation (Basic awareness and first steps)
- Pillar 2: Experimentation (Testing and resource allocation)
- Pillar 3: Integration (Regular use and optimization)
- Pillar 4: Excellence (Innovation and continuous improvement)

### Criteria (3 per pillar = 72 total questions)
Each criterion has 4 response options scored 0-3.

## 🔄 Scoring Logic

### Dimension Score
- Maximum points per dimension: 36 (4 pillars × 3 criteria × 3 max points)
- Formula: `(Total Points / 36) × 100 = Percentage`

### Global Score
- Average of all 6 dimension scores
- Formula: `(Sum of Dimension Scores) / 6`

### Maturity Profile Assignment
| Score Range | Profile |
|------------|---------|
| 0-25% | Débutant (Beginner) 🌱 |
| 26-50% | Émergent (Emergent) 🚀 |
| 51-75% | Challenger ⚡ |
| 76-100% | Leader 👑 |

### Digital Gaps
Dimensions where the score is below the target minimum for the assigned maturity profile.

## 🚀 Getting Started

### Prerequisites
- **Python 3.10+** (for backend)
- **Node.js 18+** (for frontend)
- **MongoDB** (local or cloud instance)
- **Google Gemini API Key** or **OpenAI API Key** (for AI features)

### Installation

#### 1. Clone the repository
```bash
git clone <repository-url>
cd Digi-Assistant
```

#### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
copy .env.example .env  # Windows
# or
cp .env.example .env    # Mac/Linux
```

#### 3. Configure Environment Variables

Edit `backend/.env`:
```env
# MongoDB
MONGODB_URL=mongodb://localhost:27017
DB_NAME=digiassistant

# JWT
JWT_SECRET_KEY=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# AI Provider (choose one or both)
GEMINI_API_KEY=your-gemini-api-key-here
OPENAI_API_KEY=your-openai-api-key-here
AI_PROVIDER=gemini  # Options: "openai", "gemini", "fallback"

# CORS
CORS_ORIGINS=http://localhost:5173
```

**Getting an API Key:**
- **Google Gemini**: Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- **OpenAI**: Visit [OpenAI Platform](https://platform.openai.com/api-keys)

#### 4. Initialize Database

```bash
# Make sure MongoDB is running
# Then seed the database with diagnostic criteria
python seed_database.py
```

#### 5. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file (if needed)
echo "VITE_API_URL=http://localhost:8000" > .env
```

### Running the Application

#### Terminal 1: Start MongoDB (if local)
```bash
mongod
```

#### Terminal 2: Start Backend
```bash
cd backend
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # Mac/Linux

python main.py
# Backend runs on http://localhost:8000
```

#### Terminal 3: Start Frontend
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

#### Access the Application
Open your browser and navigate to `http://localhost:5173`

## 🔌 API Endpoints

### Company Management
```http
POST /companies
Body: { name: string, sector: string, size: string }
Response: { id: string, name: string, ... }
```

### Session Management
```http
# Create session (temp - no company saved)
POST /sessions/temp
Body: { name: string, sector: string, size: string }
Response: { session_id: string, message: string }

# Create session (with saved company)
POST /sessions
Body: { company_id: string }
Response: { session_id: string, message: string }

# Get first/next question
POST /sessions/{session_id}/next
Response: { 
  question_id: string,
  question_text: string,
  criterion_id: string,
  dimension: string,
  pillar: string,
  progress: number,
  total: number
}

# Submit answer
POST /sessions/{session_id}/answers
Body: { user_text: string }
Response: {
  ai_reaction: string,
  score: number,
  explanation: string,
  next_question: { ... },
  progress: number,
  total: number
}
```

### Results & Reports
```http
# Get complete results
GET /sessions/{session_id}/results
Response: {
  session_id: string,
  company_name: string,
  global_score: float,
  maturity_profile: {
    level: string,
    percentage: float,
    description: string
  },
  dimension_scores: [...],
  gaps: [...],
  recommendations: [...]
}

# Download PDF report
GET /sessions/{session_id}/download-pdf
Response: PDF file (application/pdf)

# Export JSON
GET /sessions/{session_id}/export-json
Response: Complete diagnostic data in JSON format
```

## 🧠 AI-Powered Conversational Logic

### How It Works

1. **Natural Language Questions**: AI generates contextual questions based on criterion text
2. **Conversational Evaluation**: AI analyzes user's text answer and assigns score (0-3)
3. **Empathetic Reactions**: AI provides human-like feedback acknowledging the answer
4. **Adaptive Next Questions**: AI formulates next question referencing conversation history

### Key Advantages Over Traditional Forms

- **No Multiple Choice**: Users explain in their own words
- **Context-Aware**: Questions reference previous answers
- **Engaging**: Feels like a conversation, not a form
- **Intelligent**: AI understands nuance and intent

### Scoring Methodology

For complete details on scoring, profiling, and gap analysis, see **[BUSINESS_RULES.md](BUSINESS_RULES.md)**

**Quick Summary:**
- **Pillar Score**: Sum of 3 criteria (max 9 pts)
- **Dimension Score**: Sum of 4 pillars (max 36 pts) → percentage
- **Global Score**: Average of 6 dimensions → maturity profile
- **Gap Analysis**: Dimensions below target for your profile

## 📄 PDF Report Features

- **Executive Summary**: Profile, global score, key metrics
- **Dimension Analysis**: Detailed scores with visual bars
- **Gap Analysis**: Priority improvement areas
- **Recommendations**: Personalized based on maturity level
- **Professional Layout**: Print-ready format

## 🎨 User Experience

### Conversational Interface
- One question at a time
- Clear visual hierarchy
- Color-coded response options (0=red, 3=green)
- Progress indicator
- Smooth animations and transitions

### Results Dashboard
- Prominent maturity profile display
- Visual dimension scores
- Priority gap highlighting
- Actionable recommendations
- Download and restart options

## 🔧 Configuration

### Backend Configuration
Edit `backend/server.js` to change:
- Port number (default: 3002)
- CORS settings
- Session management

### Frontend Configuration
Edit `frontend/src/services/api.js` to change:
- API base URL (default: http://localhost:3002/api)

## 🧪 Testing

### Manual Testing Scenarios
1. **Complete Diagnostic**: Answer all 72 questions
2. **Partial Completion**: Test progress tracking
3. **Low Scores**: Verify Beginner profile assignment
4. **High Scores**: Verify Leader profile assignment
5. **Mixed Scores**: Verify gap analysis
6. **PDF Generation**: Test report download

### Example Test Cases

**Test Case 1: Beginner Profile**
- Answer all questions with score 0
- Expected: Global score ~0%, Beginner profile

**Test Case 2: Leader Profile**
- Answer all questions with score 3
- Expected: Global score 100%, Leader profile

**Test Case 3: Gap Analysis**
- Answer Strategy questions with high scores (2-3)
- Answer Security questions with low scores (0-1)
- Expected: Security appears in digital gaps

## 📦 Deployment

### Backend Deployment (Python/FastAPI)
1. Set environment variables (MongoDB URL, API keys, etc.)
2. Install dependencies: `pip install -r requirements.txt`
3. Seed database: `python seed_database.py`
4. Start: `uvicorn main:app --host 0.0.0.0 --port 8000`
5. Deploy to: **Heroku**, **AWS EC2**, **DigitalOcean**, **Railway**, etc.

### Frontend Deployment (React/Vite)
1. Update API URL in `frontend/.env`: `VITE_API_URL=https://your-backend-url.com`
2. Build: `npm run build`
3. Deploy `dist` folder to: **Vercel**, **Netlify**, **AWS S3**, **GitHub Pages**, etc.

### MongoDB Deployment
- **Local**: Run `mongod` on your server
- **Cloud**: Use **MongoDB Atlas** (free tier available)

## 🐛 Troubleshooting

### Backend Issues
- **Port already in use**: Change port in `main.py` or use `--port` flag
- **Module not found**: Activate venv and run `pip install -r requirements.txt`
- **MongoDB connection error**: Check `MONGODB_URL` in `.env` and ensure MongoDB is running
- **AI not working**: Verify `GEMINI_API_KEY` or `OPENAI_API_KEY` in `.env`
- **PDF generation fails**: Check `reportlab` installation: `pip install reportlab`

### Frontend Issues
- **API connection error**: Verify backend is running and `VITE_API_URL` is correct
- **Blank page**: Check browser console for errors
- **CORS error**: Add frontend URL to `CORS_ORIGINS` in backend `.env`

### Database Issues
- **Criteria not found**: Run `python seed_database.py` to initialize data
- **Session not found**: Check MongoDB connection and collection names

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is proprietary. All rights reserved.

## 👥 Credits

- **Project**: DigiAssistant
- **Purpose**: AI-Powered Digital Maturity Diagnostic for SMBs
- **Technology**: Python, FastAPI, MongoDB, React, Google Gemini/OpenAI, ReportLab

## 📚 Additional Documentation

- **[BUSINESS_RULES.md](BUSINESS_RULES.md)** - Complete scoring methodology and business logic
- **[GEMINI_SETUP.md](backend/GEMINI_SETUP.md)** - Google Gemini API setup guide
- **[AI_INTEGRATION_QUICKSTART.md](AI_INTEGRATION_QUICKSTART.md)** - AI integration guide

## 📞 Support

For questions or issues, please contact the development team.

---

**Version**: 2.0.0  
**Last Updated**: November 5, 2024  
**Status**: Production Ready with AI Integration