# Firebase Setup Guide for Billing App

## 📋 Prerequisites
- Node.js installed
- npm or yarn package manager
- A Firebase account (free tier available)

---

## 🔥 Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"**
3. Enter project name: `billing-app` (or your preferred name)
4. Enable or disable Google Analytics (your choice)
5. Click **"Create project"**
6. Wait for the project to be created

---

## ⚙️ Step 2: Register Your Web App

1. In Firebase Console, click the **Web icon (</>)** in the project overview
2. Register your app with a nickname: `Billing App Web`
3. ✅ **Check the box** for "Also set up Firebase Hosting" (optional)
4. Click **"Register app"**
5. You'll see a Firebase configuration object - **copy these values**

---

## 🔐 Step 3: Enable Firebase Authentication

1. In Firebase Console, go to **Build → Authentication**
2. Click **"Get started"**
3. Enable **Email/Password** sign-in method:
   - Click on "Email/Password"
   - Toggle **"Enable"**
   - Click **"Save"**
4. (Optional) Enable other providers like Google, Facebook, etc.

---

## 🗄️ Step 4: Set Up Firestore Database

1. In Firebase Console, go to **Build → Firestore Database**
2. Click **"Create database"**
3. Choose **"Start in production mode"** (we'll set up security rules)
4. Select your database location (choose closest to your users)
5. Click **"Enable"**

### Set Up Security Rules

1. Go to the **Rules** tab in Firestore
2. Replace the default rules with:

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

3. Click **"Publish"**

---

## 🔧 Step 5: Configure Environment Variables

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"** section
3. Copy the configuration values
4. Open `.env.local` file in your project root
5. Fill in your Firebase credentials:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Example:**
```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyBxxyz123abc456
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=billing-app-12345.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=billing-app-12345
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=billing-app-12345.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=G-ABC123DEF
```

---

## 🚀 Step 6: Run the Application

```bash
# Install dependencies (if not already done)
npm install --legacy-peer-deps

# Start the development server
npm run dev
```

The app will run on **http://localhost:4000**

---

## ✅ Step 7: Test the Setup

### Test User Registration
1. Go to http://localhost:4000
2. You should be redirected to `/login`
3. Click **"Sign up for free"**
4. Fill in the registration form:
   - Full Name: `Test User`
   - Email: `test@example.com`
   - Password: `password123`
   - Agree to terms ✅
5. Click **"Create Account"**
6. You should be redirected to login page with success message

### Test User Login
1. Enter your credentials
2. Click **"Sign In"**
3. You should be redirected to `/dashboard`

### Verify in Firebase Console
1. Go to **Authentication → Users**
2. You should see your registered user
3. Go to **Firestore Database**
4. You should see a `users` collection with your user data

---

## 📁 Project Structure (Firebase Integration)

```
billing-app/
├── src/
│   ├── lib/
│   │   └── firebase.ts                 # Firebase initialization
│   ├── services/
│   │   ├── authService.ts             # Authentication functions
│   │   └── firestoreService.ts        # Database operations
│   ├── types/
│   │   └── database.ts                # TypeScript interfaces
│   └── contexts/
│       └── AuthContext.tsx            # Auth state management
├── app/
│   ├── login/page.tsx                 # Login page (Firebase Auth)
│   ├── signup/page.tsx                # Signup page (Firebase Auth)
│   └── dashboard/                     # Protected routes
├── middleware.ts                       # Route protection
├── .env.local                         # Firebase credentials (DO NOT COMMIT)
└── .env.local.example                 # Template for credentials
```

---

## 🔒 Security Best Practices

1. **Never commit `.env.local`** to version control
2. **Enable Firebase App Check** for production
3. **Set up Firestore indexes** for better query performance
4. **Enable Firebase Authentication session management**
5. **Use Firebase Security Rules** (already configured above)
6. **Enable billing alerts** in Firebase Console

---

## 🐛 Troubleshooting

### Issue: "Firebase: Error (auth/invalid-api-key)"
**Solution:** Check that `NEXT_PUBLIC_FIREBASE_API_KEY` is correct in `.env.local`

### Issue: "Firebase: Error (auth/invalid-email)"
**Solution:** Ensure email format is valid (e.g., `test@example.com`)

### Issue: "Firebase: Error (auth/email-already-in-use)"
**Solution:** User already exists, try logging in instead

### Issue: "Missing or insufficient permissions" in Firestore
**Solution:** 
1. Check Firestore security rules
2. Ensure user is authenticated
3. Verify `userId` field matches authenticated user's UID

### Issue: App not redirecting after login
**Solution:** 
1. Check browser console for errors
2. Verify Firebase config is correct
3. Ensure AuthProvider is wrapping the app in `app/layout.tsx`

---

## 📊 Firestore Collections Structure

### `users` Collection
```typescript
{
  id: string (UID)
  name: string
  email: string
  companyName?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### `customers` Collection
```typescript
{
  id: string
  userId: string (reference to users)
  name: string
  email: string
  phone: string
  company: string
  address: string
  status: 'active' | 'inactive' | 'pending'
  totalInvoices: number
  totalSpent: number
  lastActivity: Timestamp
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

### `invoices` Collection
```typescript
{
  id: string
  userId: string
  invoiceNumber: string
  customerId: string
  customerName: string
  customerEmail: string
  items: InvoiceItem[]
  subtotal: number
  taxAmount: number
  discount: number
  total: number
  date: Timestamp
  dueDate: Timestamp
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
  notes?: string
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

---

## 🎯 Next Steps

After Firebase setup is complete:

1. ✅ Update dashboard pages to fetch data from Firestore
2. ✅ Implement CRUD operations for customers
3. ✅ Implement CRUD operations for invoices
4. ✅ Implement CRUD operations for products
5. ✅ Implement payment recording
6. ✅ Add real-time data synchronization
7. ✅ Implement PDF generation for invoices
8. ✅ Add email notifications

---

## 📚 Useful Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication](https://firebase.google.com/docs/auth)
- [Firestore Database](https://firebase.google.com/docs/firestore)
- [Firebase Security Rules](https://firebase.google.com/docs/rules)
- [Next.js + Firebase Guide](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

## 🆘 Need Help?

If you encounter any issues:
1. Check the browser console for errors
2. Verify all environment variables are set correctly
3. Ensure Firebase services are enabled in Console
4. Check Firestore security rules
5. Review Firebase Console logs

---

**Happy Coding! 🎉**
