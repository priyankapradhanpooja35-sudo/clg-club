export interface DailyCoder {
  userId: string;
  name: string;
  department: string;
  year: string;
  date: string;
  photoUrl: string;
  reason: string;
  problemName: string;
  finishTimeSeconds: number; // e.g. 845 seconds = 14m 05s
  streakCount: number;
  pointsEarned: number;
}

export interface DailyChallengeSolver {
  userId: string;
  name: string;
  photoUrl: string;
  department: string;
  finishTimeSeconds: number;
  solvedAt: string;
}

export interface DailyChallenge {
  id: string;
  date: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  problemStatement: string;
  inputExample: string;
  outputExample: string;
  closesAt: string; // ISO string
  solvers: DailyChallengeSolver[];
}

export interface HackathonParticipant {
  hackathonId: string;
  userId: string;
  name: string;
  email: string;
  department: string;
  teamName: string;
  rank: 1 | 2 | 3 | null;
  photoUrl: string;
  certificateIssued: boolean;
}

export interface Hackathon {
  id: string;
  title: string;
  theme: string;
  problemStatement: string;
  description: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  status: 'upcoming' | 'live' | 'ended' | 'archived';
  winningTeams?: {
    rank: 1 | 2 | 3;
    teamName: string;
    leaderName: string;
    photoUrl: string;
    projectTitle: string;
  }[];
}

/* ─── Mock Data Store ─── */

export const MOCK_DAILY_CODER: DailyCoder = {
  userId: 'usr_priyanka',
  name: 'Priyanka Pradhan',
  department: 'Computer Science & Engg',
  year: '3rd Year',
  date: 'July 31, 2026',
  photoUrl: '/images/priyanka-coder-of-day.jpeg',
  problemName: 'Binary Tree Zigzag Level Order Traversal',
  reason: "Solved today's Binary Tree challenge faster than everyone else!",
  finishTimeSeconds: 522, // 8m 42s
  streakCount: 14,
  pointsEarned: 250,
};

export const MOCK_DAILY_CHALLENGE: DailyChallenge = {
  id: 'dc-2026-07-31',
  date: 'July 31, 2026',
  title: 'Optimize Network Latency & Graph Traversal',
  difficulty: 'Medium',
  problemStatement:
    'Given a connected weighted graph representing campus servers, write an algorithm to compute the shortest latency path between server node A and server node B, minimizing bottleneck edge weights.',
  inputExample: 'Nodes = 6, Edges = [[1,2,10], [2,3,15], [1,3,30]], Source = 1, Target = 3',
  outputExample: 'Min Latency: 25 (Path: 1 -> 2 -> 3)',
  // Set closesAt to end of today
  closesAt: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
  solvers: [
    {
      userId: 'usr_priyanka',
      name: 'Priyanka Pradhan',
      photoUrl: '/images/priyanka-coder-of-day.jpeg',
      department: 'CSE 3rd Year',
      finishTimeSeconds: 522,
      solvedAt: '09:14 AM',
    },
    {
      userId: 'usr_sanjana',
      name: 'Sanjana Baidya',
      photoUrl: '/images/sanjana-baidya.jpeg',
      department: 'CSE 4th Year',
      finishTimeSeconds: 680,
      solvedAt: '09:32 AM',
    },
    {
      userId: 'usr_sthitipragyan',
      name: 'Sthitipragyan Sahu',
      photoUrl: '/images/sthitipragyan-sahu.jpeg',
      department: 'ECE 3rd Year',
      finishTimeSeconds: 840,
      solvedAt: '10:05 AM',
    },
    {
      userId: 'usr_sunita',
      name: 'Sunita Nayak',
      photoUrl: '/images/sunita-nayak.jpeg',
      department: 'IT 2nd Year',
      finishTimeSeconds: 1120,
      solvedAt: '10:45 AM',
    },
  ],
};

// Current Live Hackathon (Set endTime slightly in future for live demonstration)
export const MOCK_CURRENT_HACKATHON: Hackathon = {
  id: 'hackathon-sih-2026',
  title: 'BEC Smart India Hackathon 2026',
  theme: 'AI & Sustainable Infrastructure',
  problemStatement:
    'Build an AI-driven smart energy & disaster management solution for modern campus infrastructure that monitors power grids, predicts anomalies, and triggers real-time emergency routing.',
  description:
    '24-hour flagship hackathon organized by BEC CodeLab & Event Management Club. Bring your team, build revolutionary real-world prototypes, and win prizes worth ₹1,00,000!',
  startTime: new Date(Date.now() - 22 * 60 * 60 * 1000).toISOString(),
  // 2 hours remaining
  endTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  status: 'live',
};

