# 🚀 Quick Start - Firebase Setup

## ⚡ 5-Minute Setup Guide

### 1️⃣ Create Firebase Project (2 min)
- Visit: https://console.firebase.google.com/
- Click "Add project" → Name it → Create

### 2️⃣ Enable Services (2 min)
- **Authentication**: Build → Authentication → Get Started → Enable Email/Password
- **Firestore**: Build → Firestore Database → Create Database → Production mode

### 3️⃣ Get Config (1 min)
- Project Settings → Your apps → Web app (</>)
- Copy the config values

### 4️⃣ Update .env.local
```bash
cp .env.local.example .env.local
# Then fill in your Firebase credentials
```

### 5️⃣ Run App
```bash
npm run dev
```

Visit: http://localhost:4000

---

## 📝 Firestore Security Rules

Copy this to Firestore → Rules tab:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /{collection}/{docId} {
      allow read, write: if request.auth != null && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
    }
  }
}
```

---

## ✅ Test Checklist

- [ ] Can access http://localhost:4000
- [ ] Redirected to /login
- [ ] Can create new account
- [ ] Can login with credentials
- [ ] Redirected to /dashboard after login
- [ ] User appears in Firebase Authentication
- [ ] User data in Firestore `users` collection

---

## 🆘 Common Issues

| Issue | Solution |
|-------|----------|
| Invalid API Key | Check `.env.local` values |
| Permission denied | Update Firestore rules |
| Not redirecting | Check browser console |
| Port in use | Run `lsof -ti:4000 \| xargs kill` |

---

## 📂 Files Created

✅ `src/lib/firebase.ts` - Firebase initialization  
✅ `src/services/authService.ts` - Auth functions  
✅ `src/services/firestoreService.ts` - Database functions  
✅ `src/types/database.ts` - TypeScript types  
✅ `middleware.ts` - Route protection  
✅ `.env.local.example` - Config template  
✅ `FIREBASE_SETUP.md` - Complete guide  

---

**Need help?** Check `FIREBASE_SETUP.md` for detailed instructions!
