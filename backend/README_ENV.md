# Environment Variables Setup

## How to Configure API Keys

**IMPORTANT**: Never put API keys directly in `settings.py`! Always use a `.env` file.

## Quick Setup

1. Create a `.env` file in the `backend/` directory:

```bash
cd backend
touch .env
```

2. Add your API keys to the `.env` file:

```env
# MongoDB Configuration
MONGODB_URL=mongodb://localhost:27017
DB_NAME=digiassistant

# JWT Configuration
JWT_SECRET_KEY=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# AI Provider Configuration
# Option 1: OpenAI (leave empty if not using)
OPENAI_API_KEY=sk-your-openai-api-key-here

# Option 2: Google Gemini (Recommended - supports GitHub Marketplace API keys)
GEMINI_API_KEY=your-gemini-api-key-here

# AI Provider Selection
# Options: "openai", "gemini", "fallback"
AI_PROVIDER=gemini

# CORS Configuration
CORS_ORIGINS=http://localhost:5173
```

3. The `.env` file is automatically loaded by `settings.py` (configured via `pydantic-settings`)

## Why Use .env Instead of settings.py?

✅ **Security**: `.env` files are excluded from git (see `.gitignore`)  
✅ **Flexibility**: Different values for development, staging, production  
✅ **Best Practice**: Standard industry practice for configuration management  
✅ **Separation**: Keeps secrets separate from code  

## How It Works

1. `settings.py` defines the structure with default values (empty strings for API keys)
2. `pydantic-settings` automatically reads from `.env` file
3. Values from `.env` override the defaults in `settings.py`
4. If a variable is missing in `.env`, the default from `settings.py` is used

## Getting API Keys

### OpenAI
1. Go to https://platform.openai.com/api-keys
2. Create a new API key
3. Add it to `.env` as `OPENAI_API_KEY=sk-...`

### Google Gemini
1. Go to https://makersuite.google.com/app/apikey
2. Create a new API key
3. Add it to `.env` as `GEMINI_API_KEY=...`

## Troubleshooting

**Q: My API keys aren't working!**  
A: Make sure:
- The `.env` file is in the `backend/` directory
- The variable names match exactly (case-sensitive)
- No quotes around values in `.env`
- Restart the server after changing `.env`

**Q: Can I commit `.env` to git?**  
A: **NO!** The `.env` file is already in `.gitignore` to prevent this. Never commit API keys!

**Q: What if I don't have a `.env` file?**  
A: The app will use default values from `settings.py` (empty strings for API keys, which means the fallback system will be used)