// Past Archived Hackathons
export const MOCK_ARCHIVED_HACKATHONS: Hackathon[] = [
  {
    id: 'hack-ai-vision-2026',
    title: 'BEC AI Vision & Robotics Hack 2026',
    theme: 'Autonomous Robotics & Edge Vision',
    problemStatement:
      'Develop real-time object identification and navigation software running on low-latency edge hardware for campus delivery drones.',
    description: '48-hour hardware and software integration hackathon hosted by RoboClub.',
    startTime: '2026-06-10T09:00:00Z',
    endTime: '2026-06-12T09:00:00Z',
    status: 'archived',
    winningTeams: [
      {
        rank: 1,
        teamName: 'RoboBytes',
        leaderName: 'Vikram Samal',
        photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
        projectTitle: 'Autonomous Obstacle Drone AI',
      },
      {
        rank: 2,
        teamName: 'EdgeMasters',
        leaderName: 'Pooja Rout',
        photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
        projectTitle: 'Low-latency YOLO Drone Tracker',
      },
      {
        rank: 3,
        teamName: 'CircuitBreakers',
        leaderName: 'Amit Mohanty',
        photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
        projectTitle: 'LiDAR Edge Navigator',
      },
    ],
  },
  {
    id: 'hack-web3-defihack-2025',
    title: 'BEC Web3 & Decentralized Hack 2025',
    theme: 'Blockchain & Digital Identity',
    problemStatement:
      'Design a zero-knowledge verifiable student credential and diploma verification registry protocol.',
    description: 'Inter-college blockchain hackathon.',
    startTime: '2025-11-15T09:00:00Z',
    endTime: '2025-11-16T18:00:00Z',
    status: 'archived',
    winningTeams: [
      {
        rank: 1,
        teamName: 'CryptoFounders',
        leaderName: 'Siddharth Das',
        photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&q=80',
        projectTitle: 'ZK-Degree Campus Registry',
      },
      {
        rank: 2,
        teamName: 'ChainGang',
        leaderName: 'Ananya Mishra',
        photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
        projectTitle: 'DeFi Student Micro-grants',
      },
      {
        rank: 3,
        teamName: 'BlockHeads',
        leaderName: 'Kunal Ray',
        photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80',
        projectTitle: 'DAO Event Governance',
      },
    ],
  },
];

// Participants Data
export const MOCK_HACKATHON_PARTICIPANTS: HackathonParticipant[] = [
  // Team ByteCraft (1st Place Winner)
  {
    hackathonId: 'hackathon-sih-2026',
    userId: 'usr_sanjana',
    name: 'Sanjana Baidya',
    email: 'sanjana.b@bec.ac.in',
    department: 'CSE 4th Year',
    teamName: 'Team ByteCraft',
    rank: 1,
    photoUrl: '/images/sanjana-baidya.jpeg',
    certificateIssued: true,
  },
  {
    hackathonId: 'hackathon-sih-2026',
    userId: 'usr_priyanka',
    name: 'Priyanka Pradhan',
    email: 'priyanka.pradhan@bec.ac.in',
    department: 'CSE 3rd Year',
    teamName: 'Team ByteCraft',
    rank: 1,
    photoUrl: '/images/priyanka-coder-of-day.jpeg',
    certificateIssued: true,
  },

  // Team CyberPulse (2nd Place Winner)
  {
    hackathonId: 'hackathon-sih-2026',
    userId: 'usr_sthitipragyan',
    name: 'Sthitipragyan Sahu',
    email: 'sthitipragyan.s@bec.ac.in',
    department: 'ECE 3rd Year',
    teamName: 'Team CyberPulse',
    rank: 2,
    photoUrl: '/images/sthitipragyan-sahu.jpeg',
    certificateIssued: true,
  },
  {
    hackathonId: 'hackathon-sih-2026',
    userId: 'usr_aditya',
    name: 'Aditya Patnaik',
    email: 'aditya.p@bec.ac.in',
    department: 'ECE 3rd Year',
    teamName: 'Team CyberPulse',
    rank: 2,
    photoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=400&q=80',
    certificateIssued: true,
  },

  // Team CodeX (3rd Place Winner)
  {
    hackathonId: 'hackathon-sih-2026',
    userId: 'usr_sunita',
    name: 'Sunita Nayak',
    email: 'sunita.n@bec.ac.in',
    department: 'IT 2nd Year',
    teamName: 'Team CodeX',
    rank: 3,
    photoUrl: '/images/sunita-nayak.jpeg',
    certificateIssued: true,
  },
  {
    hackathonId: 'hackathon-sih-2026',
    userId: 'usr_kavya',
    name: 'Kavya Sahoo',
    email: 'kavya.s@bec.ac.in',
    department: 'IT 2nd Year',
    teamName: 'Team CodeX',
    rank: 3,
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80',
    certificateIssued: true,
  },

  // Other Participants
  {
    hackathonId: 'hackathon-sih-2026',
    userId: 'usr_siddharth',
    name: 'Siddharth Das',
    email: 'siddharth@bec.ac.in',
    department: 'Mech 3rd Year',
    teamName: 'Team Innovate360',
    rank: null,
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    certificateIssued: true,
  },
  {
    hackathonId: 'hackathon-sih-2026',
    userId: 'usr_ishita',
    name: 'Ishita Behera',
    email: 'ishita@bec.ac.in',
    department: 'EE 2nd Year',
    teamName: 'Team Innovate360',
    rank: null,
    photoUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    certificateIssued: true,
  },
  {
    hackathonId: 'hackathon-sih-2026',
    userId: 'usr_manish',
    name: 'Manish Naik',
    email: 'manish@bec.ac.in',
    department: 'Civil 4th Year',
    teamName: 'Team GreenGrid',
    rank: null,
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    certificateIssued: true,
  },
  {
    hackathonId: 'hackathon-sih-2026',
    userId: 'usr_subhashree',
    name: 'Subhashree Dash',
    email: 'subhashree@bec.ac.in',
    department: 'CSE 2nd Year',
    teamName: 'Team GreenGrid',
    rank: null,
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=80',
    certificateIssued: true,
  },
];
