# YTMP3 — Setup Guide

## Why does this need a server?
Netlify/Cobalt can't do the conversion because browsers block it for security reasons.
Railway gives you a FREE real server that runs yt-dlp — same as MP3Juice behind the scenes.

---

## STEP 1 — Download & extract the zip
Extract the zip you downloaded. You'll have a folder called `ytmp3-railway` with these files:
- server.js
- package.json
- nixpacks.toml
- .gitignore
- public/index.html

---

## STEP 2 — Create a free GitHub account
Go to: https://github.com
Sign up for free if you don't have an account.

---

## STEP 3 — Upload the project to GitHub
1. Go to https://github.com/new
2. Repository name: `ytmp3`
3. Set it to **Private**
4. Click **Create repository**
5. Click **uploading an existing file**
6. Drag ALL the files from your `ytmp3-railway` folder into the page
   ⚠️ Make sure to also include the `public` folder with `index.html` inside
7. Click **Commit changes**

---

## STEP 4 — Create a free Railway account
Go to: https://railway.app
Click **Login with GitHub** — use the same GitHub account

---

## STEP 5 — Deploy on Railway
1. Click **New Project**
2. Click **Deploy from GitHub repo**
3. Select your `ytmp3` repo
4. Railway will automatically detect and deploy it ✅
5. Wait ~2 minutes for it to build

---

## STEP 6 — Get your URL
1. Click on your project in Railway
2. Click **Settings** → **Networking** → **Generate Domain**
3. You'll get a URL like: `ytmp3-production.up.railway.app`
4. Open that URL — your site works! 🎉

---

## Done!
Paste any YouTube link → hit CONVERT → MP3 downloads directly.
Share the URL with anyone — it works for everyone!
