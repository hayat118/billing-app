# 🏗️ Firebase Architecture & Data Flow

## Authentication Flow

```
┌─────────────┐
│   User      │
│  Signs Up   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  signup/page.tsx                │
│  - Collects form data           │
│  - Validates input              │
│  - Calls register()             │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  AuthContext.register()         │
│  - Calls signUp() service       │
│  - Handles redirect             │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  authService.signUp()           │
│  - createUserWithEmailAndPassword│
│  - updateProfile(name)          │
│  - Creates user in Firestore    │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│     Firebase Services           │
│  ┌──────────┐  ┌──────────────┐ │
│  │   Auth   │  │  Firestore   │ │
│  │  User    │  │  /users/{id} │ │
│  └──────────┘  └──────────────┘ │
└─────────────────────────────────┘
```

## Login Flow

```
┌─────────────┐
│   User      │
│   Logs In   │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  login/page.tsx                 │
│  - Collects credentials         │
│  - Validates input              │
│  - Calls login()                │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  AuthContext.login()            │
│  - Calls signIn() service       │
│  - Redirects to dashboard       │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  authService.signIn()           │
│  - signInWithEmailAndPassword   │
│  - Returns user object          │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Firebase Authentication        │
│  - Validates credentials        │
│  - Returns Firebase User        │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  onAuthStateChanged Trigger     │
│  - Fetches user from Firestore  │
│  - Updates AuthContext          │
│  - UI updates automatically     │
└─────────────────────────────────┘
```

## Data Flow for Dashboard Pages

```
┌─────────────────────────────────┐
│  Dashboard Page                 │
│  (customers/invoices/etc)       │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Get Current User from          │
│  AuthContext                    │
│  - user.id (Firebase UID)       │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Call Firestore Service         │
│  - customersService.getAll(uid) │
│  - invoicesService.getAll(uid)  │
│  - productsService.getAll(uid)  │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Firestore Query                │
│  collection('customers')        │
│  where('userId', '==', uid)     │
│  orderBy('createdAt', 'desc')   │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Firestore Database             │
│  Returns matching documents     │
└──────┬──────────────────────────┘
       │
       ▼
┌─────────────────────────────────┐
│  Update Page State              │
│  - useState/setState            │
│  - Re-render with data          │
│  - Display in tables            │
└─────────────────────────────────┘
```

## Route Protection Flow

```
┌─────────────┐
│  User visits│
│   /dashboard│
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────┐
│  middleware.ts                  │
│  - Checks __session cookie      │
│  - Evaluates route              │
└──────┬──────────────────────────┘
       │
       ├──────────────┐
       │              │
       ▼              ▼
┌────────────┐  ┌────────────┐
│Authenticated│ │Not Auth'd  │
└──────┬─────┘  └──────┬─────┘
       │               │
       ▼               ▼
┌────────────┐  ┌────────────┐
│ Allow      │  │ Redirect   │
│ Request    │  │ to /login  │
└────────────┘  └────────────┘
```

## CRUD Operation Flow

### Create
```
User Input → Form Validation → Service.create() → 
Firestore.addDoc() → Document Created → Update UI
```

### Read
```
Page Load → Get User ID → Service.getAll(userId) → 
Firestore Query → Return Data → Display in Table
```

### Update
```
User Edit → Form Validation → Service.update(id, data) → 
Firestore.updateDoc() → Document Updated → Refresh UI
```

### Delete
```
User Confirm → Service.delete(id) → 
Firestore.deleteDoc() → Document Removed → Update List
```

---

## Firebase Collections Relationship

```
users/{uid}
    │
    ├── owns many
    │
    ├────── customers/{customerId}
    │           │
    │           └── referenced by
    │
    ├────── invoices/{invoiceId}
    │           │
    │           ├── customerId → customers/{id}
    │           │
    │           └── referenced by
    │
    ├────── payments/{paymentId}
    │           │
    │           ├── invoiceId → invoices/{id}
    │           └── customerId → customers/{id}
    │
    ├────── products/{productId}
    │
    └────── settings/{settingsId}
```

---

## Security Rules Flow

```
Request to Firestore
        │
        ▼
┌───────────────────────┐
│ Is user authenticated?│
└───────┬───────────────┘
        │
        ├──────────┐
        │          │
       YES         NO
        │          │
        ▼          ▼
┌──────────────┐ ┌──────────────┐
│ Check userId │ │  DENIED      │
│ matches auth │ │  (unauth)    │
└──────┬───────┘ └──────────────┘
       │
       ├──────────┐
       │          │
      MATCH      NO MATCH
       │          │
       ▼          ▼
┌──────────────┐ ┌──────────────┐
│  ALLOWED     │ │  DENIED      │
│  (access)    │ │  (wrong user)│
└──────────────┘ └──────────────┘
```

---

## State Management Architecture

```
┌─────────────────────────────────────────┐
│           Component Tree                │
│                                         │
│  layout.tsx                             │
│    └── AuthProvider                     │
│         └── login/signup/dashboard      │
│              └── useAuth() hook         │
│                  - isAuthenticated       │
│                  - user                  │
│                  - loading               │
│                  - login()               │
│                  - register()            │
│                  - logout()              │
└─────────────────────────────────────────┘

Global State (AuthContext):
  ├─ Firebase User (auth)
  ├─ App User (Firestore)
  ├─ Authentication status
  └─ Loading state

Local State (Components):
  ├─ Form data
  ├─ UI state (modals, filters)
  ├─ Table data
  └─ Loading/Error states
```

---

## Environment Configuration

```
.env.local (Local Development)
    │
    ├── NEXT_PUBLIC_FIREBASE_API_KEY
    ├── NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
    ├── NEXT_PUBLIC_FIREBASE_PROJECT_ID
    ├── NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    ├── NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
    ├── NEXT_PUBLIC_FIREBASE_APP_ID
    └── NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
    │
    ▼
Used by: src/lib/firebase.ts
    │
    ▼
Initializes: Firebase App Instance
    │
    ├── Authentication Service
    └── Firestore Database
```

---

**This architecture ensures:**
✅ Secure authentication  
✅ User-specific data isolation  
✅ Scalable structure  
✅ Type safety with TypeScript  
✅ Real-time updates capability  
✅ Clean separation of concerns  
