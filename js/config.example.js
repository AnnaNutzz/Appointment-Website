// ============================================================
//  🔧 CONFIG TEMPLATE
//
//  SETUP INSTRUCTIONS:
//  1. Copy this file:  config.example.js  →  config.js
//  2. Edit config.js with YOUR real info (name, email, dates)
//  3. config.js is in .gitignore — it will NOT be pushed to GitHub
//
//  ⚠️  DO NOT put your real info in this file!
//      This file IS committed to git and visible to everyone.
//      Only edit the copy (config.js).
// ============================================================

const CONFIG = {

  // ──────────────────────────────────────────────────
  //  👤 YOUR INFO
  // ──────────────────────────────────────────────────
  owner: {
    name: "Your Name",                    // ← Change to your name
    tagline: "Too busy, but never too busy for you ✨",  // ← Shown under your name
    email: "you@gmail.com",               // ← Your email for notifications
  },

  // ──────────────────────────────────────────────────
  //  📧 EMAIL NOTIFICATIONS (EmailJS)
  //  Sign up free at https://www.emailjs.com
  //  1. Create an account & connect your Gmail
  //  2. Create an email template with variables:
  //     {{from_name}}, {{date}}, {{time}}, {{location}},
  //     {{location_link}}, {{good_about}}, {{tag}}, {{message}}
  //  3. Paste your IDs below
  // ──────────────────────────────────────────────────
  emailjs: {
    serviceId: "YOUR_SERVICE_ID",         // ← From EmailJS dashboard
    appointmentTemplateId: "YOUR_APPT_TEMPLATE_ID",  // ← Template for appointments
    chatTemplateId: "YOUR_CHAT_TEMPLATE_ID",         // ← Template for chat messages
    publicKey: "YOUR_PUBLIC_KEY",          // ← From EmailJS Account > API Keys
  },

  // ──────────────────────────────────────────────────
  //  📅 GOOGLE CALENDAR EMBED (optional)
  //  Go to Google Calendar > Settings > your calendar
  //  > "Integrate calendar" > copy the embed URL
  //  Set to null to hide the Google Calendar section
  // ──────────────────────────────────────────────────
  googleCalendarEmbedUrl: null, // "https://calendar.google.com/calendar/embed?src=YOUR_ID",

  // ──────────────────────────────────────────────────
  //  📆 DATE OVERRIDES
  //  Set specific dates with a status and optional reason.
  //
  //  Statuses:
  //    "important" → Red — Very important, taken (locked)
  //    "blocked"   → Orange — Absolutely not (locked)
  //    "maybe"     → Yellow — No, but could change for emergency
  //    "taken"     → Blue — Date is booked
  //    "free"      → Green — Explicitly free
  //
  //  Format: "YYYY-MM-DD": { status: "...", reason: "..." }
  //  The reason is optional (shown on the notice board if provided)
  // ──────────────────────────────────────────────────
  dates: {
    "2026-08-15": { status: "important", reason: "Independence Day celebration 🇮🇳" },
    "2026-08-20": { status: "blocked",   reason: "Family event" },
    "2026-09-05": { status: "taken",     reason: "Meeting with Prof. X" },
    "2026-09-12": { status: "maybe",     reason: "Might be travelling" },
    "2026-08-01": { status: "free",      reason: "Cleared my schedule!" },
    // Add more dates below ↓
  },

  // ──────────────────────────────────────────────────
  //  📝 EXAMS
  //  For each exam, the 7 days before it will be marked
  //  ORANGE (blocked), and days 8–14 before will be YELLOW (maybe).
  //  The exam day itself is marked RED (important).
  //
  //  Format: { date: "YYYY-MM-DD", name: "Exam Name" }
  // ──────────────────────────────────────────────────
  exams: [
    { date: "2026-10-05", name: "Midterm Physics" },
    { date: "2026-11-20", name: "Final Chemistry" },
    // Add more exams below ↓
  ],

  // ──────────────────────────────────────────────────
  //  🍽️ FAVORITE PLACES
  //  These appear in the "Favorite Places" tab.
  //  Visitors can reference them when booking.
  //
  //  Format: { name: "...", link: "..." or null, goodAbout: "..." }
  // ──────────────────────────────────────────────────
  favoritePlaces: [
    {
      name: "The Study Cafe",
      link: "https://maps.google.com",
      goodAbout: "Great Wi-Fi, quiet corners, excellent coffee ☕",
      tags: ["Study Session", "Food"],
    },
    {
      name: "Central Park",
      link: null,
      goodAbout: "Fresh air, walking paths, peaceful vibes 🌳",
      tags: ["Walk", "Event"],
    },
    {
      name: "Mall Cinema",
      link: "https://maps.google.com",
      goodAbout: "IMAX screen, comfortable seats, great popcorn 🍿",
      tags: ["Movie", "Food", "Shopping"],
    },
    {
      name: "Downtown Food Street",
      link: "https://maps.google.com",
      goodAbout: "Amazing variety of cuisines, vibrant atmosphere 🍜",
      tags: ["Food", "Walk"],
    },
    // Add more places below ↓
  ],

  // ──────────────────────────────────────────────────
  //  📌 NOTICE BOARD
  //  Announcements shown on the Notice Board tab.
  //  Sorted by date, most recent first.
  //
  //  Format: { date: "YYYY-MM-DD", text: "...", pinned: true/false }
  //  Set pinned: true to keep it at the top
  // ──────────────────────────────────────────────────
  notices: [
    {
      date: "2026-07-27",
      text: "Welcome to my appointment page! 🎉 Feel free to book a slot.",
      pinned: true,
    },
    {
      date: "2026-08-15",
      text: "Independence Day — I'll be at the parade! No appointments.",
      pinned: false,
    },
    {
      date: "2026-10-05",
      text: "Exam season starts — please avoid booking around this time.",
      pinned: false,
    },
    // Add more notices below ↓
  ],

  // ──────────────────────────────────────────────────
  //  🏷️ APPOINTMENT TAGS
  //  Available tags for appointment types.
  //  The "caption" is shown when the tag is selected.
  //  Set caption to null for no extra message.
  // ──────────────────────────────────────────────────
  tags: [
    {
      name: "Study Session",
      emoji: "📚",
      caption: "I don't need to have the same subject as you to study with you, or I can just study your subject with you or help in research!",
    },
    { name: "Food",          emoji: "🍽️", caption: null },
    { name: "Shopping",      emoji: "🛍️", caption: null },
    { name: "Movie",         emoji: "🎬", caption: null },
    { name: "Walk",          emoji: "🚶", caption: null },
    { name: "Event",         emoji: "🎉", caption: null },
    { name: "Emergency",     emoji: "🚨", caption: "Please describe the emergency in the notes." },
  ],

  // ──────────────────────────────────────────────────
  //  🔒 CAPTCHA & COOLDOWN SETTINGS
  // ──────────────────────────────────────────────────
  captchaCooldownMinutes: 5,   // Minutes between appointment submissions
  funCaptchaTimeLimit: 30,     // Seconds to solve the fun captcha
  hardCaptchaTimeLimit: 60,    // Seconds to solve the hard captcha

  // ──────────────────────────────────────────────────
  //  🎨 OWNER REPLIES IN CHAT
  //  Pre-set replies that appear in the chat.
  //  Visitors see these as your responses.
  //
  //  Format: { timestamp: "ISO date", text: "..." }
  // ──────────────────────────────────────────────────
  ownerReplies: [
    {
      timestamp: "2026-07-27T10:00:00",
      text: "Hey! Thanks for visiting. Drop me a message and I'll get back to you via email! 💬",
    },
    // Add replies below ↓
  ],
};
