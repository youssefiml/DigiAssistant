# DigiAssistant v2.0 - Setup Instructions

## 🎯 New Features
- **User Authentication** (Signup/Signin with JWT)
- **MongoDB Persistence** (All data saved to database)
- **Company Profiles** (Capture company information)
- **Session Management** (Resume diagnostics, track progress)
- **AI-Powered Questions** (Google Gemini generates contextual questions)
- **Results Dashboard** (Scores, maturity profile, recommendations)

---

## 📋 Prerequisites

### 1. Install MongoDB
**Option A: MongoDB Community Server (Local)**
- Download: https://www.mongodb.com/try/download/community
- Install and start MongoDB service
- Default connection: `mongodb://localhost:27017`

**Option B: MongoDB Atlas (Cloud - Recommended)**
- Create free account: https://www.mongodb.com/cloud/atlas/register
- Create cluster → Get connection string
- Update `.env` with your connection string

### 2. Install Python 3.9+
```powershell
python --version  # Should be 3.9 or higher
```

---

## 🚀 Backend Setup

### Step 1: Navigate to backend folder
```powershell
cd c:\Digi-Assistant\backend
```

### Step 2: Create Python virtual environment
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

### Step 3: Install dependencies
```powershell
pip install -r requirements.txt
```

### Step 4: Configure environment variables
1. Copy `.env.example` to `.env`:
```powershell
copy .env.example .env
```

2. Edit `.env` file and add your keys:
```env
MONGODB_URL=mongodb://localhost:27017
DB_NAME=digiassistant

JWT_SECRET_KEY=your-super-secret-jwt-key-change-me
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

GEMINI_API_KEY=YOUR_ACTUAL_GEMINI_API_KEY_HERE

CORS_ORIGINS=http://localhost:5173
```

**Get Gemini API Key:**
- Go to: https://makersuite.google.com/app/apikey
- Click "Create API Key"
- Copy key (starts with `AIza...`)
- Paste in `.env` file

### Step 5: Seed the database
```powershell
python seed_database.py
```

You should see:
```
🌱 Starting database seeding...
✓ Inserted 6 dimensions
✓ Inserted 4 pillars  
✓ Inserted 4 criteria
```

⚠️ **IMPORTANT:** The seed script currently has only 4 sample criteria. You need to expand it to include all 72 questions.

### Step 6: Start the backend
```powershell
python main.py
```

Or with uvicorn:
```powershell
uvicorn main:app --reload --port 8000
```

Backend will run on: **http://localhost:8000**

---

## 🎨 Frontend Setup

### Step 1: Navigate to frontend
```powershell
cd c:\Digi-Assistant\frontend
```

### Step 2: Install dependencies
```powershell
npm install
```

### Step 3: Install additional packages for auth & charts
```powershell
npm install axios react-router-dom recharts
```

### Step 4: Start frontend
```powershell
npm run dev
```

Frontend will run on: **http://localhost:5173**

---

## 🧪 Testing the System

### 1. Test Backend API (Optional)
Open: http://localhost:8000/docs

You'll see Swagger UI with all endpoints:
- **POST /auth/signup** - Create account
- **POST /auth/signin** - Login
- **POST /company** - Create company profile
- **POST /sessions** - Start diagnostic
- **POST /sessions/{id}/next** - Get next question
- **POST /sessions/{id}/answers** - Submit answer
- **GET /sessions/{id}/results** - Get results

### 2. Test Full Flow
1. Open browser: http://localhost:5173
2. **Signup** → Create account
3. **Login** → Enter credentials
4. **Dashboard** → Fill company info (name, sector, size)
5. **Start Diagnostic** → Answer questions
6. **Results** → View scores and recommendations

---

## 📁 Project Structure

```
backend/
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
├── seed_database.py        # Database seeding script
├── .env                    # Environment variables
├── config/
│   ├── settings.py         # App configuration
│   └── database.py         # MongoDB connection
├── models/
│   └── schemas.py          # Pydantic models
├── routes/
│   ├── auth.py             # Authentication endpoints
│   ├── company.py          # Company management
│   └── sessions.py         # Diagnostic sessions
├── services/
│   └── ai_service.py       # Gemini AI integration
└── utils/
    └── auth.py             # JWT utilities

frontend/
├── src/
│   ├── App.jsx             # Main application
│   ├── components/
│   │   ├── SignupForm.jsx       # Registration (TO CREATE)
│   │   ├── SigninForm.jsx       # Login (TO CREATE)
│   │   ├── Dashboard.jsx        # Company form (TO CREATE)
│   │   ├── ChatInterface.jsx    # Diagnostic Q&A (EXISTS)
│   │   └── ResultsDashboard.jsx # Results view (EXISTS)
│   └── services/
│       └── api.js          # API client (TO UPDATE)
```

---

## 🔧 Common Issues

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:** Start MongoDB service
```powershell
# Windows
net start MongoDB

# Or check if running
Get-Service MongoDB
```

### JWT Secret Key Error
```
ValidationError: JWT_SECRET_KEY field required
```
**Solution:** Make sure `.env` file exists with `JWT_SECRET_KEY` set

### Gemini API Error
```
400 API key not valid
```
**Solution:** Get valid Gemini API key from https://makersuite.google.com/app/apikey

### CORS Error in Browser
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:** Check `CORS_ORIGINS` in `.env` matches frontend URL (default: http://localhost:5173)

---

## 📝 Next Steps

### Backend (COMPLETED ✅)
- ✅ MongoDB setup & models
- ✅ Authentication (signup/signin)
- ✅ Company profile management
- ✅ Session & question management
- ✅ AI service integration
- ✅ Results calculation

### Frontend (TODO 🔨)
- [ ] Create SignupForm component
- [ ] Create SigninForm component
- [ ] Create AuthContext for JWT
- [ ] Create Dashboard with company form
- [ ] Update ChatInterface for session flow
- [ ] Update API client for new endpoints
- [ ] Add charts to ResultsDashboard

### Database (TODO 📋)
- [ ] Expand seed script to include all 72 criteria
- [ ] Add all pillars for each dimension
- [ ] Test complete question flow

---

## 🆘 Need Help?

Check the backend logs for errors:
```powershell
# Backend runs in terminal - watch for errors
# Frontend runs in separate terminal
```

Test API endpoints manually:
1. Go to http://localhost:8000/docs
2. Test /auth/signup with sample data
3. Copy the `access_token` from response
4. Click "Authorize" button (top right)
5. Paste token in format: `Bearer YOUR_TOKEN_HERE`
6. Test other protected endpoints

---

## 🎯 Ready to Code!

The backend is **COMPLETE** and ready to use. Next step is building the frontend authentication and dashboard components.

Run these commands to start:

```powershell
# Terminal 1: Backend
cd c:\Digi-Assistant\backend
.\venv\Scripts\Activate.ps1
python main.py

# Terminal 2: Frontend  
cd c:\Digi-Assistant\frontend
npm run dev
```

Then open http://localhost:5173 and start building! 🚀
