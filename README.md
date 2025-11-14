DigiAssistant - AI Powered Digital Maturity Diagnostic

Project Overview

DigiAssistant is an AI platform for digital maturity assessments. It replaces long forms with a conversational diagnostic that evaluates a company across six dimensions.

The Problem We Solve

Traditional diagnostics are:

Long questionnaires

Boring for users

Generic

Hard to convert into actions


Our Solution

DigiAssistant offers:

Conversational AI interface

Adaptive questions

Real time evaluation

Actionable results

Professional reports


Technical Architecture

Backend

Python with FastAPI

MongoDB

Google Gemini AI or OpenAI

ReportLab for PDF generation


Frontend

React

Vite

Axios

Recharts


System Architecture

Frontend handles the dashboard, conversation module, and results.
Backend handles routes, AI services, scoring, PDF generation, and MongoDB data.

Diagnostic Framework

Six Dimensions

Stratégie

Culture and Human Capital

Client Relationship

Processus

Technologies

Security


Four Pillars

P1 Foundation

P2 Experimentation

P3 Integration

P4 Excellence


Total Criteria

3 criteria per pillar

12 per dimension

72 in total

Each scored 0-3


How the AI Works

1. User starts the diagnostic


2. AI generates the first question


3. User responds in natural language


4. AI evaluates the answer, assigns a score, reacts, and asks the next question


5. Repeat for 72 questions


6. System generates results and recommendations



AI Capabilities

Natural language understanding

Context awareness

Intelligent scoring

Human-like reactions

Optimized for French


Scoring Methodology

Criterion Score: 0-3

Pillar Score: sum of 3 criteria

Dimension Score: sum of 4 pillars

Dimension Percentage = (Score / 36) × 100

Global Score = Average of 6 dimensions

Global Percentage = (Global Score / 3) × 100

Maturity Profile assigned based on percentage


Maturity Profiles

Débutant: 0-25%

Émergent: 26-50%

Challenger: 51-75%

Leader: 76-100%


Gap Analysis

A gap appears when a dimension scores below the expected level for the global profile.

Quick Start Guide

Prerequisites

Python 3.10+

Node.js 18+

MongoDB

Gemini API key


Installation

1. Clone repository



git clone https://github.com/youssefiml/DigiAssistant.git
cd DigiAssistant

2. Setup backend



cd backend
python -m venv venv
venv\Scripts\activate   # Windows
source venv/bin/activate # Mac/Linux
pip install -r requirements.txt

Create .env file:

MONGODB_URL=mongodb://localhost:27017
DB_NAME=digiassistant
GEMINI_API_KEY=your-api-key-here
AI_PROVIDER=gemini
CORS_ORIGINS=http://localhost:5173

Seed database and start backend:

python seed_database.py
python main.py

3. Setup frontend



cd ../frontend
npm install
npm run dev

Open browser: http://localhost:5173

Key Features

Conversational diagnostic

Real time AI evaluation

Detailed results with maturity profile and gaps

PDF and JSON exports

Enterprise-ready security and scalability


Project Structure

DigiAssistant/
├── backend/
│   ├── config/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── main.py
│   ├── seed_database.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   ├── package.json
│   └── main.jsx
└── .gitignore

API Endpoints

Company Management

POST /companies
Body: { name, sector, size }
Response: { id, name, sector, size }


Diagnostic Session

Start session: POST /sessions/temp

Get next question: POST /sessions/{session_id}/next

Submit answer: POST /sessions/{session_id}/answers


Results & Reports

Get results: GET /sessions/{session_id}/results

Download PDF: GET /sessions/{session_id}/download-pdf

Export JSON: GET /sessions/{session_id}/export-json


Use Cases

For SMBs

Self assessment

Strategic planning

Communication with stakeholders


For Consultants

Client onboarding

Proposal support

Progress tracking


For Enterprises

Benchmarking

Transformation planning

ROI measurement


Security and Configuration

Use environment variables for MongoDB, API keys, AI provider, CORS, and JWT secret

Do not commit .env files

Deploy backend with HTTPS


Example Results

Company: TechStart SARL

Global Score: 1.8/3

Profile: Challenger

Strengths: Technology and Strategy

Gaps: Security and Process

Recommendations: strengthen cybersecurity, formalize processes, train teams


Deployment

Backend

Set environment variables

Install dependencies

Seed database

Run with Uvicorn


Frontend

Update API URL

Build project

Deploy dist folder


Database

Use MongoDB Atlas for production

Update MONGODB_URL


Troubleshooting

Backend

Install missing modules

Check MongoDB connection

Verify API keys


Frontend

Check backend status

Fix CORS settings

Inspect console errors


Database

Seed criteria again if missing

Verify MongoDB connectivity


Performance & Scalability

Fast AI response times

Supports many simultaneous diagnostics

Handles large datasets


Technical Highlights

Conversational AI

Context aware questions

Real time scoring

Adaptive experience

Clean architecture

Typed models

Async performance


Support & Contact

Project: DigiAssistant

Version: 2.0.0

Status: Production Ready

License: Proprietary

GitHub: youssefiml/DigiAssistant

Demo available on request


Success Metrics

72 questions across 6 dimensions

AI-driven interactions

Instant scoring

Actionable insights

Professional reports

Scalable architecture