/**
 * BEC Club Hub — Local dummy notices data
 * Used as demo fallback when the API returns no data.
 * Content intentionally contains date mentions so the countdown timer can parse them.
 */

export interface Notice {
  _id: string;
  title: string;
  content: string;
  priority: 'Urgent' | 'General' | 'Event' | 'Achievement' | 'Deadline' | 'ClubHead';
  clubName?: string;
  clubSlug?: string;
  author?: string;
  pinned?: boolean;
  createdAt: string;
}

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 864e5).toISOString();
const daysFromNow = (d: number) => new Date(now.getTime() + d * 864e5);

// Build a date string that's ~15 days from now, for demo countdown
const futureDate = daysFromNow(15);
const futureDateStr = futureDate.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }); // e.g. "14 Aug"
const futureMonth = futureDate.toLocaleDateString('en-IN', { month: 'short' }); // "Aug"
const futureDay = futureDate.getDate();
const futureDayEnd = futureDay + 7;

// Ongoing event: started 2 days ago, ends in 5 days
const ongoingStart = daysFromNow(-2);
const ongoingEnd = daysFromNow(5);
const ongoingMonth = ongoingStart.toLocaleDateString('en-IN', { month: 'short' });
const ongoingStartDay = ongoingStart.getDate();
const ongoingEndDay = ongoingEnd.getDate();

