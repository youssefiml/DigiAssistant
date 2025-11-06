# Railway Healthcheck Failed - Troubleshooting

## Problem
Build succeeded but healthcheck is failing - the app isn't responding on `/health` endpoint.

## Possible Causes

### 1. Missing Environment Variables
The app might be crashing on startup if required env vars are missing.

**Check in Railway Dashboard:**
- Go to your service → **Variables** tab
- Verify these are set:
  - `MONGODB_URL` (MongoDB Atlas connection string)
  - `DB_NAME` (default: `digiassistant`)
  - `GEMINI_API_KEY` or `OPENAI_API_KEY`
  - `AI_PROVIDER` (default: `gemini`)
  - `JWT_SECRET_KEY`
  - `CORS_ORIGINS` (your frontend URL)

### 2. Root Directory Configuration
If Root Directory is set to `backend` in Railway, the start command should NOT include `cd backend`.

**Check in Railway Dashboard:**
- Settings → Root Directory
- If set to `backend`: Start command should be `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`
- If NOT set (root): Start command should be `cd backend && python -m uvicorn main:app --host 0.0.0.0 --port $PORT`

### 3. Check Application Logs
View logs to see what's happening:

1. In Railway Dashboard → Your service
2. Click **Deployments** tab
3. Click on the latest deployment
4. Click **View Logs** or **Logs** tab
5. Look for errors like:
   - MongoDB connection errors
   - Missing environment variables
   - Import errors
   - Port binding errors

### 4. Port Configuration
Ensure the app is binding to `0.0.0.0` and using `$PORT`:
- ✅ Correct: `--host 0.0.0.0 --port $PORT`
- ❌ Wrong: `--host localhost --port 8000`

## Fix Applied

I've updated `backend/main.py` to:
- Allow app to start even if MongoDB connection fails initially
- Log warnings instead of crashing
- App will still respond to healthcheck even if DB is down

## Next Steps

1. **Check Logs** - Most important! See what's actually failing
2. **Verify Environment Variables** - Make sure all required vars are set
3. **Check Root Directory** - Ensure it matches the start command
4. **Redeploy** after fixing issues

## Quick Test

After fixing, you can test the health endpoint manually:
```bash
curl https://your-railway-app.railway.app/health
```

Should return: `{"status":"healthy"}`

## Common Log Messages to Look For

✅ Good signs:
- `🚀 DigiAssistant API is running!`
- `✅ Connected to MongoDB Atlas: digiassistant`
- `Uvicorn running on http://0.0.0.0:XXXX`

❌ Bad signs:
- `❌ Failed to connect to MongoDB`
- `ModuleNotFoundError`
- `KeyError` (missing env var)
- `Port already in use`


