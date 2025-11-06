# Force Railway to Use Nixpacks (Not Docker)

## Problem
Railway is trying to use Docker instead of Nixpacks, causing build errors.

## Solution: Change Builder in Railway Dashboard

**IMPORTANT:** You need to manually change the builder in Railway dashboard:

### Step 1: Open Railway Dashboard
1. Go to [railway.app](https://railway.app)
2. Login and open your project

### Step 2: Change Builder to Nixpacks
1. Click on your **service** (not the project)
2. Go to **Settings** tab
3. Scroll down to **Build & Deploy** section
4. Find **Builder** dropdown
5. Change it from **"Dockerfile"** or **"Docker"** to **"Nixpacks"**
6. **Save** changes

### Step 3: Set Root Directory
In the same **Settings** → **Build & Deploy** section:
1. Find **Root Directory** field
2. Set it to: **`backend`**
3. **Save** changes

### Step 4: Verify Start Command
Make sure the **Start Command** is:
```
cd backend && python -m uvicorn main:app --host 0.0.0.0 --port $PORT
```

Or if Root Directory is set to `backend`, you can use:
```
python -m uvicorn main:app --host 0.0.0.0 --port $PORT
```

### Step 5: Redeploy
1. Go to **Deployments** tab
2. Click **"Redeploy"** or **"Deploy"**
3. Railway will now use Nixpacks instead of Docker

## Alternative: Delete and Recreate Service

If the builder won't change:

1. **Note down your environment variables** (copy them somewhere)
2. Delete the current service in Railway
3. Create a **new service** from the same GitHub repo
4. During setup, make sure to select **"Nixpacks"** as the builder
5. Set **Root Directory** to `backend`
6. Re-add all your environment variables
7. Deploy

## Verify It's Using Nixpacks

After deployment, check the build logs. You should see:
- ✅ Nixpacks build messages (not Docker)
- ✅ Python detection
- ✅ `pip install` commands
- ✅ No Docker-related errors

## Files to Ensure Are Committed

Make sure these files are in your repo:
- ✅ `nixpacks.toml` (in root)
- ✅ `railway.json` (in root)
- ✅ `Procfile` (in root)
- ✅ `backend/requirements.txt`
- ✅ NO `Dockerfile` anywhere

## If Still Having Issues

1. Check Railway dashboard → Settings → Builder is set to "Nixpacks"
2. Check Root Directory is set to `backend`
3. Make sure no Dockerfile exists in the repo
4. Try deleting `.railway` folder if it exists (it shouldn't)
5. Contact Railway support if builder keeps reverting to Docker

