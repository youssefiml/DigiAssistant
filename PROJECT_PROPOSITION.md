# DigiAssistant - Project Proposition

**AI-Powered Digital Maturity Diagnostic Platform**

---

## 📋 Project Overview

**DigiAssistant** is a full-stack web application that revolutionizes digital maturity assessments by replacing traditional static questionnaires with an engaging, AI-powered conversational experience. Companies can assess their digital transformation progress through natural dialogue with an AI assistant.

**Live Demo:** [https://digi-assistant-v1.vercel.app](https://digi-assistant-v1.vercel.app)

---

## 🎯 Project Scope

### Primary Objectives
1. **Conversational Assessment**: Transform 72-question diagnostic into natural dialogue
2. **AI-Powered Evaluation**: Real-time scoring and adaptive question generation
3. **Comprehensive Analysis**: 6-dimension digital maturity framework with actionable insights
4. **Professional Reporting**: PDF and JSON export capabilities
5. **Production Deployment**: Cloud-ready application (Railway + Vercel)

### Target Users
- **Small & Medium Businesses (SMBs)**: Self-assessment and strategic planning
- **Consultants**: Client onboarding and proposal generation
- **Enterprises**: Department benchmarking and transformation tracking

### Technical Scope
- **Backend**: FastAPI (Python) with MongoDB database
- **Frontend**: React 18 with modern tooling (Vite)
- **AI Integration**: Google Gemini / OpenAI for conversational intelligence
- **Deployment**: Railway (backend) + Vercel (frontend)
- **Database**: MongoDB Atlas (cloud)

---

## 📱 Application Pages

### 1. **Dashboard Page** (`/dashboard`)
**Purpose**: Company onboarding and diagnostic session initiation

**Key Features**:
- Company information form (name, sector, size)
- Visual overview of 6 diagnostic dimensions
- Quick start button to begin diagnostic
- Responsive design with modern UI

**User Flow**:
1. User enters company information
2. System creates temporary session
3. Redirects to diagnostic page

**Technical Details**:
- Form validation
- API integration for session creation
- LocalStorage for temporary data
- Error handling and loading states

---

### 2. **Diagnostic Page** (`/diagnostic/:sessionId`)
**Purpose**: Interactive conversational interface for digital maturity assessment

**Key Features**:
- **Chat Interface**: Real-time conversation with AI assistant
- **Progress Tracking**: Visual progress bar (0/72 to 72/72 questions)
- **AI Question Generation**: Contextual questions based on conversation history
- **Answer Submission**: Natural language input (no multiple choice)
- **AI Reactions**: Empathetic feedback after each answer
- **Real-time Scoring**: Instant evaluation (0-3 points per criterion)
- **Session Persistence**: Resume diagnostic anytime

**User Experience**:
- Clean chat UI with message bubbles
- Auto-scroll to latest message
- Loading indicators during AI processing
- Error handling with retry options
- Progress percentage display

**Technical Implementation**:
- React state management for conversation flow
- API calls for question generation and answer evaluation
- Real-time progress updates
- Responsive design for mobile/desktop

---

### 3. **Results Page** (`/results/:sessionId`)
**Purpose**: Comprehensive digital maturity analysis and report generation

**Key Features**:

#### **Results Overview**
- **Global Score**: Overall digital maturity percentage (0-100%)
- **Maturity Profile**: 4-tier classification (Débutant, Émergent, Challenger, Leader)
- **Visual Indicators**: Icons and progress bars for quick understanding

#### **Dimension Breakdown**
- **6 Dimensions Analysis**:
  1. Stratégie (Strategy)
  2. Culture & Capital Humain (Culture & Human Capital)
  3. Relation Client (Client Relations)
  4. Processus (Process)
  5. Technologies (Technology)
  6. Sécurité (Security)

- **Individual Dimension Scores**: 0-36 points per dimension with percentage
- **Pillar Analysis**: 24 pillars (4 per dimension) with detailed scores
- **Visual Charts**: Bar charts and radar charts for data visualization

#### **Gap Analysis**
- **Identified Gaps**: Specific areas below target maturity level
- **Priority Levels**: High/Medium/Low priority improvements
- **Gap Descriptions**: Clear explanations of what needs improvement

#### **Recommendations**
- **Actionable Insights**: Specific next steps based on maturity profile
- **Prioritized List**: Ordered by importance and impact
- **Contextual Advice**: Tailored to company's current level

#### **Export Capabilities**
- **PDF Report**: Professional branded report with charts
- **JSON Export**: Complete diagnostic data for analysis/integration
- **Download Options**: One-click download functionality

**Technical Implementation**:
- Data visualization with Recharts
- PDF generation via backend API
- Responsive grid layout
- Export functionality with error handling

---

## ✨ Core Features

### 1. **AI-Powered Conversational Interface**
- **Natural Language Processing**: Understands user intent, not just keywords
- **Context Awareness**: Questions reference previous answers
- **Adaptive Flow**: Each diagnostic is unique to the user
- **French Language**: Optimized for professional French conversation
- **Empathetic Responses**: Human-like feedback and encouragement

**Technical Stack**:
- Google Gemini 2.0 Flash (primary)
- OpenAI GPT (fallback)
- Custom prompt engineering for diagnostic context

---

### 2. **Comprehensive Diagnostic Framework**

**6 Dimensions**:
1. **Stratégie** - Strategic digital awareness and integration
2. **Culture & Capital Humain** - Digital culture and human aspects
3. **Relation Client** - Digital customer relationships
4. **Processus** - Process digitalization
5. **Technologies** - Technology infrastructure
6. **Sécurité** - Cybersecurity practices

**72 Diagnostic Criteria**:
- 12 criteria per dimension
- 4 maturity pillars per dimension (P1-P4)
- 3 criteria per pillar
- Each criterion scored 0-3 points

**Scoring Methodology**:
- Official calculation formula
- Dimension scores: 0-36 points
- Global score: Average of 6 dimensions
- Maturity profile based on percentage ranges

---

### 3. **Real-Time AI Evaluation**
- **Instant Scoring**: AI evaluates answers as user submits
- **Score Justification**: Explains why a score was assigned
- **AI Reactions**: Empathetic feedback acknowledging user input
- **Next Question Generation**: Contextual questions based on conversation
- **Fallback System**: Intelligent fallback if AI services fail

---

### 4. **Professional Reporting**

**PDF Report Features**:
- Company branding
- Executive summary
- Dimension scores with charts
- Gap analysis
- Detailed recommendations
- Visual maturity profile
- Professional formatting

**JSON Export**:
- Complete diagnostic data
- All answers and scores
- Question history
- Session metadata
- Integration-ready format

---

### 5. **Session Management**
- **Temporary Sessions**: Quick start without account creation
- **Session Persistence**: Save progress and resume later
- **Progress Tracking**: Real-time progress updates
- **Session History**: Access previous diagnostics
- **Data Storage**: MongoDB for reliable data persistence

---

### 6. **User Experience Features**
- **Responsive Design**: Mobile, tablet, and desktop optimized
- **Loading States**: Clear feedback during API calls
- **Error Handling**: User-friendly error messages
- **Progress Indicators**: Visual progress tracking throughout
- **Modern UI**: Clean, professional interface
- **Accessibility**: Keyboard navigation and screen reader support

---

### 7. **Technical Features**
- **RESTful API**: Clean API design with FastAPI
- **CORS Configuration**: Secure cross-origin requests
- **Environment Configuration**: Flexible environment variable management
- **Database Seeding**: Automatic initialization of diagnostic criteria
- **Error Logging**: Comprehensive error tracking
- **Security**: API key management and secure connections

---

## 🏗️ Architecture Overview

### Frontend Architecture
```
React Application
├── Pages
│   ├── DashboardPage (Company Onboarding)
│   ├── DiagnosticPage (Conversational Interface)
│   └── ResultsPage (Analysis & Reports)
├── Services
│   └── API Client (Axios)
├── Routing
│   └── React Router
└── State Management
    └── React Hooks + React Query
```

### Backend Architecture
```
FastAPI Application
├── Routes
│   ├── Company Management
│   ├── Session Management
│   └── Results & Reports
├── Services
│   ├── AI Service (Question Generation & Evaluation)
│   ├── Scoring Service (Official Methodology)
│   └── PDF Service (Report Generation)
├── Models
│   └── Pydantic Schemas
└── Database
    └── MongoDB (Companies, Sessions, Criteria, Answers)
```

---

## 🔧 Technical Stack

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Database**: MongoDB (Motor async driver)
- **AI**: Google Gemini API / OpenAI API
- **PDF Generation**: ReportLab
- **Validation**: Pydantic
- **Deployment**: Railway

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **HTTP Client**: Axios
- **Routing**: React Router v7
- **Data Fetching**: React Query (TanStack Query)
- **Charts**: Recharts
- **Icons**: React Icons
- **Deployment**: Vercel

### Database
- **Primary**: MongoDB Atlas
- **Collections**: companies, sessions, criteria, questions, answers, dimensions, pillars

---

## 📊 Data Flow

### Diagnostic Flow
```
1. User enters company info → Dashboard
2. System creates session → Backend API
3. AI generates first question → AI Service
4. User submits answer → Backend API
5. AI evaluates answer → AI Service
6. System calculates score → Scoring Service
7. AI generates next question → AI Service
8. Repeat steps 4-7 (72 times)
9. Calculate final results → Scoring Service
10. Display results → Results Page
11. Generate PDF/JSON → PDF Service
```

---

## 🚀 Deployment

### Production URLs
- **Frontend**: https://digi-assistant-v1.vercel.app
- **Backend**: https://web-production-34558.up.railway.app

### Environment Setup
- Railway: Backend deployment with environment variables
- Vercel: Frontend deployment with automatic builds
- MongoDB Atlas: Cloud database with free tier

---

## 📈 Success Metrics

### Technical Metrics
- ✅ **72 Questions**: Comprehensive assessment completed
- ✅ **Response Time**: < 2s per AI question generation
- ✅ **Uptime**: 99.9% availability
- ✅ **Error Rate**: < 1% API failures

### User Experience Metrics
- ✅ **Engagement**: Conversational interface vs static forms
- ✅ **Completion Rate**: 72-question diagnostic in ~30-45 minutes
- ✅ **User Satisfaction**: Clear, actionable results

---

## 🔐 Security Features

- **Environment Variables**: Secure API key management
- **CORS Configuration**: Restricted cross-origin access
- **SSL/TLS**: HTTPS for all connections
- **Input Validation**: Pydantic models for data validation
- **Error Handling**: No sensitive data in error messages

---

## 📝 Future Enhancements (Optional)

- User authentication and account management
- Multi-language support (English, Arabic)
- Comparative analytics (industry benchmarks)
- Historical tracking (progress over time)
- White-label customization
- API rate limiting and usage analytics

---

## 📞 Project Information

**Project Name**: DigiAssistant  
**Version**: 2.0.0  
**Status**: Production Ready  
**Type**: Full-Stack Web Application  
**Primary Language**: French  
**Target Market**: French-speaking businesses

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Contact**: Available on request

---

*This document outlines the complete scope, pages, and features of the DigiAssistant project. For technical details, refer to the README.md file in the repository.*



