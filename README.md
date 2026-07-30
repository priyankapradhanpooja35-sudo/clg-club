# 🏛️ BEC Club Hub

> **Production-quality Club Management System for Bhubaneswar Engineering College (BEC)**  
> Built for Ayush Technologies Hackathon — Problem Statement 11

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/bec-club-hub)

---

## ✨ Features

| Module | Description |
|---|---|
| 🔐 **Auth & Roles** | JWT + bcrypt, httpOnly cookies, 5 roles: Student, Club Head, Faculty, Admin, Guest |
| 🏛️ **Club Management** | 8 fully-branded clubs with profiles, hierarchy, and member management |
| 📅 **Event Management** | Create, approve, publish events with countdown, QR registration |
| 🎟️ **QR Check-in** | Unique QR per registration, camera-based scanner for organizers |
| 📊 **Analytics Dashboards** | Role-specific dashboards with Recharts (AreaChart, BarChart, PieChart) |
| 📋 **Kanban Tasks** | Club-internal task board (To-do / In-progress / Done) |
| 📢 **Announcements** | Priority-tagged notice board (General / Urgent) |
| 🏆 **Gamification** | Engagement score that increases on event attendance, visible on profile |
| 🔍 **Search & Filter** | Global search for clubs, events, members |
| 📄 **Certificate Generator** | Auto-generate PDF certificates for event attendees |
| 🌐 **Landing Page** | Animated hero, stats counters, events carousel, Campus Pulse widget |

---

## 🎨 Design System

- **Colors**: Deep Indigo `#1E1B4B`, Electric Violet `#7C3AED`, Soft White `#F8FAFC`
- **Typography**: Inter (Google Fonts)
- **Effects**: Glassmorphism cards, gradient accents, hover-lift animations (Framer Motion)
- **Responsive**: Mobile-first, fully responsive on all screen sizes

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS v4, Framer Motion |
| Icons | Lucide React |
| Charts | Recharts |
| Backend | Next.js API Routes |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcrypt (httpOnly cookies) |
| QR | qrcode + html5-qrcode |
| PDF | jsPDF |

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- npm

### 1. Clone the repository
```bash
git clone https://github.com/your-username/bec-club-hub.git
cd bec-club-hub
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
```bash
cp .env.example .env.local
```
Edit `.env.local` with your values:
```
MONGODB_URI=mongodb://localhost:27017/bec-club-hub
JWT_SECRET=your-super-secret-jwt-key
```

### 4. Seed the database
```bash
node seed.js
```
This creates:
- ✅ Admin account: `admin@bec.edu.in` / `admin123`
- ✅ 8 Club Head accounts: `head.microsoftclub@bec.edu.in` / `head123`
- ✅ 20 Student accounts: `priya.patel@bec.edu.in` / `student123`
- ✅ All 8 clubs with full branding
- ✅ 8 upcoming events
- ✅ Announcements and memberships

### 5. Start the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 🌍 Deploy on Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and click **New Project**
3. Import your GitHub repository
4. Add environment variables:
   - `MONGODB_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a secure random string
5. Click **Deploy**

> **Note**: Use [MongoDB Atlas](https://mongodb.com/atlas) for a free cloud database on Vercel.

---

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # REST API routes
│   │   ├── auth/          # Login, register, logout, me
│   │   ├── clubs/         # Club CRUD
│   │   ├── events/        # Event CRUD
│   │   ├── members/       # Join requests, approvals
│   │   ├── registrations/ # Event registration & QR check-in
│   │   ├── announcements/ # Notice board
│   │   ├── tasks/         # Kanban tasks
│   │   └── stats/         # Platform stats
│   ├── dashboard/         # Role-based dashboards
│   │   ├── admin/
│   │   ├── club-head/
│   │   └── student/
│   ├── login/             # Auth pages
│   ├── signup/
│   ├── forgot-password/
│   └── clubs/             # Public club pages
├── components/
│   ├── ui/                # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── Toast.tsx
│   │   ├── Badge.tsx
│   │   ├── Avatar.tsx
│   │   ├── Skeleton.tsx
│   │   └── EmptyState.tsx
│   ├── Navbar.tsx
│   └── Sidebar.tsx
├── lib/
│   ├── auth.ts            # JWT utilities
│   ├── mongodb.ts         # DB connection
│   ├── AuthContext.tsx    # React auth context
│   └── clubs-data.ts      # Static club branding data
└── models/                # Mongoose schemas
    ├── User.ts
    ├── Club.ts
    ├── Event.ts
    ├── Registration.ts
    ├── Membership.ts
    ├── Announcement.ts
    └── Task.ts
```

---

## 🧑‍💻 Demo Credentials

| Role | Email | Password |
|---|---|---|
| Admin | admin@bec.edu.in | admin123 |
| Club Head (Microsoft) | head.microsoftclub@bec.edu.in | head123 |
| Student | priya.patel@bec.edu.in | student123 |

---

## 🏆 Unique Features

- **Campus Pulse Widget** — Live animated indicator showing platform activity
- **Gamification** — Engagement score increases on event check-in
- **AI Recommendations** — Rule-based event suggestions based on club membership
- **QR Check-in Flow** — Complete registration → QR generation → camera scan → check-in
- **Certificate Generator** — One-click PDF certificate for event attendees
- **Kanban Task Board** — Drag-to-update club internal task management

---

*Built with ❤️ for BEC by Team [Your Team Name] — Ayush Technologies Hackathon 2024*