export const DUMMY_NOTICES: Notice[] = [
  {
    _id: 'n001',
    title: '⚠️ Urgent: Internal Assessment Submission Deadline',
    content: `All students must submit their Internal Assessment projects by ${futureMonth} ${futureDay}. No extensions will be granted under any circumstances. Projects must be submitted via the BEC Portal before 11:59 PM. Late submissions will result in zero marks for that component. Contact your respective faculty advisor immediately if you face technical issues.`,
    priority: 'Urgent',
    clubName: 'Administration',
    author: 'HOD Office',
    createdAt: daysAgo(1),
  },
  {
    _id: 'n002',
    title: `Microsoft Club Hackathon — Register Now!`,
    content: `The annual 24-hour BEC Hackathon is happening from ${futureMonth} ${futureDay}–${futureDayEnd}. Teams of 2-4 students compete on real-world problem statements provided by industry mentors. Prizes worth ₹50,000 await the top 3 teams. Register through the BEC Club Hub Events page. Seats are limited — first come, first served!`,
    priority: 'Event',
    clubName: 'Microsoft Club',
    clubSlug: 'microsoft-club',
    author: 'CodeLab Team',
    createdAt: daysAgo(2),
  },
  {
    _id: 'n003',
    title: 'BEC Robotics Team Wins State Championship 🏆',
    content: `We are proud to announce that our BEC Robotics team secured 1st place at the Odisha State Robotics Championship held in ITER, Bhubaneswar. The team of Rohit Patra, Sneha Das, and Aditya Nayak beat 38 teams across Odisha. This is BEC's 3rd consecutive state championship win. Congratulations to the entire team and their mentors!`,
    priority: 'Achievement',
    clubName: 'Startup & Internship Club',
    clubSlug: 'startup-internship-club',
    author: 'Principal Office',
    createdAt: daysAgo(3),
  },
  {
    _id: 'n004',
    title: `Photography Masterclass — ${ongoingMonth} ${ongoingStartDay}–${ongoingEndDay}`,
    content: `Media Club is hosting a weeklong Photography Masterclass from ${ongoingMonth} ${ongoingStartDay} to ${ongoingMonth} ${ongoingEndDay}. Daily 2-hour sessions cover composition, lighting, portrait photography, and post-processing in Adobe Lightroom. Registration is free for all BEC students. Venue: Media Studio, Block C. Bring your own camera or use the club's equipment.`,
    priority: 'Urgent',
    clubName: 'Media Club',
    clubSlug: 'media-club',
    author: 'Media Club Head',
    createdAt: daysAgo(4),
  },
  {
    _id: 'n005',
    title: 'Final Year Project Report Submission',
    content: `Attention all final year students: your project reports must be submitted to the department by the last week of this month. Reports should follow the BEC standard template available on the intranet. Soft copy via email to your guide, hard copy to the department office. Failure to submit on time may affect your exam eligibility. Deadline is firm — no exceptions.`,
    priority: 'Deadline',
    clubName: 'Administration',
    author: 'Exam Cell',
    createdAt: daysAgo(5),
  },
  {
    _id: 'n006',
    title: 'New Semester Timetable Released',
    content: `The timetable for the upcoming semester has been published on the official BEC portal. All students are requested to check their respective department pages. Lab schedules and elective class assignments will be posted separately by Friday. Any timetable conflicts should be reported to the academic section within 3 working days of receiving this notice.`,
    priority: 'General',
    clubName: 'Administration',
    author: 'Academic Section',
    createdAt: daysAgo(6),
  },
  {
    _id: 'n007',
    title: 'Music & Dance Club Annual Auditions',
    content: `Rhythmix — BEC's Music & Dance Club — is conducting auditions for new members this weekend. Auditions will be held in the College Auditorium on Saturday and Sunday from 10 AM to 4 PM. Open to all branches and years. Bring your own instruments if needed. No prior experience required for the dance wing. Come express yourself!`,
    priority: 'Event',
    clubName: 'Music & Dance Club',
    clubSlug: 'music-dance-club',
    author: 'Rhythmix Club Head',
    createdAt: daysAgo(7),
  },
  {
    _id: 'n008',
    title: 'Campus Placement Drive — Infosys & TCS',
    content: `The Training & Placement cell is pleased to announce campus recruitment drives for Infosys and TCS scheduled for next month. Eligible: 2025 batch, 60%+ aggregate, no active backlogs. Pre-placement talks will be held online — links shared via email. Register on the placement portal before the deadline. Placement Club mock interview sessions start this week!`,
    priority: 'Urgent',
    clubName: 'Placement Club',
    clubSlug: 'placement-club',
    author: 'T&P Cell',
    createdAt: daysAgo(8),
  },
  {
    _id: 'n009',
    title: 'Sports Fest — Inter-College Tournament Registration Open',
    content: `BEC Sports & Health Club is organizing the Annual Inter-College Sports Fest. Events include cricket, football, volleyball, badminton, table tennis, and chess. Registration for individual and team events is now open. Deadline to register your college team is end of this week. Cash prizes and trophies for top 3 teams in each sport. All BEC students get free entry as spectators.`,
    priority: 'Event',
    clubName: 'Sports & Health Club',
    clubSlug: 'sports-health-club',
    author: 'Sports Club Head',
    createdAt: daysAgo(10),
  },
  {
    _id: 'n010',
    title: 'Campus Wi-Fi Upgrade Notice',
    content: `The IT department will be performing a scheduled campus network upgrade this Sunday from 2 AM to 8 AM. Internet services across all hostels and classrooms will be temporarily unavailable during this window. Please plan your downloads and uploads accordingly. The upgrade will increase bandwidth capacity by 3× across campus. Apologies for the inconvenience.`,
    priority: 'General',
    clubName: 'IT Department',
    author: 'System Administrator',
    createdAt: daysAgo(11),
  },
  {
    _id: 'n011',
    title: 'Club Heads Meeting — Attendance Mandatory',
    content: `All recognized club heads and co-ordinators must attend the quarterly review meeting with the Student Affairs Committee. The meeting is scheduled for this Friday at 3 PM in Conference Room 2, Admin Block. Bring your club's activity report for the past quarter and the upcoming event plan. Absence without prior intimation will affect your club's budget allocation.`,
    priority: 'ClubHead',
    author: 'Dean, Student Affairs',
    createdAt: daysAgo(12),
  },
  {
    _id: 'n012',
    title: 'Social Club Tree Plantation Drive — Volunteers Needed',
    content: `The Social & Environmental Club is organising a tree plantation drive in collaboration with the local municipality. We need 50+ student volunteers. Date: this coming Saturday, 7 AM – 12 PM. Meeting point: Main Gate. Transport and refreshments will be provided. Volunteers get 2 community service hours logged on their profile. Sign up on the BEC Club Hub dashboard.`,
    priority: 'Event',
    clubName: 'Social & Environmental Club',
    clubSlug: 'social-environmental-club',
    author: 'Social Club Head',
    createdAt: daysAgo(14),
  },
];

