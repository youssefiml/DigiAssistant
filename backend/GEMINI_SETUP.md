# 🔑 Setting Up Google Gemini API Key

This guide explains how to configure your DigiAssistant to use Google Gemini API, which is compatible with API keys from GitHub Marketplace.

## 📋 Quick Setup

### Step 1: Get Your API Key

**Option A: From GitHub Marketplace**
1. Visit GitHub Marketplace and purchase/activate a Google Gemini API subscription
2. Copy your API key from the marketplace

**Option B: Direct from Google**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key or use an existing one
3. Copy the API key

### Step 2: Configure Your Backend

Edit or create `C:/Digi-Assistant/backend/.env`:

```env
# Google Gemini API Key (from GitHub Marketplace or Google AI Studio)
GEMINI_API_KEY=your_api_key_here

# AI Provider Selection (set to "gemini" to use Gemini)
AI_PROVIDER=gemini

# Optional: OpenAI API Key (if you want to switch providers later)
# OPENAI_API_KEY=your_openai_key_here
```

### Step 3: Restart the Backend

```powershell
cd C:\Digi-Assistant\backend
python main.py
```

You should see:
```
[AI] Initializing AI service...
[AI] Provider: gemini
[AI] Gemini API Key present: True
[AI] Using Google Gemini as AI provider
```

## 🔄 Switching Between Providers

The system supports multiple AI providers. You can switch by changing `AI_PROVIDER` in your `.env`:

```env
# Use Gemini (default)
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_key

# Or use OpenAI
AI_PROVIDER=openai
OPENAI_API_KEY=your_openai_key

# Or use fallback (no API key needed)
AI_PROVIDER=fallback
```

## ✅ Verification

Once configured, test the AI service:

```powershell
cd C:\Digi-Assistant\backend
python -c "from services.ai_service import client_type, client; print(f'Provider: {client_type}'); print(f'Active: {client is not None}')"
```

Expected output:
```
[AI] Initializing AI service...
[AI] Provider: gemini
[AI] Gemini API Key present: True
[AI] Using Google Gemini as AI provider
Provider: gemini
Active: True
```

## 🛠️ Troubleshooting

### "Gemini client initialization error"
- Verify your API key is correct
- Check that `google-generativeai` is installed: `pip install google-generativeai`
- Ensure your API key has sufficient quota

### "Auto-selected OpenAI (Gemini not available)"
- Check that `GEMINI_API_KEY` is set in your `.env` file
- Verify the key is not empty
- Restart the backend after adding the key

### Using Fallback System
If no API keys are configured, the system will use intelligent fallback algorithms that work without external APIs. This is fine for testing but less accurate than using Gemini or OpenAI.

## 📝 Notes

- **Gemini API keys** work directly with the `google-generativeai` library
- **GitHub Marketplace keys** should be Google API keys compatible with Gemini
- The system automatically falls back if the configured provider is unavailable
- Both OpenAI and Gemini produce similar quality results for this use case

## 🔐 Security

**Important:** Never commit your `.env` file to version control!

Your `.env` file should be in `.gitignore`:
```
.env
.env.local
```
