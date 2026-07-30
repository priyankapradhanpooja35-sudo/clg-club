# 🎬 BEC Club Hub — Demo Day Script (4 Minutes)

> **Judges Presentation Walkthrough**  
> Use this click-by-click script during your live presentation to demonstrate all key modules smoothly in under 4 minutes.

---

## ⏰ Timeline & Step-by-Step Flow

### 0:00 – 0:45 | 1. Landing Page & First Impression
1. **Hero & Aesthetics**: Open `http://localhost:3000` (or live Vercel URL). Point out the **Deep Indigo & Electric Violet SaaS design**, modern geometric typography, and glassmorphism.
2. **Campus Pulse Widget**: Show the live **Campus Pulse** animated widget displaying real-time active student numbers.
3. **Animated Counters**: Scroll to the stats section showing dynamic counts (8 Clubs, 30+ Members, 13 Events).
4. **Interactive Clubs Grid**: Hover over club cards (Microsoft, Music & Dance, Placement, etc.) showing custom per-club brand icons and color gradients.

---

### 0:45 – 1:30 | 2. Student Experience (Discover, Join, Register)
1. **Student Login**: Click **Login** → Enter `priya.patel@bec.edu.in` / `student123`.
2. **Student Dashboard**: Point out the **Engagement Score Badge (180 pts)** and the personalized **"Recommended for You" AI Smart Match** section (*"Because you joined Microsoft Club..."*).
3. **Join a Club**: Click **Clubs** in navbar → Search for `"Placement Club"` → Click **Join Club** (instant Toast notification).
4. **Register for Event**: Click **Events** → Click **Register Now** on *Azure Cloud & AI Workshop* → Confetti animation triggers 🎉.

---

### 1:30 – 2:30 | 3. QR Ticket & Auto-Generated PDF Certificate
1. **QR Ticket**: Go to **My Hub → QR Tickets** (`/dashboard/student/tickets`). Show the rendered **QR code ticket** with unique token `bec-reg-demo-1`.
2. **Downloadable PDF Certificate**: Click **Download Certificate** on a completed event. Open the auto-generated PDF showing student name, event title, BEC official seal, and verification QR code.

---

### 2:30 – 3:30 | 4. Enterprise Admin Panel & Live Organizer Check-in
1. **Switch to Admin View**: Click user avatar in top bar → Select **View as Admin** (or login as `admin@bec.edu.in` / `admin123`).
2. **Overview Analytics**: Highlight the KPI cards (sparklines & growth trends), **Recharts member growth line chart**, and **Club Activity bar chart**.
3. **Organizer QR Check-in**: Go to **Club Head Panel → QR Scanner** (`/dashboard/club-head/scan`). Click **Scan Ticket #1**. Show instant green verification card, engagement score bonus (+10 pts), and celebratory confetti explosion.
4. **Data Tables & Filters**: Open **Clubs Management** or **Members Directory** — demonstrate live search, column sorting, pagination, and one-click **CSV export**.

---

### 3:30 – 4:00 | 5. Gamification Leaderboard & Wrap Up
1. **Campus Leaderboard**: Open **Leaderboard** (`/leaderboard`). Show 🥇, 🥈, 🥉 rank badges and student achievement badges (*"First Event"*, *"Club Explorer"*, *"Top Contributor"*).
2. **Close**: Emphasize that the system is fully production-ready, TypeScript type-safe across 40 routes, mobile-responsive, and deployed live on Vercel.

---

## 🔑 Demo Credentials Cheat Sheet

| Role | Email | Password | Quick Test Purpose |
|---|---|---|---|
| **Admin** | `admin@bec.edu.in` | `admin123` | Control center, charts, logs, reports |
| **Club Head** | `head.microsoftclub@bec.edu.in` | `head123` | Member approvals, Kanban tasks, QR scanner |
| **Student** | `priya.patel@bec.edu.in` | `student123` | Event registration, tickets, certificates |

---

## ⚡ Fallback Plan
- If wifi is slow: use local server `npm run dev` at `http://localhost:3000`.
- All demo data is pre-seeded via `npm run seed`.
