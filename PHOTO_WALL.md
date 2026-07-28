# Photo wall setup (same idea as Alaina’s birthday)

The photo wall is built into the site. It stays disabled until Firebase is connected.

## What you need to do

### 1. Create / open a Firebase project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a project (or reuse Alaina’s if you want — separate project is cleaner)
3. Free **Spark** plan is fine

### 2. Enable the services
1. **Authentication** → Sign-in method → enable **Anonymous**
2. **Firestore Database** → Create database → start in **production** mode
3. **Storage** → Get started → start in **production** mode

### 3. Add a Web app
1. Project settings → Your apps → **Web**
2. Register the app
3. Copy the config values

### 4. Create a local `.env`
From the project folder:

```powershell
Copy-Item .env.example .env
```

Paste your Firebase values into `.env`.

### 5. Publish security rules
**Firestore → Rules** — paste contents of `firestore.rules`, then **Publish**.

**Storage → Rules** — paste contents of `storage.rules`, then **Publish**.

### 6. Add GitHub Actions secrets (for the live site)
Repo → **Settings → Secrets and variables → Actions** → add:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`

### 7. Push / redeploy
After secrets are set, push to `main` (or re-run the deploy workflow). Guests can then upload photos on the live site with no login.

## Local test

```powershell
npm run dev
```

Upload a photo on the Photo Wall section. It should appear in a polaroid grid for everyone.

## Notes
- No guest accounts — anonymous auth happens in the background (like Alaina’s site)
- Guests can remove photos they uploaded on that same phone/browser
- Max photo size: 8MB
