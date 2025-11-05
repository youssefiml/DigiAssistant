# Railway Deployment Guide

This guide will help you deploy DigiAssistant to Railway.

## Prerequisites

1. GitHub account with your DigiAssistant repository
2. Railway account (sign up at [railway.app](https://railway.app))
3. MongoDB Atlas account (see `backend/MONGODB_ATLAS_MIGRATION.md`)

## Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Authorize Railway to access your GitHub repositories

## Step 2: Create New Project

1. Click **"New Project"** in Railway dashboard
2. Select **"Deploy from GitHub repo"**
3. Choose your DigiAssistant repository
4. Railway will automatically detect it as a Python project

## Step 3: Configure Build Settings

Railway should auto-detect your Python project, but you can verify:

1. Go to your project settings
2. Check **"Build Command"**:
   ```
   cd backend && pip install -r requirements.txt
   ```
3. Check **"Start Command"** (Railway will use Procfile or you can set):
   ```
   cd backend && uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

**Note**: Railway automatically sets the `PORT` environment variable. Your app must use `$PORT` to bind to it.

## Step 4: Set Environment Variables

In Railway dashboard, go to **"Variables"** tab and add:

### Required Variables

```env
# MongoDB Atlas Connection (REQUIRED)
MONGODB_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/digiassistant?retryWrites=true&w=majority

# Database Name
DB_NAME=digiassistant

# AI Provider (choose one)
OPENAI_API_KEY=your-openai-api-key
# OR
GEMINI_API_KEY=your-gemini-api-key

# AI Provider Selection
AI_PROVIDER=gemini

# JWT Secret (generate a strong random string)
JWT_SECRET_KEY=your-very-secure-random-secret-key-here

# CORS Origins (your frontend URL)
CORS_ORIGINS=https://your-frontend-domain.vercel.app,https://your-frontend-domain.netlify.app
```

### How to Set Variables in Railway

1. Go to your project in Railway
2. Click on **"Variables"** tab
3. Click **"New Variable"**
4. Add each variable:
   - **Key**: `MONGODB_URL`
   - **Value**: Your Atlas connection string
   - Click **"Add"**
5. Repeat for all variables

### Generating JWT Secret

You can generate a secure JWT secret using:

```bash
# Using Python
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Using OpenSSL
openssl rand -base64 32
```

## Step 5: Deploy

1. Railway will automatically deploy when you push to your main branch
2. Or click **"Deploy"** in Railway dashboard
3. Watch the build logs to ensure everything works

## Step 6: Seed Database (First Time)

After first deployment, you need to seed the database:

### Option A: Using Railway CLI

1. Install Railway CLI:
   ```bash
   npm i -g @railway/cli
   ```

2. Login:
   ```bash
   railway login
   ```

3. Link to your project:
   ```bash
   railway link
   ```

4. Run seed script:
   ```bash
   railway run python backend/seed_database.py
   ```

### Option B: Using Railway Shell

1. In Railway dashboard, click on your service
2. Go to **"Deployments"** → **"View Logs"**
3. Click **"Shell"** tab
4. Run:
   ```bash
   cd backend
   python seed_database.py
   ```

### Option C: Using Railway's One-Click Deploy Script

Create a temporary script that runs on startup (only for first deployment):

1. Add a script that checks if collections exist
2. If not, run seed script automatically

## Step 7: Get Your App URL

1. In Railway dashboard, click on your service
2. Go to **"Settings"** → **"Networking"**
3. Click **"Generate Domain"** to get a public URL
   - Example: `https://digiassistant-production.up.railway.app`
4. Or add a custom domain if you have one

## Step 8: Update CORS Settings

1. Update `CORS_ORIGINS` in Railway variables with your frontend URL:
   ```
   CORS_ORIGINS=https://your-frontend.vercel.app
   ```
2. Redeploy if needed (Railway auto-redeploys on variable changes)

## Step 9: Configure Frontend

Update your frontend's API URL:

1. In `frontend/src/services/api.js`, update:
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://your-railway-app.railway.app';
   ```

2. Or set environment variable in your frontend deployment:
   ```
   VITE_API_BASE_URL=https://your-railway-app.railway.app
   ```

## Monitoring & Logs

### View Logs

1. Go to Railway dashboard
2. Click on your service
3. Click **"Deployments"** → **"View Logs"**
4. Or use Railway CLI:
   ```bash
   railway logs
   ```

### Health Check

Railway will automatically check:
- Endpoint: `/health`
- Your app should return: `{"status": "healthy"}`

## Troubleshooting

### Build Fails

**Problem**: Build fails with dependency errors
**Solution**:
- Check `backend/requirements.txt` exists
- Ensure all dependencies are listed
- Check build logs for specific errors

### Application Won't Start

**Problem**: App crashes on startup
**Solution**:
- Check logs: `railway logs` or dashboard
- Verify all environment variables are set
- Check MongoDB connection string is correct
- Ensure port binding uses `$PORT` variable

### Database Connection Fails

**Problem**: Can't connect to MongoDB Atlas
**Solutions**:
- Verify `MONGODB_URL` is correct in Railway variables
- Check Atlas Network Access allows Railway IPs (or use 0.0.0.0/0 temporarily)
- Verify database user credentials
- URL-encode special characters in password

### CORS Errors

**Problem**: Frontend can't connect to API
**Solution**:
- Update `CORS_ORIGINS` in Railway variables
- Include your frontend URL (with https://)
- Multiple origins: `https://domain1.com,https://domain2.com`
- Redeploy after changing variables

### Port Already in Use

**Problem**: Port binding errors
**Solution**:
- Railway automatically sets `PORT` variable
- Make sure your start command uses `$PORT`:
  ```bash
  uvicorn main:app --host 0.0.0.0 --port $PORT
  ```

## Railway Features

### Automatic Deployments

- Railway deploys automatically on git push to main branch
- You can disable auto-deploy in settings
- Manual deployments available

### Environment Variables

- Set variables in dashboard
- Variables are encrypted at rest
- Can reference other variables: `$OTHER_VAR`

### Scaling

- Railway automatically scales based on traffic
- Set resource limits in project settings
- Upgrade plan for more resources

### Custom Domain

1. Go to **"Settings"** → **"Networking"**
2. Click **"Custom Domain"**
3. Add your domain
4. Configure DNS records as instructed

## Cost

- **Free Tier**: $5 credit/month (usually enough for small projects)
- **Starter Plan**: $5/month for more resources
- **Pro Plan**: $20/month for production workloads

## Next Steps

1. ✅ Deploy backend to Railway
2. ✅ Set up environment variables
3. ✅ Seed database
4. ✅ Deploy frontend (Vercel/Netlify)
5. ✅ Update frontend API URL
6. ✅ Test end-to-end

## Additional Resources

- [Railway Documentation](https://docs.railway.app/)
- [Railway Discord](https://discord.gg/railway)
- [Railway Status](https://status.railway.app/)

## Support

If you encounter issues:
1. Check Railway logs
2. Check MongoDB Atlas connection
3. Verify all environment variables
4. Check Railway status page
5. Join Railway Discord for help

