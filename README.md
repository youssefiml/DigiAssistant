# DigiAssistant - Digital Maturity Diagnostic Platform

## 🎯 Overview

DigiAssistant is an interactive, adaptive digital maturity diagnostic platform designed for small and medium-sized businesses (SMBs). Instead of a traditional static questionnaire, it provides a conversational, engaging experience that adapts to user responses and delivers personalized insights.

## ✨ Key Features

- **Adaptive Conversational Interface**: Questions adapt based on previous responses
- **Real-time Scoring Engine**: Progressive calculation of maturity scores
- **6 Dimension Assessment**: Strategy, Culture & Human, Customer Relations, Process, Technology, Security
- **4 Maturity Levels**: Beginner, Emergent, Challenger, Leader
- **Digital Gap Analysis**: Identifies priority improvement areas
- **PDF Report Generation**: Professional downloadable reports
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## 🏗️ Architecture

### Backend (Node.js + Express)
```
backend/
├── data/
│   └── diagnosticCriteria.js    # 72 diagnostic questions organized by dimension
├── engine/
│   └── AdaptiveEngine.js         # Core adaptive logic and scoring
├── services/
│   └── PDFGenerator.js           # PDF report generation
├── server.js                      # Express server and API endpoints
└── package.json
```

### Frontend (React + Vite)
```
frontend/
├── src/
│   ├── components/
│   │   ├── ConversationalInterface.jsx    # Question presentation
│   │   ├── ConversationalInterface.css
│   │   ├── ResultsDashboard.jsx           # Results display
│   │   └── ResultsDashboard.css
│   ├── services/
│   │   └── api.js                         # API communication
│   ├── App.jsx                            # Main application
│   ├── App.css
│   └── main.jsx
└── package.json
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
- Node.js (v18 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Digi-Assistant
```

2. **Install Backend Dependencies**
```bash
cd backend
npm install
```

3. **Install Frontend Dependencies**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start the Backend Server**
```bash
cd backend
npm run dev
# Server runs on http://localhost:3002
```

2. **Start the Frontend Development Server**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

3. **Access the Application**
Open your browser and navigate to `http://localhost:5173`

## 🔌 API Endpoints

### Start Diagnostic
```
POST /api/diagnostic/start
Body: { userContext?: {} }
Response: { success: true, sessionId: string }
```

### Get Next Question
```
GET /api/diagnostic/:sessionId/question
Response: { success: true, question: {...} }
```

### Submit Response
```
POST /api/diagnostic/:sessionId/response
Body: { questionId: string, selectedScore: number }
Response: { success: true }
```

### Get Results
```
GET /api/diagnostic/:sessionId/results
Response: { 
  success: true, 
  results: {
    globalScore, 
    dimensionScores, 
    maturityProfile, 
    digitalGaps 
  }
}
```

### Get Session Status
```
GET /api/diagnostic/:sessionId/status
Response: { success: true, status: {...} }
```

### Download PDF Report
```
GET /api/diagnostic/:sessionId/pdf
Response: PDF file download
```

## 🧠 Adaptive Engine Logic

### Question Prioritization
1. **Foundation First**: Pillar 1 questions are prioritized
2. **Performance-Based Progression**: Higher pillar questions appear based on performance
3. **Dimension Balancing**: Questions are distributed across dimensions to avoid monotony
4. **Smart Skipping**: Advanced questions are skipped if basics are not met

### Scoring Updates
- Scores are calculated in real-time after each response
- Dimension scores are updated progressively
- Global score and maturity profile are recalculated dynamically

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

### Backend Deployment
1. Set environment variables
2. Build: `npm run build` (if applicable)
3. Start: `npm start`
4. Deploy to: Heroku, AWS, DigitalOcean, etc.

### Frontend Deployment
1. Update API URL in `api.js`
2. Build: `npm run build`
3. Deploy `dist` folder to: Vercel, Netlify, AWS S3, etc.

## 🐛 Troubleshooting

### Backend Issues
- **Port already in use**: Change PORT in server.js
- **Module not found**: Run `npm install`
- **PDF generation fails**: Check Puppeteer installation

### Frontend Issues
- **API connection error**: Verify backend is running
- **Blank page**: Check browser console for errors
- **CSS not loading**: Clear cache and rebuild

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
- **Purpose**: Digital Maturity Diagnostic for SMBs
- **Technology**: Node.js, Express, React, Puppeteer

## 📞 Support

For questions or issues, please contact the development team.

---

**Version**: 1.0.0  
**Last Updated**: October 27, 2025  
**Status**: Production Ready