/** Auto-categorization keyword rules */
export const CATEGORY_KEYWORDS: { pattern: RegExp; category: Notice['priority'] }[] = [
  { pattern: /\b(urgent|asap|immediate|critical|emergency|mandatory|compulsory)\b/i, category: 'Urgent' },
  { pattern: /\b(exam|deadline|submit|submission|last.?date|due.?date|final.?date)\b/i, category: 'Deadline' },
  { pattern: /\b(event|fest|workshop|seminar|webinar|conference|hackathon|competition|tournament|audition)\b/i, category: 'Event' },
  { pattern: /\b(achievement|won|award|rank|congratulations?|champion|winner|prize)\b/i, category: 'Achievement' },
  { pattern: /\b(club.?head|coordinator|council|committee|meeting|minutes)\b/i, category: 'ClubHead' },
];

/** Parse the first event date found in text — returns a Date or null */
export function parseEventDate(text: string): { start: Date; end?: Date } | null {
  // Pattern: "Aug 14" or "August 14"
  const MONTHS: Record<string, number> = {
    jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5,
    jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11,
    january: 0, february: 1, march: 2, april: 3, june: 5,
    july: 6, august: 7, september: 8, october: 9, november: 10, december: 11,
  };

  // Range: "Aug 14-21" or "Aug 14–21"
  const rangeMatch = text.match(
    /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{1,2})[–\-–](\d{1,2})/i
  );
  if (rangeMatch) {
    const month = MONTHS[rangeMatch[1].toLowerCase()];
    const startDay = parseInt(rangeMatch[2], 10);
    const endDay = parseInt(rangeMatch[3], 10);
    const year = new Date().getFullYear();
    const start = new Date(year, month, startDay, 0, 0, 0);
    const end = new Date(year, month, endDay, 23, 59, 59);
    return { start, end };
  }

  // Single: "Aug 14"
  const singleMatch = text.match(
    /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|jun(?:e)?|jul(?:y)?|aug(?:ust)?|sep(?:tember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\s+(\d{1,2})\b/i
  );
  if (singleMatch) {
    const month = MONTHS[singleMatch[1].toLowerCase()];
    const day = parseInt(singleMatch[2], 10);
    const year = new Date().getFullYear();
    const start = new Date(year, month, day, 23, 59, 59);
    return { start };
  }

  return null;
}

/** Build countdown string from a parsed date range */
export function getCountdownState(
  parsed: { start: Date; end?: Date }
): { status: 'future' | 'ongoing' | 'ended'; label: string } {
  const now = Date.now();
  const startMs = parsed.start.getTime();
  const endMs = parsed.end ? parsed.end.getTime() : startMs;

  if (now < startMs) {
    const diff = startMs - now;
    const days = Math.floor(diff / 864e5);
    const hours = Math.floor((diff % 864e5) / 36e5);
    if (days > 0) return { status: 'future', label: `Starts in ${days}d ${hours}h` };
    if (hours > 0) return { status: 'future', label: `Starts in ${hours}h` };
    const mins = Math.floor((diff % 36e5) / 6e4);
    return { status: 'future', label: `Starts in ${mins}m` };
  }

  if (now <= endMs) {
    return { status: 'ongoing', label: 'Happening now' };
  }

  return { status: 'ended', label: 'Ended' };
}
