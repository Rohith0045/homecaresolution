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

## ✅ Post-Deployment Checks
- Once complete, Firebase will display a **Hosting URL** (e.g., `https://your-project.web.app`).
- Opening that URL will load your beautiful new glassmorphism site connected to **Supabase**.
- Any `/api/create-order` or verification posts triggered on Checkout will automatically proxy through to Cloud Functions flawlessly!
