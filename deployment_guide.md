# Firebase Deployment Guide - Home Care Harmony

Your project is fully configured for Firebase Hosting (React frontend) and Firebase Functions (Node.js Razorpay API backend). 

Since Firebase deployment requires browser-based authentication, please run the following steps in your local terminal window:

---

## 📋 Prerequisites
Ensure you have the Firebase CLI installed. If not, run:
```bash
npm install -g firebase-tools
```

---

## 🚀 Deployment Steps

### 1. Login to Firebase
In your terminal, run:
```bash
firebase login
```
*This will open a browser window to authenticate with your Google/Firebase account.*

### 2. Initialize / Link Project
To connect your folder with a Firebase project, run:
```bash
firebase use --add
```
*Select your existing Firebase project from the list, or create one first at [console.firebase.google.com](https://console.firebase.google.com).*

### 3. Setup Environment Variables (Critical for Razorpay)
Your Cloud Function needs your Razorpay credentials securely. Run these commands:
```bash
firebase functions:config:set razorpay.key_id="YOUR_RAZORPAY_KEY_ID" razorpay.key_secret="YOUR_RAZORPAY_KEY_SECRET"
```
*(Replace placeholders with your real `.env` secrets)*

### 4. Deploy EVERYTHING
Deploy both hosting static bundles (`dist/`) and endpoints (`functions/`):
```bash
firebase deploy
```

---

## 🚀 Option A: Deploying via Firebase (Standard)
*Follow instructions above for Full Firebase hosting + Functions setup*

---

## 🚀 Option B: Deploying via Supabase Edge Functions (Best for Stack Sync)

Alternatively, if you want to keep your **Razorpay API** running inside your **Supabase Backend** (Deno Edge Functions), run these commands:

### 1. Link your Supabase Project
```bash
npx supabase link --project-ref YOUR_PROJECT_REF
```
*(Find your Project Ref in Supabase Dashboard -> Project Settings)*

### 2. Set Razorpay Secrets in Supabase Vault
```bash
npx supabase secrets set RAZORPAY_KEY_ID="YOUR_KEY" RAZORPAY_KEY_SECRET="YOUR_SECRET"
```

### 3. Deploy functions
```bash
npx supabase functions deploy create-razorpay-order --no-verify-jwt
npx supabase functions deploy verify-razorpay-payment --no-verify-jwt
```

---

## ✅ Verification
Regardless of Option A or B, once your deployment pushes, checking out with Razorpay will route flawlessly securely without leaking secret credentials.
