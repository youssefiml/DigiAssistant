# DigiAssistant - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Install Dependencies

**Backend:**
```powershell
cd c:\Digi-Assistant\backend
npm install
```

**Frontend:**
```powershell
cd c:\Digi-Assistant\frontend
npm install
```

### Step 2: Start the Servers

**Terminal 1 - Backend:**
```powershell
cd c:\Digi-Assistant\backend
npm run dev
```
✅ Backend should be running on http://localhost:3002

**Terminal 2 - Frontend:**
```powershell
cd c:\Digi-Assistant\frontend
npm run dev
```
✅ Frontend should be running on http://localhost:5173

### Step 3: Test the Application

1. Open your browser to http://localhost:5173
2. The diagnostic should start automatically
3. Answer questions and see the adaptive flow
4. Complete the diagnostic to see results
5. Download the PDF report

## 📋 Verification Checklist

- [ ] Backend server starts without errors
- [ ] Frontend dev server starts without errors
- [ ] Browser opens to the diagnostic interface
- [ ] Questions load and display correctly
- [ ] Can select answers and submit
- [ ] Progress bar updates
- [ ] Results page displays after completion
- [ ] PDF download works

## 🔍 Testing the Adaptive Engine

### Test Scenario 1: Complete Diagnostic
1. Start the diagnostic
2. Answer all 72 questions (6 dimensions × 4 pillars × 3 criteria)
3. Verify final results show correct profile

### Test Scenario 2: Low Maturity
1. Answer all questions with score 0
2. Expected: Beginner profile (0-25%)
3. Verify all dimensions show low scores

### Test Scenario 3: High Maturity
1. Answer all questions with score 3
2. Expected: Leader profile (76-100%)
3. Verify no digital gaps appear

### Test Scenario 4: Mixed Performance
1. Answer Strategy questions with high scores (2-3)
2. Answer Security questions with low scores (0-1)
3. Expected: Gap analysis highlights Security

## 🎯 Key Features to Test

### 1. Adaptive Question Flow
- Questions should appear one at a time
- Progress should update after each answer
- Different dimensions should be balanced

### 2. Real-time Scoring
- Scores update progressively
- Global score is the average of all dimensions
- Maturity profile changes based on score

### 3. Results Dashboard
- Profile icon and name match the score
- Dimension scores displayed with visual bars
- Digital gaps show dimensions below target
- Recommendations are personalized

### 4. PDF Generation
- Click "Télécharger le Rapport PDF"
- PDF should download automatically
- Check PDF contains all sections:
  - Executive summary
  - Dimension scores
  - Gap analysis
  - Recommendations

## 🛠️ Common Issues & Solutions

### Issue: "Port 3002 already in use"
**Solution:**
```powershell
# Find and kill the process using port 3002
netstat -ano | findstr :3002
taskkill /PID <PID> /F

# Or change the port in backend/server.js
const PORT = process.env.PORT || 3003;
```

### Issue: "Module not found"
**Solution:**
```powershell
# Delete node_modules and package-lock.json
rm -r node_modules
rm package-lock.json

# Reinstall
npm install
```

### Issue: "Cannot connect to backend"
**Solution:**
1. Verify backend is running on port 3002
2. Check `frontend/src/services/api.js` has correct URL
3. Check CORS is enabled in backend

### Issue: "PDF generation fails"
**Solution:**
```powershell
# Reinstall Puppeteer
npm uninstall puppeteer
npm install puppeteer
```

### Issue: Frontend shows blank page
**Solution:**
1. Open browser console (F12)
2. Check for JavaScript errors
3. Verify all files compiled correctly
4. Try hard refresh (Ctrl+F5)

## 📊 Expected Results

### Diagnostic Flow
- Total questions: 72
- Grouped by: 6 dimensions
- Each dimension: 4 pillars × 3 criteria
- Each question: 4 options (scored 0-3)

### Scoring
- Dimension max: 36 points → 100%
- Global score: Average of 6 dimensions
- Maturity profiles:
  - 0-25%: Débutant 🌱
  - 26-50%: Émergent 🚀
  - 51-75%: Challenger ⚡
  - 76-100%: Leader 👑

### Results
- Profile badge with icon
- 6 dimension scores with bars
- Gap analysis (if any)
- Summary statistics
- Personalized recommendations

## 🎨 User Experience Flow

1. **Landing** → Diagnostic starts automatically
2. **Question 1** → First Pillar 1 question (balanced dimension)
3. **Progress** → Updates after each answer
4. **Question 2-72** → Adaptive order based on responses
5. **Completion** → Automatic transition to results
6. **Results** → Profile, scores, gaps, recommendations
7. **PDF Download** → Professional report

## 📝 API Testing with Postman/curl

### Start Session
```bash
curl -X POST http://localhost:3002/api/diagnostic/start \
  -H "Content-Type: application/json" \
  -d '{"userContext":{}}'
```

### Get Question
```bash
curl http://localhost:3002/api/diagnostic/{sessionId}/question
```

### Submit Answer
```bash
curl -X POST http://localhost:3002/api/diagnostic/{sessionId}/response \
  -H "Content-Type: application/json" \
  -d '{"questionId":"STRAT-P1-C1","selectedScore":2}'
```

### Get Results
```bash
curl http://localhost:3002/api/diagnostic/{sessionId}/results
```

## 🔄 Development Workflow

### Making Changes

**Backend:**
1. Edit files in `backend/`
2. Server auto-restarts (nodemon)
3. Test API endpoints

**Frontend:**
1. Edit files in `frontend/src/`
2. Vite auto-reloads
3. Changes appear in browser

**Data:**
1. Edit `backend/data/diagnosticCriteria.js`
2. Restart backend server
3. New questions/criteria available

## 🌐 Production Deployment

### Backend
1. Set `NODE_ENV=production`
2. Configure production database (if needed)
3. Update CORS for production domain
4. Deploy to hosting service

### Frontend
1. Update API URL in `api.js`
2. Run `npm run build`
3. Deploy `dist/` folder
4. Configure redirects for SPA

## 📈 Next Steps

### Enhancements
- [ ] Add user authentication
- [ ] Store results in database
- [ ] Add comparison with industry benchmarks
- [ ] Multi-language support
- [ ] Email report delivery
- [ ] Progress save/resume

### Analytics
- [ ] Track question completion rates
- [ ] Monitor average scores by dimension
- [ ] Analyze drop-off points
- [ ] Generate aggregated insights

## 💡 Tips for Best Experience

1. **Complete in One Session**: 72 questions take ~15-20 minutes
2. **Be Honest**: Accurate responses lead to better insights
3. **Read Carefully**: Each option represents a different maturity level
4. **Use Context**: Consider your actual practices, not aspirations
5. **Review Results**: Take time to understand your profile and gaps

## 🎓 Understanding Your Results

### Score Interpretation
- **0-25%**: Starting your digital journey
- **26-50%**: Making progress with experimentation
- **51-75%**: Strong digital practices in place
- **76-100%**: Digital excellence and innovation

### Digital Gaps
- Represents dimensions below your profile's target
- Prioritized by largest gaps
- Focus areas for improvement

### Recommendations
- Tailored to your maturity level
- Specific to identified gaps
- Actionable next steps

---

**Need Help?** Check the main README.md for detailed documentation.

**Ready to Start?** Run the servers and navigate to http://localhost:5173! 🚀