# 📅 Appointment Booking Website

A beautiful, fully static appointment booking page — no backend, no database, no sign-ups. Share the link and let people book time with you. You get notified via email.

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![EmailJS](https://img.shields.io/badge/EmailJS-orange?style=flat)

---

## ✨ Features

### 📅 Interactive Calendar
- Color-coded days — free, taken, blocked, maybe, important
- Auto-marks weekends as free
- Exam mode: auto-blocks days before exams (7 days orange, 14 days yellow)
- Availability meter shows how free you are this month
- Click any day to see details or book it
- Optional Google Calendar embed

### 📝 Appointment Booking
- Visitors fill in name, date, time, location, and pick a tag
- Fun captcha system (emoji puzzles + hard mode for blocked dates)
- Generates a `.ics` calendar file for the visitor to import
- Cooldown timer prevents spam submissions
- You get an email notification with all the details

### 💬 Message Board (Chat)
- Visitors can leave messages without an account
- You add replies through `config.js` — they appear as owner messages
- Email notification for every new message

### 📌 Notice Board
- Post announcements and updates
- Pin important notices to the top
- Exam dates auto-generate notices

### 🍽️ Favorite Places
- Showcase your go-to hangout spots
- Visitors can reference them when booking
- Filterable by tag (Food, Study, Movie, etc.)
- Google Maps links supported

### 🎨 Design
- Light/dark theme toggle with smooth transitions
- Glassmorphism UI with animated background blobs
- Fully responsive — works on mobile, tablet, desktop
- Micro-animations and hover effects throughout

---

## 🚀 Quick Start

### 1. Clone the repo

```bash
git clone https://github.com/AnnaNutzz/50-Days-50-Projects.git
cd "24 appointment website"
```

### 2. Create your config

```bash
cp js/config.example.js js/config.js
```

### 3. Edit `js/config.js`

Open `js/config.js` and fill in your details:

```js
owner: {
  name: "Your Name",
  tagline: "Your tagline ✨",
  email: "you@gmail.com",
},
```

### 4. Open `index.html` in a browser

That's it! No build tools, no `npm install`, no server needed.

---

## 📧 Email Notifications Setup (EmailJS)

This app uses [EmailJS](https://www.emailjs.com) to send you email notifications when someone books an appointment or sends a chat message. It's free for up to 200 emails/month.

### Step 1: Create an EmailJS Account
1. Go to [emailjs.com](https://www.emailjs.com) and sign up
2. Connect your Gmail (or other email) under **Email Services**
3. Note down your **Service ID** (e.g., `service_abc1234`)

### Step 2: Create Email Templates

You need **two** templates:

#### Appointment Template
Create a template with these variables:

| Variable | Description |
|---|---|
| `{{from_name}}` | Name of the person booking |
| `{{date}}` | Appointment date |
| `{{time}}` | Appointment time |
| `{{location}}` | Location name |
| `{{location_link}}` | Google Maps link |
| `{{good_about}}` | What's good about the place |
| `{{tag}}` | Appointment type (Study, Food, etc.) |
| `{{to_email}}` | Your email |

#### Chat Template
Create a second template with these variables:

| Variable | Description |
|---|---|
| `{{from_name}}` | Name of the sender |
| `{{message}}` | The chat message |
| `{{to_email}}` | Your email |
| `{{timestamp}}` | When it was sent |

### Step 3: Get Your Public Key
Go to **Account** → **API Keys** and copy your public key.

### Step 4: Update `config.js`

```js
emailjs: {
  serviceId: "service_abc1234",
  appointmentTemplateId: "template_xyz5678",
  chatTemplateId: "template_chat9012",
  publicKey: "your_public_key_here",
},
```

> **Note:** If EmailJS is not configured, the app still works — notifications are simulated in the console.

---

## 🎨 Customization

Everything is controlled from `js/config.js`. No code changes needed.

### Dates & Availability

```js
dates: {
  "2026-08-15": { status: "important", reason: "Independence Day 🇮🇳" },
  "2026-08-20": { status: "blocked",   reason: "Family event" },
  "2026-09-05": { status: "taken",     reason: "Meeting with Prof. X" },
  "2026-09-12": { status: "maybe",     reason: "Might be travelling" },
  "2026-08-01": { status: "free",      reason: "Cleared my schedule!" },
},
```

| Status | Color | Bookable? | Meaning |
|---|---|---|---|
| `free` | 🟢 Green | Yes | Explicitly free |
| `available` | ⚪ Default | Yes | Normal weekday (auto) |
| `taken` | 🔵 Blue | No | Already booked |
| `maybe` | 🟡 Yellow | Yes (with warning) | Could change for emergency |
| `blocked` | 🟠 Orange | No | Not available |
| `important` | 🔴 Red | No | Important event |

### Exams

```js
exams: [
  { date: "2026-10-05", name: "Midterm Physics" },
  { date: "2026-11-20", name: "Final Chemistry" },
],
```

Days before an exam are automatically marked:
- **Exam day** → 🔴 Important
- **1–7 days before** → 🟠 Blocked
- **8–14 days before** → 🟡 Maybe

### Favorite Places

```js
favoritePlaces: [
  {
    name: "The Study Cafe",
    link: "https://maps.google.com/...",
    goodAbout: "Great Wi-Fi, quiet corners ☕",
    tags: ["Study Session", "Food"],
  },
],
```

### Appointment Tags

```js
tags: [
  { name: "Study Session", emoji: "📚", caption: "Let's study together!" },
  { name: "Food",          emoji: "🍽️", caption: null },
  { name: "Emergency",     emoji: "🚨", caption: "Describe the emergency." },
],
```

### Notice Board

```js
notices: [
  {
    date: "2026-07-27",
    text: "Welcome to my appointment page! 🎉",
    pinned: true,
  },
],
```

### Owner Chat Replies

```js
ownerReplies: [
  {
    timestamp: "2026-07-27T10:00:00",
    text: "Hey! Thanks for visiting 💬",
  },
],
```

### Google Calendar Embed

```js
// Set to your Google Calendar embed URL, or null to hide
googleCalendarEmbedUrl: "https://calendar.google.com/calendar/embed?src=YOUR_ID",
```

---

## 📁 Project Structure

```
📦 appointment-website
├── index.html              # Main page (single-page app)
├── favicon.png             # Site favicon
├── .gitignore              # Ignores config.js (private data)
│
├── css/
│   └── styles.css          # All styles (themes, animations, layout)
│
└── js/
    ├── config.example.js   # Template config (committed to git)
    ├── config.js           # YOUR config (git-ignored, private)
    ├── app.js              # Main controller, tabs, theme toggle
    ├── calendar.js         # Calendar rendering & navigation
    ├── appointments.js     # Booking form, validation, .ics export
    ├── chat.js             # Message board with localStorage
    ├── notifications.js    # EmailJS integration
    ├── captcha.js          # Fun + hard captcha system
    ├── noticeboard.js      # Notice board rendering
    ├── places.js           # Favorite places rendering
    └── utils.js            # Date helpers, status logic, toast
```

---

## 🌐 Deployment

This is a **fully static site** — no server, no build step. Deploy anywhere that hosts static files.

### GitHub Pages (Recommended — Free)

1. Push your code to GitHub
2. Go to **Settings** → **Pages**
3. Set source to your branch (e.g., `main`) and folder (`/`)
4. Your site will be live at `https://yourusername.github.io/repo-name/`

> ⚠️ **Important:** `config.js` is git-ignored. You'll need to either:
> - Remove it from `.gitignore` and commit it (EmailJS keys are client-side by design), or
> - Manually upload it to the deployed environment

### Other Options

| Platform | Free Tier | Notes |
|---|---|---|
| [GitHub Pages](https://pages.github.com) | ✅ Unlimited | Best for static sites |
| [Vercel](https://vercel.com) | ✅ Yes | Drag & drop or Git integration |
| [Netlify](https://netlify.com) | ✅ Yes | Drag & drop or Git integration |
| [Cloudflare Pages](https://pages.cloudflare.com) | ✅ Yes | Fast global CDN |

---

## 🔒 Privacy & Security

- **No backend/database** — all visitor data stays in their own browser (`localStorage`)
- **No accounts required** — visitors don't need to sign up
- **`config.js` is git-ignored** — your personal details aren't committed
- **EmailJS public keys** are designed for client-side use — protect them with [domain restrictions](https://www.emailjs.com/docs/user-guide/security/) in your EmailJS dashboard
- **Captcha system** prevents spam — fun emoji puzzles for normal dates, hard phrase-typing for blocked dates

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| HTML5 | Structure |
| CSS3 | Styling, themes, animations |
| Vanilla JavaScript | All logic (no frameworks) |
| [EmailJS](https://emailjs.com) | Email notifications (client-side) |
| localStorage | Visitor data persistence |

**Zero dependencies. No `npm install`. No build step. Just open and go.**

---

## 📄 License

Feel free to use this for your own appointment page! Give it a ⭐ if you found it useful.
