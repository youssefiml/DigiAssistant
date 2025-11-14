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
Three criteria per pillar
Twelve per dimension
Seventy two in total
Each scored from zero to three

How the AI Works
User starts the diagnostic
AI generates the first question
User responds in natural language
AI evaluates the answer, assigns a score, reacts, and asks the next question
Process repeats for seventy two questions
System generates results and recommendations

AI Capabilities
Natural language understanding
Context awareness
Intelligent scoring
Human style reactions
Optimized for French

Scoring Methodology
Criterion Score: zero to three
Pillar Score: sum of three criteria
Dimension Score: sum of four pillars
Dimension Percentage = Score divided by thirty six multiplied by one hundred
Global Score = Average of six dimensions
Global Percentage = Global Score divided by three multiplied by one hundred
Maturity Profile assigned based on percentage

Maturity Profiles
Débutant: zero to twenty five percent
Émergent: twenty six to fifty percent
Challenger: fifty one to seventy five percent
Leader: seventy six to one hundred percent

Gap Analysis
A gap appears when a dimension scores below the expected level for the global profile.

Quick Start Guide
Prerequisites
Python
Node.js
MongoDB
Gemini API key

Installation
Clone the repository
Set up backend with a virtual environment
Install dependencies
Create environment file
Seed the database
Start the backend
Set up frontend
Install dependencies
Start the frontend
Open localhost port 5173

Key Features
Conversational diagnostic
Real time scoring
Detailed results
PDF and JSON exports
Enterprise level reliability

Project Structure
Backend contains config, models, routes, services, and main application.
Frontend contains pages, services, main app, and dependencies.

API Endpoints
Create company: POST companies
Start session: POST sessions temp
Get next question: POST sessions session_id next
Submit answer: POST sessions session_id answers
Get results: GET sessions session_id results
Download PDF: GET sessions session_id download pdf
Export JSON: GET sessions session_id export json

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
Measurement of ROI

Security and Configuration
Environment variables include MongoDB URL, API keys, AI provider, CORS settings, and JWT secret.
Never commit environment files.
Use secure keys.
Deploy with HTTPS.

Example Results
Company: TechStart SARL
Global Score: 1.8 out of 3
Profile: Challenger
Strengths: Technology and Strategy
Gaps: Security and Process
Recommended actions: strengthen cybersecurity, formalize processes, train teams

Deployment
Backend
Set environment variables
Install dependencies
Seed database
Run with Uvicorn

Frontend
Update API URL
Build
Deploy dist folder

Database
Use MongoDB Atlas
Update connection URL

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

Performance and Scalability
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

Support and Contact
Project: DigiAssistant
Version: 2.0.0
Status: Production Ready
License: Proprietary
GitHub: youssefiml DigiAssistant
Demo available on request

Success Metrics
Seventy two questions across six dimensions
AI driven interactions
Instant scoring
Actionable insights
Professional reports
Scalable architecture