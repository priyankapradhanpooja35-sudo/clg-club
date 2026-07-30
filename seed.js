/**
 * BEC Club Hub — Expanded Demo Seed Script
 * Run: npm run seed
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bec-club-hub';

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    role: String,
    engagementScore: { type: Number, default: 0 },
    clubId: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

const clubSchema = new mongoose.Schema(
  {
    name: String,
    slug: String,
    description: String,
    mission: String,
    department: String,
    theme: String,
    icon: String,
    headId: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

const eventSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    clubId: mongoose.Schema.Types.ObjectId,
    date: Date,
    venue: String,
    banner: String,
    isPublished: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const announcementSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    priority: String,
    clubId: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

const membershipSchema = new mongoose.Schema(
  {
    clubId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    status: String,
    memberRole: String,
  },
  { timestamps: true }
);

const registrationSchema = new mongoose.Schema(
  {
    eventId: mongoose.Schema.Types.ObjectId,
    userId: mongoose.Schema.Types.ObjectId,
    qrCodeData: String,
    checkedIn: Boolean,
    checkedInAt: Date,
  },
  { timestamps: true }
);

const taskSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    status: String,
    clubId: mongoose.Schema.Types.ObjectId,
    assignedTo: mongoose.Schema.Types.ObjectId,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
const Club = mongoose.models.Club || mongoose.model('Club', clubSchema);
const Event = mongoose.models.Event || mongoose.model('Event', eventSchema);
const Announcement = mongoose.models.Announcement || mongoose.model('Announcement', announcementSchema);
const Membership = mongoose.models.Membership || mongoose.model('Membership', membershipSchema);
const Registration = mongoose.models.Registration || mongoose.model('Registration', registrationSchema);
const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

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
  { title: 'Azure Cloud & AI Workshop', description: 'Hands-on session on Azure services, OpenAI API deployment, and cloud architecture.', venue: 'CS Lab 3, Block A', daysFromNow: 3, clubIndex: 0 },
  { title: 'GitHub Copilot Bootcamp', description: 'Master AI-assisted coding and pull request workflows.', venue: 'CS Lab 1', daysFromNow: 8, clubIndex: 0 },
  { title: 'BEC Music Fest 2024', description: 'Annual cultural extravaganza featuring live performances, group dances, and solo singing.', venue: 'Main Auditorium', daysFromNow: 7, clubIndex: 1 },
  { title: 'Battle of the Bands', description: 'Inter-college musical competition with cash prizes.', venue: 'Open Air Theatre', daysFromNow: 15, clubIndex: 1 },
  { title: 'Campus Fest Organizing Meet', description: 'Planning session for BEC Annual Tech Fest 2024.', venue: 'Seminar Hall B', daysFromNow: 2, clubIndex: 2 },
  { title: 'Annual Sports Tournament', description: '12-hour sports championship covering cricket, football, badminton, and chess.', venue: 'College Ground', daysFromNow: 10, clubIndex: 3 },
  { title: 'Marathon for Fitness', description: '5K campus run promoting wellness and mental health.', venue: 'Campus Perimeter', daysFromNow: 12, clubIndex: 3 },
  { title: 'Mobile Photography Masterclass', description: 'Learn composition, lighting, and editing from professional campus photographers.', venue: 'Media Studio', daysFromNow: 5, clubIndex: 4 },
  { title: 'Campus Drone Videography', description: 'Hands-on aerial photography and video editing session.', venue: 'Main Quadrangle', daysFromNow: 18, clubIndex: 4 },
  { title: 'Startup Pitch Competition', description: 'Pitch student ideas to VC investors and angel mentors for seed funding.', venue: 'Auditorium Hall 2', daysFromNow: 14, clubIndex: 5 },
  { title: 'Tree Plantation & Green Drive', description: 'Community green initiative — plant 500 trees across campus and local village.', venue: 'North Campus Grounds', daysFromNow: 4, clubIndex: 6 },
  { title: 'TCS & Wipro Resume Bootcamp', description: 'Mock interviews with corporate recruiters and ATS resume optimization.', venue: 'Placement Cell, Block B', daysFromNow: 1, clubIndex: 7 },
  { title: 'Mock Technical Interviews', description: '1-on-1 coding interview practice with alumni working at Amazon & Google.', venue: 'Placement Lab 2', daysFromNow: 9, clubIndex: 7 },
];

async function seed() {
  console.log('🌱 Connecting to MongoDB...');
  await mongoose.connect(MONGODB_URI);

  await Promise.all([
    User.deleteMany({}),
    Club.deleteMany({}),
    Event.deleteMany({}),
    Announcement.deleteMany({}),
    Membership.deleteMany({}),
    Registration.deleteMany({}),
    Task.deleteMany({}),
  ]);
  console.log('🧹 Cleared existing data');

  const hashPwd = (pwd) => bcrypt.hashSync(pwd, 10);

  // Admin
  await User.create({
    name: 'Admin User',
    email: 'admin@bec.edu.in',
    password: hashPwd('admin123'),
    role: 'Admin',
    engagementScore: 250,
  });
  console.log('👤 Created Admin: admin@bec.edu.in / admin123');

  // Club Heads
  const clubHeadUsers = await Promise.all(
    CLUBS.map((c, i) =>
      User.create({
        name: `${c.name} Head`,
        email: `head.${c.slug.replace(/-/g, '')}@bec.edu.in`,
        password: hashPwd('head123'),
        role: 'ClubHead',
        engagementScore: 120 + i * 15,
      })
    )
  );
  console.log('👥 Created 8 Club Heads');

  // Clubs
  const clubs = await Promise.all(
    CLUBS.map((c, i) =>
      Club.create({ ...c, headId: clubHeadUsers[i]._id })
    )
  );

  await Promise.all(
    clubs.map((club, i) =>
      User.findByIdAndUpdate(clubHeadUsers[i]._id, { clubId: club._id })
    )
  );
  console.log('🏛️ Created 8 Clubs');

  // 30 Students
  const studentNames = [
    'Priya Patel', 'Rahul Sharma', 'Ananya Nair', 'Rohan Das', 'Simran Kaur',
    'Arjun Reddy', 'Sneha Mishra', 'Vikram Singh', 'Pooja Joshi', 'Amit Kumar',
    'Divya Rao', 'Saurabh Gupta', 'Neha Pandey', 'Krishnadev M', 'Meera Iyer',
    'Ravi Chandra', 'Ankita Verma', 'Suresh Babu', 'Tanvi Shah', 'Ayush Agarwal',
    'Kiran Bedi', 'Deepak Hooda', 'Ishita Dutta', 'Manish Pandey', 'Shreya Ghoshal',
    'Hardik Pandya', 'Rishabh Pant', 'Shubman Gill', 'Smriti Mandhana', 'Yuzvendra Chahal'
  ];

  const students = await Promise.all(
    studentNames.map((name, idx) =>
      User.create({
        name,
        email: `${name.toLowerCase().replace(/\s+/g, '.')}@bec.edu.in`,
        password: hashPwd('student123'),
        role: 'Student',
        engagementScore: Math.floor(60 + idx * 8 + Math.random() * 20),
      })
    )
  );
  console.log('🎓 Created 30 Students');

  // Events
  const now = new Date();
  const events = await Promise.all(
    EVENT_TEMPLATES.map((ev) => {
      const date = new Date(now);
      date.setDate(date.getDate() + ev.daysFromNow);
      return Event.create({
        title: ev.title,
        description: ev.description,
        clubId: clubs[ev.clubIndex]._id,
        date,
        venue: ev.venue,
        isPublished: true,
      });
    })
  );
  console.log('📅 Created 13 Events');

  // Memberships
  const memberships = [];
  for (const student of students) {
    const numClubs = 3 + Math.floor(Math.random() * 2); // 3-4 clubs per student
    const shuffled = [...clubs].sort(() => Math.random() - 0.5).slice(0, numClubs);
    for (const club of shuffled) {
      memberships.push({
        clubId: club._id,
        userId: student._id,
        status: 'Approved',
        memberRole: 'Member',
      });
    }
  }
  await Membership.insertMany(memberships);
  console.log('🔗 Created Student Memberships');

  // Registrations (with predictable demo QR tokens for organizer check-in demo)
  const registrations = [
    {
      eventId: events[0]._id, // Azure Cloud
      userId: students[0]._id, // Priya Patel
      qrCodeData: 'bec-reg-demo-1',
      checkedIn: true,
      checkedInAt: new Date(),
    },
    {
      eventId: events[0]._id,
      userId: students[1]._id, // Rahul Sharma
      qrCodeData: 'bec-reg-demo-2',
      checkedIn: false,
    },
  ];

  for (let ei = 0; ei < events.length; ei++) {
    for (let si = 2; si < 15; si++) {
      const { randomUUID } = require('crypto');
      registrations.push({
        eventId: events[ei]._id,
        userId: students[si]._id,
        qrCodeData: `bec-reg-${randomUUID()}`,
        checkedIn: Math.random() > 0.4,
        checkedInAt: new Date(),
      });
    }
  }
  await Registration.insertMany(registrations);
  console.log('🎟️ Created Event Registrations');

  // Tasks
  await Task.insertMany([
    { title: 'Setup Azure Portal Lab Accounts', description: 'Create sandbox subscriptions for workshop attendees.', status: 'Done', clubId: clubs[0]._id, assignedTo: students[0]._id },
    { title: 'Print Workshop Badges', description: 'Export attendee list and print QR badges.', status: 'In-progress', clubId: clubs[0]._id, assignedTo: students[1]._id },
    { title: 'Sound System Check', description: 'Inspect stage speakers and microphones in Main Auditorium.', status: 'To-do', clubId: clubs[1]._id, assignedTo: students[2]._id },
    { title: 'Design Sports Day Banner', description: 'Create high-res Photoshop banner for college entrance.', status: 'In-progress', clubId: clubs[3]._id, assignedTo: students[4]._id },
  ]);
  console.log('📋 Created Club Tasks');

  // Announcements
  await Announcement.insertMany([
    { title: 'Welcome to BEC Club Hub 🚀', content: 'The official platform for all club activities, events, and announcements at BEC is now live.', priority: 'General' },
    { title: '⚠️ Mid-Term Exam Break Notice', content: 'All club events will be paused during mid-term examination week (Aug 15–22).', priority: 'Urgent' },
    { title: 'Microsoft Azure Student Credits Available', content: 'Claim $100 Azure credits through the Microsoft Club portal before Aug 10.', priority: 'General', clubId: clubs[0]._id },
    { title: 'Urgent: Placement Drive Schedule Shift', content: 'Infosys & TCS drives updated. Check Placement Club notices for new slots.', priority: 'Urgent', clubId: clubs[7]._id },
  ]);
  console.log('📢 Created Announcements');

  console.log('\n✅ Demo Seed Complete!');
  console.log('--- Demo Accounts ---');
  console.log('Admin:       admin@bec.edu.in               / admin123');
  console.log('Club Head:   head.microsoftclub@bec.edu.in  / head123');
  console.log('Student:     priya.patel@bec.edu.in          / student123');
  console.log('---------------------\n');

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
