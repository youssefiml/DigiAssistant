<div align="center">

# DigiAssistant  
**AI-Powered Digital Maturity Diagnostic**

[Website](https://github.com/youssefiml/DigiAssistant) · [Issues](https://github.com/youssefiml/DigiAssistant/issues) · Demo on request

</div>

## Table of Contents
1. [Overview](#overview)  
2. [Key Features](#key-features)  
3. [Architecture](#architecture)  
4. [Diagnostic Framework](#diagnostic-framework)  
5. [Scoring & Profiles](#scoring--profiles)  
6. [API Surface](#api-surface)  
7. [Getting Started](#getting-started)  
8. [Usage Flow](#usage-flow)  
9. [Deployment](#deployment)  
10. [Troubleshooting](#troubleshooting)  
11. [Roadmap & Success Metrics](#roadmap--success-metrics)  
12. [Support](#support)

## Overview
DigiAssistant is a conversational AI platform that replaces static digital maturity questionnaires with dynamic interviews. The system evaluates an organization across six dimensions, produces real-time scores, and delivers curated recommendations, reports, and exports.

## Key Features
- Conversational diagnostic powered by Gemini or OpenAI
- Adaptive question tree covering 72 criteria and six dimensions
- Real-time scoring and maturity profile detection
- AI-generated insights, gap analysis, PDF, and JSON exports
- Secure, enterprise-ready architecture with MongoDB persistence

## Architecture
| Layer | Technologies | Responsibilities |
| ----- | ------------ | ---------------- |
| Frontend | React, Vite, Axios, Recharts | Dashboard, conversation UI, reporting, visualizations |
| Backend | FastAPI, Python, MongoDB, ReportLab | AI orchestration, scoring engine, PDF generation, API layer |
| AI | Gemini API, optional OpenAI | Question generation, context tracking, scoring automation |

```
Frontend (React/Vite) → REST API (FastAPI) → Services (AI, scoring, PDF) → MongoDB
```

## Diagnostic Framework
**Six Dimensions**
- Stratégie  
- Culture & Human Capital  
- Client Relationship  
- Processus  
- Technologies  
- Security  

**Four Pillars per Dimension**
1. Foundation  
2. Experimentation  
3. Integration  
4. Excellence  

Each pillar contains 3 criteria → 12 criteria per dimension → 72 total, all rated 0–3.

## Scoring & Profiles
- Criterion score: `0–3`  
- Pillar score: sum of its 3 criteria  
- Dimension score: sum of 4 pillars (`0–36`)  
- Dimension percentage: `(score / 36) × 100`  
- Global score: average of all dimension scores  
- Global percentage: `(global score / 3) × 100`

**Profiles**
- Débutant: 0–25%  
- Émergent: 26–50%  
- Challenger: 51–75%  
- Leader: 76–100%

Gap analysis flags any dimension that falls below the expected threshold for the global profile.

## API Surface
| Area | Method & Route | Description |
| ---- | -------------- | ----------- |
| Company | `POST /companies` | Create a company (`name`, `sector`, `size`) |
| Session | `POST /sessions/temp` | Start a new temporary diagnostic session |
| Session | `POST /sessions/{id}/next` | Get the next AI-generated question |
| Session | `POST /sessions/{id}/answers` | Submit an answer (free text) |
| Results | `GET /sessions/{id}/results` | Retrieve structured scoring results |
| Reports | `GET /sessions/{id}/download-pdf` | Download a branded PDF |
| Reports | `GET /sessions/{id}/export-json` | Export the full diagnostic data |

## Getting Started
### Prerequisites
- Python 3.10+  
- Node.js 18+  
- MongoDB (local or Atlas)  
- Gemini (or OpenAI) API key  

### 1. Clone the project
```bash
git clone https://github.com/youssefiml/DigiAssistant.git
cd DigiAssistant
```

### 2. Backend setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # macOS / Linux
pip install -r requirements.txt
```

Create `backend/.env`:
```bash
MONGODB_URL=mongodb://localhost:27017
DB_NAME=digiassistant
GEMINI_API_KEY=<your-api-key>
AI_PROVIDER=gemini
CORS_ORIGINS=http://localhost:5173
```

Seed and run:
```bash
python seed_database.py
python main.py      # or: uvicorn main:app --reload
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. Configure the frontend `API_URL` if the backend runs on a custom host/port.

## Usage Flow
1. Start a session for a company (or create a temporary one).  
2. The AI poses the first question; the user replies in natural language.  
3. The backend interprets context, scores the answer, and generates the next question.  
4. After all 72 criteria are captured, DigiAssistant calculates pillar, dimension, and global scores.  
5. Users can download PDF/JSON exports, view dashboards, or share insights with stakeholders.

## Deployment
### Backend
- Configure environment variables securely (`MONGODB_URL`, API keys, JWT secrets)  
- Run `pip install -r requirements.txt` on the server  
- Seed the database if needed, then launch with `uvicorn main:app --host 0.0.0.0 --port 8000`  
- Use HTTPS (reverse proxy or managed hosting) and production-grade logging

### Frontend
- Set API base URL in environment (e.g., `VITE_API_URL`)  
- Build with `npm run build`  
- Serve `frontend/dist` via CDN, static host, or behind the backend proxy

### Database
- Use MongoDB Atlas (preferred)  
- Configure backups and network access rules  
- Rotate credentials regularly

## Troubleshooting
- **Backend:** missing modules (`pip install`), MongoDB not reachable, invalid API key  
- **Frontend:** CORS errors, outdated API URL, console/network errors  
- **Database:** reseed criteria (`python seed_database.py`), verify Mongo connection string  

## Roadmap & Success Metrics
- [ ] Conversational UI improvements (feedback and tone tuning)  
- [ ] Multi-language support beyond French  
- [ ] Configurable diagnostic templates per industry  
- [ ] Advanced analytics dashboard (trend lines, benchmarking)

**Success metrics**
- 72 adaptive questions completed per session  
- AI-driven guidance with instant scoring  
- Actionable recommendations & professional PDFs  
- Elastic infrastructure for simultaneous diagnostics

## Support
- Project: **DigiAssistant v2.0.0**  
- Status: **Production ready**  
- License: Proprietary  
- Contact: open an issue or reach out via the GitHub repository  
- Demo: available on request

