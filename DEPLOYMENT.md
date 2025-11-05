# Deployment Guide for Railpack

## Files Created for Railpack

1. **`start.sh`** - Main startup script that Railpack will execute
   - Navigates to `backend/` directory
   - Installs dependencies from `requirements.txt`
   - Starts the FastAPI server with uvicorn

2. **`Procfile`** - Alternative deployment configuration (some platforms use this)

3. **`railpack.json`** - Railpack-specific configuration
   - Defines build and start commands

4. **`runtime.txt`** - Python version specification

## Important Notes

### Before Deploying

1. **Make sure `start.sh` is executable:**
   ```bash
   chmod +x start.sh
   ```

2. **Environment Variables:**
   Make sure to set these in Railpack's environment variables:
   - `MONGODB_URL` - Your MongoDB connection string
     - For MongoDB Atlas: `mongodb+srv://username:password@cluster.mongodb.net/digiassistant?retryWrites=true&w=majority`
     - For local MongoDB: `mongodb://localhost:27017` (not recommended for production)
     - See `backend/MONGODB_ATLAS_MIGRATION.md` for detailed setup instructions
   - `DB_NAME` - Database name (default: `digiassistant`)
   - `OPENAI_API_KEY` or `GEMINI_API_KEY` - Your AI provider API key
   - `JWT_SECRET_KEY` - A secret key for JWT tokens (use a strong random string)
   - `CORS_ORIGINS` - Your frontend URL (e.g., `https://your-frontend.vercel.app`)

3. **Project Structure:**
   - Railpack will detect Python from `backend/requirements.txt`
   - The `start.sh` script handles navigating to the backend directory
   - The app will run on the port specified by the `PORT` environment variable (Railpack sets this automatically)

### Deployment Steps

1. Commit all files including `start.sh`:
   ```bash
   git add start.sh Procfile railpack.json runtime.txt
   git commit -m "Add Railpack deployment configuration"
   git push
   ```

2. In Railpack dashboard:
   - Connect your GitHub repository
   - Railpack should now detect the `start.sh` script
   - Configure environment variables
   - Deploy!

### Troubleshooting

- **"Script start.sh not found"**: Make sure `start.sh` is committed to git and in the root directory
- **"Could not determine how to build"**: Railpack should auto-detect Python from `backend/requirements.txt`. If not, check that `requirements.txt` exists in the `backend/` directory
- **Port issues**: Railpack automatically sets the `PORT` environment variable. The `start.sh` script uses `${PORT:-8000}` as a fallback

## Alternative: Deploy Backend Only

If you want to deploy just the backend (recommended for monorepos):

1. The current setup deploys only the backend API
2. Deploy the frontend separately (e.g., Vercel, Netlify)
3. Update `CORS_ORIGINS` in Railpack environment variables to match your frontend URL

