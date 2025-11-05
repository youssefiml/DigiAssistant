# Railway Nixpacks Configuration (No Docker)

## ✅ Current Setup

Your project is configured to use **Nixpacks** (not Docker) for Railway deployment:

- ✅ `railway.json` - Set to use NIXPACKS builder
- ✅ `nixpacks.toml` - Nixpacks configuration file
- ✅ `Procfile` - Alternative start command
- ✅ No Dockerfile - Docker is not used

## Important: Set Root Directory in Railway

For Nixpacks to work correctly with your monorepo structure:

1. Go to Railway dashboard
2. Click on your service
3. Go to **Settings** → **Root Directory**
4. Set it to: **`backend`**
5. Save

This tells Railway/Nixpacks that your Python project is in the `backend/` folder.

## How It Works

1. **Nixpacks** detects Python from `backend/requirements.txt`
2. Installs dependencies: `pip install -r requirements.txt`
3. Runs: `python -m uvicorn main:app --host 0.0.0.0 --port $PORT`

## Environment Variables

Make sure these are set in Railway:

```env
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/digiassistant?retryWrites=true&w=majority
DB_NAME=digiassistant
GEMINI_API_KEY=your-key
AI_PROVIDER=gemini
JWT_SECRET_KEY=your-secret
CORS_ORIGINS=https://your-frontend.vercel.app
```

## Deploy

1. Commit and push:
   ```bash
   git add railway.json nixpacks.toml Procfile
   git commit -m "Configure Railway to use Nixpacks (no Docker)"
   git push
   ```

2. Railway will automatically deploy using Nixpacks

## Troubleshooting

If build fails:
- ✅ Check Root Directory is set to `backend` in Railway settings
- ✅ Verify `backend/requirements.txt` exists
- ✅ Check build logs for specific errors
- ✅ Ensure all environment variables are set

## Why Nixpacks?

- ✅ Simpler than Docker
- ✅ Auto-detects Python projects
- ✅ Handles dependencies automatically
- ✅ Faster builds
- ✅ No Docker knowledge required

