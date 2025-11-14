# 🚀 Quick Start - Authentication System

## ⚡ Get Started in 3 Steps

### Step 1: Install Dependencies ✅
```bash
# Backend (Already installed)
cd backend
pip install -r requirements.txt

# Frontend (Already installed)
cd frontend
npm install
```

### Step 2: Start the Servers
```bash
# Terminal 1 - Backend
cd backend
python main.py
# Server runs on http://localhost:8000

# Terminal 2 - Frontend
cd frontend
npm run dev
# Server runs on http://localhost:5173
```

### Step 3: Test Authentication
1. Open browser: `http://localhost:5173`
2. You'll see the beautiful 3D flip authentication page
3. **Sign Up**: 
   - Toggle to "Sign Up" side
   - Enter: Full Name, Email, Password
   - Click Submit
4. You'll be redirected to the dashboard
5. Click "Logout" button to test logout

## 🎨 What You'll See

### Login/Sign Up Page (`/auth`)
- Beautiful 3D flip card with your project colors
- Smooth toggle animation between Login and Sign Up
- Form with email and password inputs
- Gold accents (#FFD700) on icons
- Dark teal buttons (#004D4D)

### Dashboard (`/dashboard`)
- Your existing dashboard page
- New "Logout" button in the top-right header
- Only accessible when logged in

### Protected Routes
All these routes now require authentication:
- `/dashboard`
- `/diagnostic`
- `/diagnostic/:sessionId`
- `/results`
- `/results/:sessionId`

## 🧪 Test Scenarios

### Scenario 1: New User Registration
1. Visit `http://localhost:5173`
2. You'll be redirected to `/auth`
3. Toggle to "Sign Up"
4. Enter:
   - Full Name: `John Doe`
   - Email: `john@example.com`
   - Password: `password123`
5. Click "Submit"
6. You'll be redirected to `/dashboard`
7. Check MongoDB: `db.users.find()` - you'll see the new user

### Scenario 2: Login
1. Logout from dashboard
2. Toggle to "Login" side
3. Enter your email and password
4. Click "Submit"
5. You'll be redirected to `/dashboard`

### Scenario 3: Protected Routes
1. Logout from dashboard
2. Try to visit `/dashboard` directly
3. You'll be automatically redirected to `/auth`
4. Login, and you'll be taken to `/dashboard`

### Scenario 4: Token Persistence
1. Login to the app
2. Refresh the page (F5)
3. You stay logged in (token persists)
4. Close the browser
5. Open again and visit the app
6. You're still logged in (token in localStorage)

### Scenario 5: Logout
1. When logged in, click "Logout" button in header
2. Token is cleared
3. Redirected to `/auth`
4. Try to access `/dashboard` - redirected back to `/auth`

## 🔍 Debugging Tips

### Check Token
```javascript
// In browser console
localStorage.getItem('token')
// Should show a JWT token when logged in
```

### Check User Data
```javascript
// In browser console
localStorage.getItem('user')
// Should show user JSON when logged in
```

### Check MongoDB
```bash
# In MongoDB shell or Compass
use digiassistant
db.users.find().pretty()
# Shows all registered users (passwords are hashed)
```

### Check API Calls
1. Open DevTools → Network tab
2. Login or make any API call
3. Check the request headers
4. You should see: `Authorization: Bearer <long_token>`

## 🎯 Key Features Working

✅ User registration with email validation
✅ Secure password hashing (bcrypt)
✅ JWT token generation (30-day expiration)
✅ Token storage in localStorage
✅ Auto token injection in API requests
✅ Protected routes (redirect to login)
✅ Beautiful 3D flip card UI
✅ Smooth animations
✅ Error handling and validation
✅ Logout functionality
✅ Auto-logout on token expiration
✅ Responsive design

## 📱 Mobile Testing

The authentication page is fully responsive:
- Works on phones (iPhone, Android)
- Works on tablets (iPad, etc.)
- Works on desktop (all sizes)

Test by:
1. Opening DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select a mobile device
4. Test the authentication flow

## ⚠️ Before Production

**CRITICAL**: Change the SECRET_KEY!

Edit `backend/utils/auth.py`:
```python
# Generate a secure key:
# openssl rand -hex 32

SECRET_KEY = "your-new-secure-random-key-here"
```

Or better, use environment variable:
```python
import os
SECRET_KEY = os.getenv("SECRET_KEY")
```

## 🎨 Customization

### Change Colors
Edit `frontend/tailwind.config.js`:
```javascript
colors: {
  primary: {
    DEFAULT: '#004D4D',  // Change this
    light: '#006666',
    dark: '#003333',
  },
  // ... more colors
}
```

### Change Token Expiration
Edit `backend/utils/auth.py`:
```python
ACCESS_TOKEN_EXPIRE_MINUTES = 30 * 24 * 60  # 30 days
# Change to: 60 for 1 hour, 1440 for 1 day, etc.
```

## 📚 Documentation

- **Full Setup Guide**: `AUTHENTICATION_SETUP.md`
- **Design Details**: `AUTH_PAGE_PREVIEW.md`
- **Summary**: `AUTHENTICATION_SUMMARY.md`
- **Quick Start**: `QUICKSTART_AUTH.md` (this file)

## 🎉 You're Ready!

Everything is set up and working. Just:
1. Start the servers
2. Visit the app
3. Create an account
4. Enjoy your secure, beautiful authentication system!

---

**Need Help?** Check the documentation files or the browser/terminal console for errors.

