# Ozy Marketplace

> The best Roblox random marketplace. Made by **Ozyrion** (@coolck0106 on Discord).

## Features

- 🔐 Email-based login (no passwords — users save their own email)
- 🎮 List Roblox items with title, description, price, category, condition, image, and tags
- 💬 Discord-based trading — buyers DM sellers directly
- 🔍 Search & filter by category, sort by date/price/bumps
- 📈 Bump listings to top
- 👁 View count tracking
- 🗑 Delete your own listings
- 📱 Fully responsive

## Tech Stack

- **Next.js 14** (App Router, TypeScript)
- **CSS Modules** (no UI library, pure custom styling)
- **localStorage** (client-side persistence — no backend needed)

---

## Deploy to Vercel via GitHub

### 1. Push to GitHub

```bash
cd ozy-marketplace
git init
git add .
git commit -m "Initial commit – Ozy Marketplace"
gh repo create ozy-marketplace --public --push
# or manually create repo on github.com and push
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and log in
2. Click **"Add New Project"**
3. Import your `ozy-marketplace` GitHub repo
4. Vercel auto-detects Next.js — click **Deploy**
5. Done! Your site is live at `ozy-marketplace.vercel.app`

### 3. Custom Domain (optional)

In Vercel project settings → **Domains** → add your domain.

---

## Local Development

```bash
npm install
npm run dev
# Open http://localhost:3000
```

---

## Notes

- All data is stored in **localStorage** — it lives in the user's browser.
- No backend or database required.
- To add a real database later, replace `src/lib/storage.ts` with API calls.

---

*Made with ❤️ by Ozyrion · @coolck0106*
