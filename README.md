# PassDrivingTest.ie — Step-by-Step Guide

This is your website's full project, ready to upload to GitHub and go live.

## Part 1 — Get it on GitHub

1. Unzip the file I gave you. You should see a folder with things like
   `package.json`, `index.html`, and a `src` folder inside.
2. Go to [github.com](https://github.com) and log in.
3. Click the **+** icon (top right) → **New repository**.
4. Name it `passdrivingtest` → leave everything else as default → click
   **Create repository**.
5. On the next page, click **uploading an existing file**.
6. Drag the **whole unzipped folder's contents** (not the zip itself — the
   files and folders inside it) into the upload box.
7. Scroll down, click the green **Commit changes** button.

That's it — your code is now on GitHub.

## Part 2 — Make it live with Vercel

1. Go to [vercel.com](https://vercel.com) and click **Sign Up**.
2. Choose **Continue with GitHub** and approve the connection.
3. Click **Add New... → Project**.
4. Find your `passdrivingtest` repository in the list and click **Import**.
5. Vercel will detect it's a Vite project automatically. Don't change any
   settings — just click **Deploy**.
6. Wait about a minute. You'll get a live link like
   `passdrivingtest.vercel.app` — click it. Your site is now live on the
   internet.

## Part 3 — Connect your real domain (passdrivingtest.ie)

1. In your Vercel project, click **Settings → Domains**.
2. Type `passdrivingtest.ie` and click **Add**.
3. Vercel will show you one or two DNS records (usually an "A record" and/or
   a "CNAME record").
4. Log into wherever you bought your domain (e.g. Blacknight, GoDaddy,
   Namecheap) and find **DNS settings** or **DNS management**.
5. Add the records Vercel showed you, exactly as shown.
6. Wait 10 minutes to a few hours (this is normal — DNS takes time). Then
   `passdrivingtest.ie` will show your site directly.

You only do Parts 1–3 once. After this, every change you make just needs
Part 4 below.

## Part 4 — Changing simple details later (phone number, prices, etc.)

You do **not** need to reinstall anything or use your computer's terminal
for small text changes. Do it straight on the GitHub website:

1. Go to your repository on github.com.
2. Click into the `src` folder, then click on **`siteConfig.js`**.
3. Click the **pencil icon** (top right of the file) to edit it.
4. Change whatever you need — for example:
   - Your phone number
   - Your WhatsApp number
   - Your email
   - Lesson prices
5. Scroll down, click **Commit changes**.
6. That's it. Vercel notices the change automatically and updates your live
   site within about a minute — no extra steps needed.

**Only use `siteConfig.js` for these simple details.** Everything else
(colours, layout, the flashcards, page text) lives in `src/App.jsx` — you
can edit that the same way (pencil icon → change text → Commit changes),
just be a little more careful there since it's the actual code, not just a
list of details.

## If something looks broken after an edit

Go to your GitHub repository → click **Commits** (near the top) → find the
change you just made → click the **"< >"** revert-style icon, or simply
edit the file again and put the original text back. Nothing is ever lost —
GitHub keeps every past version.

## Quick reference

| I want to... | Do this |
|---|---|
| Change phone/WhatsApp/email/prices | Edit `src/siteConfig.js` on github.com, commit |
| Change wording/colours/layout | Edit `src/App.jsx` on github.com, commit |
| See my site update | Wait ~1 minute after committing, refresh the site |
| Make it an iOS/Android app later | Ask me — the project is already structured for Capacitor |
