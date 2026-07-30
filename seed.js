/**
 * BEC Club Hub — Seed Script
 * Run: node seed.js
 *
 * Seeds: 8 clubs, 1 admin, 8 club heads, 20 students, sample events, announcements, memberships
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bec-club-hub';

// ─── Schemas (duplicated from models for standalone script) ──────────────────
const userSchema = new mongoose.Schema({ name: String, email: String, password: String, role: String, engagementScore: { type: Number, default: 0 }, clubId: mongoose.Schema.Types.ObjectId }, { timestamps: true });
const clubSchema = new mongoose.Schema({ name: String, slug: String, description: String, mission: String, department: String, theme: String, icon: String, headId: mongoose.Schema.Types.ObjectId }, { timestamps: true });
const eventSchema = new mongoose.Schema({ title: String, description: String, clubId: mongoose.Schema.Types.ObjectId, date: Date, venue: String, banner: String, isPublished: { type: Boolean, default: true } }, { timestamps: true });
const announcementSchema = new mongoose.Schema({ title: String, content: String, priority: String, clubId: mongoose.Schema.Types.ObjectId }, { timestamps: true });
const membershipSchema = new mongoose.Schema({ clubId: mongoose.Schema.Types.ObjectId, userId: mongoose.Schema.Types.ObjectId, status: String, memberRole: String }, { timestamps: true });
const registrationSchema = new mongoose.Schema({ eventId: mongoose.Schema.Types.ObjectId, userId: mongoose.Schema.Types.ObjectId, qrCodeData: String, checkedIn: Boolean, checkedInAt: Date }, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Club = mongoose.models.Club || mongoose.model('Club', clubSchema);
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);
const Membership = mongoose.models.Membership || mongoose.model('Membership', membershipSchema);
const Registration = mongoose.models.Registration || mongoose.model('Registration', registrationSchema);

const CLUBS = [
  { slug: 'microsoft-club', name: 'Microsoft Club', description: 'Empowering students with Microsoft technologies, Azure cloud, and developer tools to build real-world solutions.', mission: 'Bridge academia and industry through Microsoft ecosystem.', department: 'Computer Science', theme: 'theme-microsoft', icon: 'Monitor' },
  { slug: 'music-dance-club', name: 'Music & Dance Club', description: 'A vibrant community for artists, musicians, and dancers to express, perform, and grow together.', mission: 'Nurture performing arts culture and give every artist a stage.', department: 'Cultural Affairs', theme: 'theme-music', icon: 'Music' },
  { slug: 'event-management-club', name: 'Event Management Club', description: "The masterminds behind BEC's biggest events — organizing fests, competitions, and inter-college meets.", mission: 'Create unforgettable experiences and develop world-class event management skills.', department: 'Student Affairs', theme: 'theme-events', icon: 'Star' },
  { slug: 'sports-health-club', name: 'Sports & Health Club', description: 'Promoting physical fitness, sports excellence, and a healthy campus lifestyle for all students.', mission: 'Build champions in sports and advocates for health and wellness.', department: 'Physical Education', theme: 'theme-sports', icon: 'Dumbbell' },
  { slug: 'media-club', name: 'Media Club', description: 'Capturing campus life through the lens — photography, videography, journalism, and digital content creation.', mission: "Tell BEC's story through powerful visual and written narratives.", department: 'Media & Communications', theme: 'theme-media', icon: 'Camera' },
  { slug: 'startup-internship-club', name: 'Startup & Internship Club', description: 'Connecting students with startup opportunities, internships, and entrepreneurship resources.', mission: 'Turn student ideas into funded startups and careers into opportunities.', department: 'Entrepreneurship Cell', theme: 'theme-startup', icon: 'Rocket' },
  { slug: 'social-environmental-club', name: 'Social & Environmental Club', description: 'Leading sustainability initiatives, social impact projects, and community outreach on and off campus.', mission: 'Create socially responsible engineers who care for people and the planet.', department: 'Social Responsibility', theme: 'theme-social', icon: 'Leaf' },
  { slug: 'placement-club', name: 'Placement Club', description: "Preparing BEC students for industry with mock interviews, resume workshops, and corporate connections.", mission: 'Maximize placement opportunities and make every student industry-ready.', department: 'Training & Placement', theme: 'theme-placement', icon: 'Briefcase' },
];

const EVENT_TEMPLATES = [
  { title: 'Azure Cloud Workshop', description: 'Hands-on session on Azure services, deployment, and cloud architecture for beginners and intermediates.', venue: 'CS Lab 3, Block A', daysFromNow: 3 },
  { title: 'BEC Music Fest 2024', description: 'Annual cultural extravaganza featuring live performances, group dances, and solo singing competitions.', venue: 'Main Auditorium', daysFromNow: 7 },
  { title: 'Campus Entrepreneurship Summit', description: 'Guest lectures from startup founders and VC firms, followed by a pitch competition with prizes.', venue: 'Seminar Hall', daysFromNow: 14 },
  { title: 'Annual Sports Day', description: '12-hour sports extravaganza covering cricket, football, badminton, and indoor games championship.', venue: 'College Ground', daysFromNow: 10 },
  { title: 'Photography Workshop', description: 'Learn composition, lighting, and editing from professional campus photographers.', venue: 'Media Lab', daysFromNow: 5 },
  { title: 'Resume & Interview Bootcamp', description: "Mock interviews with industry professionals. Build a stellar resume that gets you through any company's ATS.", venue: 'Placement Cell, Block B', daysFromNow: 2 },
  { title: 'Tree Plantation Drive', description: 'Community green initiative — plant 500 trees across campus and the neighboring village.', venue: 'Campus Perimeter', daysFromNow: 4 },
  { title: 'AI & ML Hackathon', description: '24-hour hackathon focused on building ML-powered solutions for real social and technical problems.', venue: 'Innovation Hub', daysFromNow: 21 },
];

async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);

  // Clear existing data
  await Promise.all([
    User.deleteMany({}), Club.deleteMany({}), Event.deleteMany({}),
    Announcement.deleteMany({}), Membership.deleteMany({}), Registration.deleteMany({})
  ]);
  console.log('🧹 Cleared existing data');

  const hashPwd = (pwd) => bcrypt.hashSync(pwd, 10);

  // Admin
  const admin = await User.create({ name: 'Admin User', email: 'admin@bec.edu.in', password: hashPwd('admin123'), role: 'Admin', engagementScore: 0 });
  console.log('👤 Created admin: admin@bec.edu.in / admin123');

  // Club Heads
  const clubHeadUsers = await Promise.all(CLUBS.map((c, i) =>
    User.create({ name: `${c.name} Head`, email: `head.${c.slug.replace(/-/g, '')}@bec.edu.in`, password: hashPwd('head123'), role: 'ClubHead', engagementScore: 50 + i * 5 })
  ));
  console.log('👥 Created 8 club heads (password: head123)');

  // Clubs with their heads
  const clubs = await Promise.all(CLUBS.map((c, i) =>
    Club.create({ ...c, headId: clubHeadUsers[i]._id })
  ));

  // Link club to club head
  await Promise.all(clubs.map((club, i) =>
    User.findByIdAndUpdate(clubHeadUsers[i]._id, { clubId: club._id })
  ));
  console.log('🏛️ Created 8 clubs');

  // Students
  const studentNames = [
    'Priya Patel', 'Rahul Sharma', 'Ananya Nair', 'Rohan Das', 'Simran Kaur',
    'Arjun Reddy', 'Sneha Mishra', 'Vikram Singh', 'Pooja Joshi', 'Amit Kumar',
    'Divya Rao', 'Saurabh Gupta', 'Neha Pandey', 'Krishnadev M', 'Meera Iyer',
    'Ravi Chandra', 'Ankita Verma', 'Suresh Babu', 'Tanvi Shah', 'Ayush Agarwal'
  ];
  const students = await Promise.all(studentNames.map((name) =>
    User.create({ name, email: `${name.toLowerCase().replace(/\s+/g, '.')}@bec.edu.in`, password: hashPwd('student123'), role: 'Student', engagementScore: Math.floor(Math.random() * 150) })
  ));
  console.log('🎓 Created 20 students (password: student123)');

  // Events (one per club)
  const now = new Date();
  const events = await Promise.all(EVENT_TEMPLATES.map((ev, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() + ev.daysFromNow);
    return Event.create({ title: ev.title, description: ev.description, clubId: clubs[i]._id, date, venue: ev.venue, isPublished: true });
  }));
  console.log('📅 Created 8 events');

  // Memberships (each student joins 2-3 random clubs)
  const memberships = [];
  for (const student of students) {
    const numClubs = 2 + Math.floor(Math.random() * 2);
    const shuffled = [...clubs].sort(() => Math.random() - 0.5).slice(0, numClubs);
    for (const club of shuffled) {
      memberships.push({ clubId: club._id, userId: student._id, status: 'Approved', memberRole: 'Member' });
    }
  }
  await Membership.insertMany(memberships);
  console.log('🔗 Created student memberships');

  // Registrations (first 10 students register for first 4 events)
  const registrations = [];
  for (let ei = 0; ei < 4; ei++) {
    for (let si = 0; si < 10; si++) {
      const { randomUUID } = require('crypto');
      registrations.push({
        eventId: events[ei]._id,
        userId: students[si]._id,
        qrCodeData: `bec-reg-${randomUUID()}`,
        checkedIn: si < 6, // first 6 students "checked in"
        checkedInAt: si < 6 ? new Date() : undefined
      });
    }
  }
  await Registration.insertMany(registrations);
  console.log('🎟️ Created event registrations');

  // Announcements
  await Announcement.insertMany([
    { title: 'Welcome to BEC Club Hub!', content: 'The official platform for all club activities, events, and announcements at BEC is now live. Join your favorite clubs and never miss an event again!', priority: 'General' },
    { title: '⚠️ Exam Preparation Leave', content: 'All club events and activities are paused from 15–25 August for end-semester examinations. Events will resume from 26 August.', priority: 'Urgent' },
    { title: 'Microsoft Club Azure Scholarship', content: 'Microsoft Club is offering free Azure certification vouchers to top 10 engaged members. Apply via the club portal before August 10.', priority: 'General', clubId: clubs[0]._id },
    { title: 'Sports Day Registrations Open', content: 'Register for Annual Sports Day events (cricket, football, badminton) via the Sports Club event page. Teams of 5 for team sports.', priority: 'General', clubId: clubs[3]._id },
    { title: 'Urgent: Placement Drive Update', content: 'TCS, Infosys, and Wipro campus drives have been rescheduled. New dates will be announced by Placement Club. Check the portal daily.', priority: 'Urgent', clubId: clubs[7]._id },
  ]);
  console.log('📢 Created announcements');

  console.log('\n✅ Seed complete! BEC Club Hub is ready for demo.');
  console.log('\n--- Demo Credentials ---');
  console.log('Admin:      admin@bec.edu.in     / admin123');
  console.log('Club Head:  head.microsoftclub@bec.edu.in / head123');
  console.log('Student:    priya.patel@bec.edu.in / student123');
  console.log('------------------------\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => { console.error('Seed failed:', err); process.exit(1); });
