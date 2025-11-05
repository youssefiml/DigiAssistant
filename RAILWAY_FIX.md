# Railway Deployment Fix - uvicorn not found

## Problem
Railway shows error: `/bin/bash: line 1: uvicorn: command not found`

## Solution

### Option 1: Set Root Directory in Railway (Recommended)

1. Go to Railway dashboard
2. Click on your service
3. Go to **Settings** → **Root Directory**
4. Set root directory to: `backend`
5. Save and redeploy

This tells Railway that the Python project is in the `backend/` folder.

### Option 2: Use Railway Settings

1. In Railway dashboard, go to your service
2. Click **Settings**
3. Under **Build & Deploy**:
   - **Root Directory**: Set to `backend`
   - **Build Command**: `pip install --upgrade pip && pip install -r requirements.txt`
   - **Start Command**: `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`

### Option 3: Use Updated Files

I've updated the following files to use `python -m uvicorn` instead of just `uvicorn`:

- ✅ `railway.json` - Updated start command
- ✅ `Procfile` - Updated to use `python -m uvicorn`
- ✅ `start.sh` - Updated to use `python -m uvicorn`
- ✅ `nixpacks.toml` - Added configuration file

**Commit and push these changes:**
```bash
git add railway.json Procfile start.sh nixpacks.toml
git commit -m "Fix Railway deployment: use python -m uvicorn"
git push
```

Railway will automatically redeploy with the new configuration.

## Why This Happens

Railway's build process installs Python packages, but when running from a subdirectory, the `uvicorn` command might not be in the PATH. Using `python -m uvicorn` ensures Python finds uvicorn in the installed packages.

## Verification

After redeploying, check the logs:
- You should see: `🚀 Starting DigiAssistant Backend...`
- Followed by: `✅ Connected to MongoDB Atlas: digiassistant`
- Then: `🚀 DigiAssistant API is running!`

If you still see errors, check:
1. All environment variables are set
2. MongoDB connection string is correct
3. Root directory is set to `backend` in Railway settings

