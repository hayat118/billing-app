# 📋 Firebase Setup Checklist

Use this checklist to complete your Firebase setup step-by-step.

---

## ✅ PHASE 1: Firebase Project Setup

### Create Firebase Project
- [ ] Go to https://console.firebase.google.com/
- [ ] Click "Add project" or "Create a project"
- [ ] Enter project name (e.g., "billing-app")
- [ ] Choose whether to enable Google Analytics
- [ ] Accept terms if prompted
- [ ] Click "Create project"
- [ ] Wait for project creation to complete
- [ ] Click "Continue" to dashboard

### Register Web Application
- [ ] Click the Web icon (`</>`) in project overview
- [ ] Enter app nickname: "Billing App Web"
- [ ] (Optional) Check "Also set up Firebase Hosting"
- [ ] Click "Register app"
- [ ] **IMPORTANT: Copy the Firebase config object** (you'll need this)
- [ ] Click "Continue to console"

---

## ✅ PHASE 2: Enable Firebase Services

### Enable Authentication
- [ ] In Firebase Console, click "Build" → "Authentication"
- [ ] Click "Get started" button
- [ ] Click on "Email/Password" provider
- [ ] Toggle the "Enable" switch ON
- [ ] Leave "Email link (passwordless sign-in)" OFF
- [ ] Click "Save"
- [ ] Verify "Email/Password" shows as "Enabled"

### Enable Firestore Database
- [ ] Click "Build" → "Firestore Database"
- [ ] Click "Create database" button
- [ ] Select "Start in production mode" (NOT test mode)
- [ ] Click "Next"
- [ ] Choose a location closest to your users
- [ ] Click "Enable"
- [ ] Wait for database to be created (may take 1-2 minutes)

### Set Firestore Security Rules
- [ ] Go to "Rules" tab in Firestore
- [ ] Delete existing rules
- [ ] Copy and paste these rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // All collections below are user-specific
    match /customers/{customerId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    match /products/{productId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    match /invoices/{invoiceId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    match /payments/{paymentId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
    
    match /companySettings/{settingsId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
    
    match /billingSettings/{settingsId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

- [ ] Click "Publish" button
- [ ] Verify rules are saved (no error messages)

---

## ✅ PHASE 3: Get Firebase Credentials

### Find Your Firebase Config
- [ ] In Firebase Console, click the gear icon (⚙️) next to "Project Overview"
- [ ] Select "Project settings"
- [ ] Scroll down to "Your apps" section
- [ ] If you don't see a web app, click the Web icon (`</>`) to register one
- [ ] Under "SDK setup and configuration", select "Config" radio button
- [ ] You should see something like:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-ABC123"
};
```

### Copy These Values
- [ ] Copy `apiKey`
- [ ] Copy `authDomain`
- [ ] Copy `projectId`
- [ ] Copy `storageBucket`
- [ ] Copy `messagingSenderId`
- [ ] Copy `appId`
- [ ] Copy `measurementId` (if present)

---

## ✅ PHASE 4: Configure Your App

### Update .env.local File
- [ ] Open `/Users/tariquehayat/Desktop/billing-app/.env.local`
- [ ] Fill in each value:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy... (paste your apiKey)
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com (paste your authDomain)
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id (paste your projectId)
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com (paste your storageBucket)
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789 (paste your messagingSenderId)
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123 (paste your appId)
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123 (paste your measurementId)
```

- [ ] Save the file
- [ ] **DO NOT commit this file to Git** (it's already in .gitignore)

### Verify Dependencies
- [ ] Open terminal
- [ ] Navigate to project: `cd /Users/tariquehayat/Desktop/billing-app`
- [ ] Run: `npm install --legacy-peer-deps`
- [ ] Wait for installation to complete
- [ ] Verify no errors

---

## ✅ PHASE 5: Test the Integration

### Start Development Server
- [ ] Run: `npm run dev`
- [ ] Wait for server to start
- [ ] Verify it shows: "Local: http://localhost:4000"
- [ ] Open browser to http://localhost:4000

### Test Registration
- [ ] You should be redirected to `/login`
- [ ] Click "Sign up for free" link
- [ ] Fill in the form:
  - Full Name: `Test User`
  - Email: `test@example.com` (or your email)
  - Password: `password123` (min 6 characters)
  - Confirm Password: `password123`
  - Check "I agree to Terms and Conditions"
- [ ] Click "Create Account"
- [ ] Verify: You're redirected to login page
- [ ] Verify: Success message appears

### Test Login
- [ ] Enter the email you registered with
- [ ] Enter the password
- [ ] Click "Sign In"
- [ ] Verify: You're redirected to `/dashboard`
- [ ] Verify: Your name appears in the top right
- [ ] Verify: Dashboard loads without errors

### Verify in Firebase Console
- [ ] Go back to Firebase Console
- [ ] Click "Build" → "Authentication"
- [ ] Click "Users" tab
- [ ] Verify: You see your registered user in the list
- [ ] Click "Build" → "Firestore Database"
- [ ] Verify: You see a `users` collection
- [ ] Click on `users` collection
- [ ] Verify: You see a document with your user data

### Test Logout
- [ ] Click on your name/avatar in top right
- [ ] Click "Sign out" from dropdown
- [ ] Verify: You're redirected to `/login`
- [ ] Verify: You cannot access `/dashboard` directly

### Test Route Protection
- [ ] While logged out, manually navigate to http://localhost:4000/dashboard
- [ ] Verify: You're redirected to `/login`
- [ ] Log in again
- [ ] Try to access http://localhost:4000/login
- [ ] Verify: You're redirected to `/dashboard`

---

## ✅ PHASE 6: Final Verification

### Console Checks
- [ ] Open browser DevTools (F12 or Cmd+Option+I)
- [ ] Go to "Console" tab
- [ ] Navigate through the app
- [ ] Verify: No red error messages
- [ ] Verify: No Firebase authentication errors
- [ ] Verify: No Firestore permission errors

### Network Checks
- [ ] Go to "Network" tab in DevTools
- [ ] Filter by "fetch" or "xhr"
- [ ] Login to the app
- [ ] Verify: Firebase API calls are successful (status 200)
- [ ] Verify: No 401 or 403 errors

### Data Verification
- [ ] In Firestore Console, check the `users` collection
- [ ] Verify document structure:
  ```
  {
    id: "firebase-uid",
    name: "Your Name",
    email: "your@email.com",
    createdAt: Timestamp,
    updatedAt: Timestamp
  }
  ```

---

## ✅ PHASE 7: Security Checks

### Environment Variables
- [ ] Verify `.env.local` is NOT in Git
- [ ] Run: `git status`
- [ ] Verify `.env.local` does NOT appear
- [ ] Verify `.env.local.example` DOES appear (this is OK)

### Firebase Console
- [ ] Check "Authentication" → "Settings"
- [ ] Verify: Only Email/Password is enabled (unless you added more)
- [ ] Check "Firestore Database" → "Rules"
- [ ] Verify: Security rules are published and active

### Firestore Indexes
- [ ] Go to "Firestore Database" → "Indexes" tab
- [ ] Check for any failed indexes
- [ ] If queries fail, Firebase will show a link to create missing indexes
- [ ] Click the link to create required indexes

---

## 🎉 Success Criteria

Your Firebase integration is working if ALL of these are true:

- ✅ Can register a new account
- ✅ Can login with credentials
- ✅ User appears in Firebase Authentication
- ✅ User data exists in Firestore
- ✅ Dashboard is accessible after login
- ✅ Logout works correctly
- ✅ Protected routes redirect to login when not authenticated
- ✅ Authenticated users redirected from login/signup to dashboard
- ✅ No console errors
- ✅ Data persists on page refresh

---

## 🆘 Troubleshooting

### "Firebase: Error (auth/invalid-api-key)"
**Fix:** Check `.env.local` - your API key is incorrect or missing

### "Firebase: Error (auth/invalid-email)"
**Fix:** Make sure email format is valid (e.g., test@example.com)

### "Firebase: Error (auth/email-already-in-use)"
**Fix:** User already exists - try logging in instead

### "Firebase: Error (auth/weak-password)"
**Fix:** Password must be at least 6 characters

### "Missing or insufficient permissions"
**Fix:** 
1. Check Firestore security rules are published
2. Verify user is authenticated
3. Check userId field matches authenticated user's UID

### "Cannot read properties of undefined (reading 'firebase')"
**Fix:** 
1. Restart dev server: `npm run dev`
2. Clear browser cache
3. Verify all environment variables are set

### App not redirecting after login
**Fix:**
1. Check browser console for errors
2. Verify Firebase config is correct
3. Ensure AuthProvider wraps the app in layout.tsx

---

## 📞 Next Steps After Setup

Once everything is working:

1. **Read the documentation:**
   - [ ] Read `FIREBASE_SETUP.md` for detailed info
   - [ ] Read `FIREBASE_ARCHITECTURE.md` for architecture overview
   - [ ] Read `FIREBASE_INTEGRATION_SUMMARY.md` for complete summary

2. **Plan next development phase:**
   - [ ] Update dashboard pages to use Firestore data
   - [ ] Implement CRUD for customers
   - [ ] Implement CRUD for invoices
   - [ ] Implement CRUD for products
   - [ ] Add payment recording

3. **Production preparation:**
   - [ ] Enable Firebase App Check
   - [ ] Set up billing alerts
   - [ ] Review security rules
   - [ ] Test thoroughly
   - [ ] Set up monitoring

---

## ✅ All Done?

If you've checked off all items above, your Firebase integration is complete! 🎉

**What works now:**
- ✅ Secure user authentication
- ✅ User registration and login
- ✅ Protected routes
- ✅ Firestore database
- ✅ User-specific data isolation
- ✅ Session management
- ✅ Automatic redirects

**Ready for next phase:** Connecting your dashboard pages to Firebase!

---

**Need help?** Check these files:
- `FIREBASE_SETUP.md` - Detailed setup guide
- `QUICK_START.md` - Quick reference
- `FIREBASE_ARCHITECTURE.md` - Architecture diagrams
- `FIREBASE_INTEGRATION_SUMMARY.md` - Complete summary
