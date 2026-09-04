export type Category = 'software' | 'marketing' | 'systems';

export interface Project {
  id: string;
  category: Category;
  results?: string;
  deliverables?: string[];
  gallery?: string[];
  title: string;
  date: string;
  role: string;
  color: string;
  tags?: readonly string[];
  description: string;
  media?: { type: 'video' | 'image'; url: string; thumbnail?: string };
  liveUrl?: string;
  repoUrl?: string;
  problem?: string;
  solution?: string;
  impact?: string;
  caseStudyHref?: string;
}

export interface Experience {
  id: string;
  category: Category;
  title: string;
  company: string;
  date: string;
  location: string;
  color: string;
  description: string;
  details: readonly string[];
  gallery?: readonly string[];
  video?: string;
  tech?: readonly string[];
}

export const name = "Shaheen Al Adwani";

/** Conversion funnel copy + booking config */
export const hub = {
  position: "Growth Marketer × Software Engineer",
  headline: "I Build Products That Convert.",
  subtext:
    "Full-stack engineer and growth operator. Two live SaaS products, $355K+ in campaign volume, 4:1 ROAS, 22K-member communities. Open to full-time roles and select freelance.",
  status: "Open to SWE & MKT roles · Project work",
  ctaPrimary: "Book a Call",
  appointmentUrl: "" as string,
};

export const softwareSummary =
  "Computer Science graduate at Ateneo de Davao. I build full-stack applications with a focus on performance and real-world utility. My background in marketing taught me to build systems that don't just work, but actually drive business results.";

export const marketingSummary =
  "In 4 months, I scaled a market from under $4K to $133K in peak monthly transaction volume, with $355K in total volume across the campaign period. The longer version: 4+ years of growth marketing, 25+ structured creator partnerships, a 4:1 ROAS across every influencer I've onboarded, and a track record of building the systems behind the results, not just running the plays.";

export const contact = {
  email: "contact.shaheenaladwani@gmail.com",
  phone: "+63 917 786 5315",
  location: "Davao, Philippines",
  linkedin: "linkedin.com/in/aladwani",
  profileImage: "/og-image.jpg",
};

export const resumes = {
  software:
    "https://docs.google.com/document/d/1fegmtrlKvyum3vJwKF9Vs8ELC9p7o4DuK4RyrKNJpno/export?format=pdf",
  marketing:
    "https://docs.google.com/document/d/1yOaGJtXkOTe59ygH9QrlcFg2VB70k6qNKo0e-Hc_Aeg/export?format=pdf",
};

/** Flagship case IDs shown first on zone pages (depth over breadth) */
export const featuredProjectIds = {
  marketing: [
    "campaign-rivalry-tribe-main",
    "campaign-kuyanic-ti",
    "campaign-sgc-launch",
  ],
  software: ["proj-gymeasy", "proj-agripinoy", "proj-JCSD"],
  systems: ["campaign-growth-automation", "proj-esp32"],
} as const;

/** Order and selection of projects featured on the homepage */
export const featuredHomeIds = [
  "proj-staysafe",
  "proj-JCSD",
  "proj-gymeasy",
  "proj-agripinoy",
  "campaign-growth-automation",
  "proj-esp32",
] as const;

/** Proof metrics shown in the hero proof band (5 stats, count-up) */
export const hubStats = [
  {
    value: "$355K+",
    label: "Total Transaction Volume in just 4 months",
    sub: "Grew from $6K/mo to $355K total in just 4 months",
    accent: "marketing",
  },
  {
    value: "22K+",
    label: "Community members",
    sub: "Acquired and retained, KYC-gated",
    accent: "marketing",
  },
  {
    value: "25+",
    label: "Influencer partnerships",
    sub: "SEA macro-creators managed end-to-end",
    accent: "marketing",
  },
  {
    value: "4:1",
    label: "Validated ROAS",
    sub: "Across every creator onboarded",
    accent: "marketing",
  },
  {
    value: "2",
    label: "Live SaaS products",
    sub: "In paid beta with real users",
    accent: "software",
  },
] as const;

export const softwareFit = [
  "Full-stack / product engineering roles",
  "SaaS and internal tools that need shipping owners",
  "Hybrid builder seats (eng + growth adjacency)",
] as const;

export const marketingFit = [
  "Growth, performance, and creator partnerships",
  "SEA market operators who need systems, not just plays",
  "Hybrid seats that pair marketing with product sense",
] as const;

export const trustLogos = [
  { src: "/logos/rivalry.png", alt: "Rivalry" },
  { src: "/logos/yohoho.png", alt: "Yohoho" },
  { src: "/logos/epulze.png", alt: "Epulze" },
  { src: "/logos/ncgc.png", alt: "NCGC" },
] as const;

export const softwareSkills = [
  "Flutter & Dart",
  "Java & Spring Boot",
  "JavaScript & TypeScript",
  "Next.js",
  "Supabase & PostgreSQL",
  "Firebase",
  "REST APIs",
  "AWS & Docker",
  "ESP32 / IoT",
  "Python",
  "Figma",
  "Astro",
  "Agile / Scrum",
  "Postman",
] as const;

export const marketingSkills = [
  "Influencer & KOL Marketing",
  "Creator Partnerships",
  "Performance Marketing (ROAS)",
  "Growth Strategy & UA",
  "Community Building",
  "Lifecycle Campaigns (Email, SMS, Push)",
  "Automation & CRM",
  "Paid Ads (Meta)",
  "KPI Reporting & Dashboards",
  "Partner Onboarding",
  "Content Strategy & Briefing",
  "A/B Testing & Creative Optimization",
  "User Segmentation",
  "Event-Based Campaign Planning",
  "Negotiation & Contracts",
] as const;

/** Categorized skills for the homepage Skills section (ATS-friendly) */
export const skillGroups = {
  engineering: {
    Backend: ["Supabase", "PostgreSQL", "REST APIs", "Firebase", "Spring Boot", "Python"],
    Frontend: ["Flutter", "Dart", "Riverpod", "Next.js", "TypeScript"],
    Cloud: ["Firebase", "Supabase", "Docker", "AWS"],
    Databases: ["PostgreSQL", "Supabase", "Firebase"],
  },
  marketing: {
    Growth: ["Influencer Marketing", "Creator Partnerships", "Paid Ads", "Product Growth", "Community Building"],
    Automation: ["Growth Systems", "Automation", "CRM", "n8n"],
    Tools: ["Meta Business Suite", "HubSpot", "Notion", "Airtable", "Google Workspace"],
  },
} as const;

/** Per-experience tech chips shown in the experience timeline */
export const experienceTech: Record<string, readonly string[]> = {
  "exp-gymeasy-dev": ["Spring Boot", "Next.js", "Supabase", "PostgreSQL", "AWS"],
  "exp-jairosoft-intern": ["Bubble.io", "Figma"],
  "exp-addu-cs": ["Flutter", "Python", "Supabase", "Figma"],
  "exp-yohoho-lead": ["HubSpot", "n8n", "Meta Business Suite", "Telegram"],
  "exp-yohoho-influ": ["HubSpot", "n8n", "Meta Business Suite"],
  "exp-rivalry-partnerships": ["Meta Business Suite", "Telegram", "HubSpot"],
  "exp-rivalry-community": ["Meta Business Suite", "Viber", "Notion"],
  "exp-rivalry-campaigns": ["Meta Business Suite", "HubSpot", "Notion"],
};

export const projects: Project[] = [
  {
    id: 'campaign-rivalry-tribe-main',
    category: 'marketing',
    title: 'Rivalry Tribe: The Gated D2C Powerhouse',
    date: '2021 - 2024',
    role: 'Community Marketing Specialist',
    color: '#3b82f6',
    results: '12-16K Peak DAU | 100% KYC-Verified',
    deliverables: [
      'KYC-Gated Onboarding Funnel',
      'Community Resilience Strategy',
      'D2C Retention Architecture',
      'High-Intent Audience Filtering'
    ],
    description: "Architected and scaled 'Rivalry Tribe', a private D2C community gated by a strict manual KYC-verification funnel. By requiring active User IDs for entry, I built a 100% qualified audience of 22,000 members averaging 12,000-16,000 daily active users. Following a platform strike, I engineered a rapid recovery strategy, rebuilding to 12,000 members while maintaining 6,000-9,000 daily active users, turning the community into Rivalry's most efficient retention and support channel.",
    media: { type: 'image', url: '/rivalry/new-tribe.jpg' },
    gallery: [],
  },
  {
    id: 'campaign-rivalry-evergreen',
    category: 'marketing',
    title: 'Tribe Evergreen: KYC & Education Infrastructure',
    date: '2023 - 2024',
    role: 'Community Marketing Specialist',
    color: '#10b981',
    results: '60% Reg-to-KYC Conversion',
    deliverables: [
      'Responsible Gambling Framework',
      'Product Education Infographics',
      'CS Load Reduction Strategy',
      'User Security Training'
    ],
    description: 'Developed a permanent educational content infrastructure to optimize the user lifecycle. By deploying strategic infographics on account security and withdrawal workflows, I achieved a 60% conversion rate from registration to KYC-verified status. This "first line of defense" strategy significantly reduced Customer Support ticket volume while ensuring that 100% of verified community members remained active, high-intent users.',
    media: { type: 'image', url: '/rivalry/guide.jpg' },
    gallery: [
      '/rivalry/viber-announcement.png',
      '/rivalry/info-tribe-1.png',
      '/rivalry/info-tribe-2.png',
      '/rivalry/tribe-4.png',
      '/rivalry/tribe-3.png',
      '/rivalry/matchups.jpg',
      '/rivalry/bbc.jpg',
      '/rivalry/guide.jpg',
      '/rivalry/tribe-5.png',
      '/rivalry/tribe-6.png',
      '/rivalry/tribe-7.jpg',
      '/rivalry/tribe-8.png',
      '/rivalry/tt.jpg',
    ]
  },
  {
    id: 'campaign-slamdunk-slips',
    category: 'marketing',
    title: 'Slamdunk Slips: NBA Seasonal Scale',
    date: 'NBA Season 2023-24',
    role: 'Marketing & Influencer Specialist',
    color: '#f59e0b',
    results: '+$7.5K Daily Profit | +15% Daily NGR',
    deliverables: [
      'Copy-Bet Workflow Optimization',
      'Influencer Content Calendar',
      'Market-Specific Activation',
      'ROI Tracking'
    ],
    description: 'Capitalized on the high-volume NBA market by launching "Slamdunk Slips," a campaign centered on "copy-bet" mechanics. I managed a calendar of influencer posts where creators shared exclusive NBA SGC bets via direct URLs. This streamlined user journey led to a sustained 15% increase in daily average NGR throughout the season, translating to an additional $5,000 - $7,500 in daily profit.',
    media: { type: 'image', url: '/rivalry/sgc-announcement.jpg' },
    gallery: [
      '/rivalry/sgc-420.png',
      '/rivalry/sgc-tribe-giveaway.png',
      '/rivalry/sgc-mus.jpg',
    ],
  },
  {
    id: 'campaign-kuyanic-ti',
    category: 'marketing',
    title: 'Rivalry x KuyaNic: O2O Watch Party',
    date: 'The International (TI) 11 - 2022',
    role: 'Campaigns & Affiliate Specialist',
    color: '#6366f1',
    results: '1,000+ New Verified Users in 5 Days',
    deliverables: [
      'O2O (Offline-to-Online) Strategy',
      'Experiential Booth Design',
      'High-Barrier UA Funnel',
      'B2B Partnership Management'
    ],
    description: 'Took full ownership of the KuyaNic TI Watch Party as the primary on-ground lead, stepping in to manage the event end-to-end from planning through execution. Designed and produced all physical brand assets including GFX photo frames and the Rivalry photobooth, coordinated on-site influencer schedules and meet-and-greets, delegated roles across the activation team, and built an IRL prize-claim funnel gated by Tribe membership and a deposit requirement, converting walk-in attendees to verified depositors on the spot. The activation resulted in 1,000+ new verified users within 5 days at a 60-70% on-site conversion rate.',
    media: {
      type: 'video',
      url: "https://res.cloudinary.com/dvjnueacb/video/upload/q_auto/f_auto/v1778967295/AQOQnj--KjMtP0_opa50TV397WOlJ2f3JPLZ1XnkuRzH9XPvHHi-c2iwg9QGWYfExp0fKZGXd5-JwCYObWXQ0J2T-DE3MtwILRfz14cL2B5vsw_itgrfd.mp4",
      thumbnail: '/rivalry/watchparty-cover.jpg',
    },
    gallery: [
      '/rivalry/watchparty-1.jpg',
      '/rivalry/watchparty-2.jpg',
      '/rivalry/watchparty-3.jpg',
      '/rivalry/watchparty-4.jpg',
      '/rivalry/watchparty-5.jpg',
      '/rivalry/watchparty-cover.jpg',
      '/rivalry/watchparty-cover-1.jpg',
    ]
  },
  {
    id: 'campaign-sgc-launch',
    category: 'marketing',
    title: 'Same Game Combos: Feature GTM Strategy',
    date: 'Feature Launch',
    role: 'Marketing & Influencer Specialist',
    color: '#ef4444',
    results: '+20% MoM Volume | +5% NGR',
    deliverables: [
      'Go-To-Market (GTM) Strategy',
      'Viral Content Engineering',
      'Influencer Education Briefs',
      'Cross-Channel Feature Promotion'
    ],
    description: "Spearheaded the regional launch of 'Same Game Combos' (SGC), Rivalry's proprietary parlay feature. I engineered a viral educational campaign across Facebook and Telegram, leveraging influencers to explain the high-upside potential of the product. The campaign resulted in a 20% Month-over-Month increase in transaction volume and a 5% boost in Net Gaming Revenue (NGR), maintaining the Philippines as Rivalry's #1 global region.",
    media: { type: 'image', url: '/rivalry/sgc-cover.png' },
    gallery: [
      '/rivalry/sgc-cover.png',
      '/rivalry/sgc-1.png',
      '/rivalry/sgc-2.png',
      '/rivalry/sgc-3.png',
      '/rivalry/sgc-4.png',
      '/rivalry/sgc-420.png',
      '/rivalry/sgc-tribe-giveaway.png',
      '/rivalry/bbc.jpg',
    ],
  },
  {
    id: 'campaign-rampage-report',
    category: 'marketing',
    title: 'Rampage Report: Dota 2 Market Stimulation',
    date: 'Weekly Series',
    role: 'Community Marketing Specialist',
    color: '#ef4444',
    results: '+15% Market Activity | 900 Peak CCV',
    deliverables: [
      'Livestream Programming',
      'Influencer Briefing & Spiels',
      'Real-time Market Activation',
      'Interactive Code Drops'
    ],
    description: 'Produced and managed a weekly community livestream show featuring top-tier Dota 2 influencers. The program focused on live product demonstrations where influencers shared bet-slips and predictions in real-time. This interactive format drove a consistent 10-15% surge in Dota 2 market activity during broadcasts and reached peak concurrent viewership of 900+ high-intent bettors.',
    media: { type: 'image', url: '/rivalry/rr-3.png' },
    gallery: [
      '/rivalry/rr.jpg',
      '/rivalry/rr-2.jpg',
      '/rivalry/rr.png',
      '/rivalry/rr-3.png',
      '/rivalry/rr-4.png',
    ],
  },
  {
    id: 'campaign-valentines-parlay',
    category: 'marketing',
    title: 'The Parlay That Got Away: Seasonal Activation',
    date: 'Feb 2024',
    role: 'Marketing & Influencer Specialist',
    color: '#ec4899',
    results: '+$1K Daily NGR | +150 Verified Members',
    deliverables: [
      'Influencer Talent Management',
      'Seasonal Giveaway Architecture',
      'SGC Feature Integration',
      'Rapid Community Growth'
    ],
    description: "Executed a high-impact 3-day Valentine's Day activation featuring influencer Kayla Heredia. By gating giveaway entry behind the use of the Same Game Combo feature, the campaign drove a 3% increase in daily NGR and acquired 150+ new KYC-verified members for the Rivalry Tribe community in just 72 hours.",
    media: { type: 'image', url: '/rivalry/parlay-1.png' },
    gallery: [
      '/rivalry/thread.png',
      '/rivalry/thread-2.png',
      '/rivalry/thread-3.jpg',
    ]
  },
  {
    id: 'campaign-growth-automation',
    category: 'systems',
    title: 'Growth Automation System',
    date: '2025',
    role: 'Growth Engineer',
    color: '#f97316',
    description: 'Placeholder: automated creator onboarding, lifecycle messaging, and performance reporting built on n8n, HubSpot, and Meta Business Suite.',
    problem: 'Placeholder: manual campaign operations do not scale across many creator partners.',
    solution: 'Placeholder: automated onboarding pipelines, lifecycle email/SMS/push, and dashboard reporting.',
    impact: 'Placeholder: partner network scaled, activation time cut, reporting automated.',
    tags: ['n8n', 'HubSpot', 'Meta Business Suite', 'Automation'],
    caseStudyHref: '/marketing',
  },
  {
    id: 'proj-gymeasy',
    category: 'software',
    title: 'GymEasy - SaaS Gym Management Platform',
    date: 'June 2025 -',
    role: 'Founder · Project Manager, Back-end Developer',
    color: '#3b82f6',
    results: '67% Staff Reduction',
    tags: ['Next.js', 'Spring Boot', 'PostgreSQL', 'AWS'],
    description: 'A full end-to-end SaaS gym management system currently live in paid beta with active users. Automates complete front-desk workflows including QR-based attendance, digitalized POS, coach-client pipelines, and scheduling, delivering a 67% reduction in required front-desk workforce through platform automation.',
    media: {
      type: 'image' as const,
      url: '/gymeasy/attend1.png',
    },
    liveUrl: 'https://staging.gymeasy.app',
    repoUrl: '',
    problem: 'Gyms drown in front-desk admin: paper attendance, manual POS, fragmented scheduling, and disconnected coach-client pipelines.',
    solution: 'Built an end-to-end SaaS with QR-based attendance, digitalized POS, coach-client pipelines, and scheduling, deployed on a Spring Boot + Next.js stack with PostgreSQL and AWS.',
    impact: '67% reduction in required front-desk staff. Live in paid beta with active users.',
    caseStudyHref: '/software',
  },
  {
    id: 'proj-agripinoy',
    category: 'software',
    title: 'Agri-Pinoy: RAG-Powered Philippine Agri-Chatbot',
    date: 'Feb 2026',
    role: 'Lead Front-End Developer',
    color: '#3b82f6',
    tags: ['Flutter', 'Dart', 'Mobile', 'Supabase'],
    description: 'A Flutter-based AI chatbot that helps Filipino farmers with practical advice on growing common Pinoy crops. Built with a RAG (Retrieval-Augmented Generation) backend, real-time evaluation pipeline, and Supabase data logging.',
    media: {
      type: 'image' as const,
      url: '/agripinoy/desk.png',
    },
    liveUrl: 'https://agri-pinoy-web.netlify.app/',
    repoUrl: 'https://github.com/shaheenNawaf/chatbot_ui_agribot',
    problem: 'Filipino farmers lack accessible, localized agronomy advice for common Pinoy crops.',
    solution: 'Built a Flutter chatbot backed by a RAG pipeline, real-time evaluation, and Supabase data logging, served via a web app.',
    impact: 'Deployed to a public web app. RAG-grounded answers in Filipino farming context.',
    caseStudyHref: '/software',
  },
  {
    id: 'proj-staysafe',
    category: 'software',
    title: 'StaySafe: AirBNB Clone via Flutter',
    date: 'Dec 2024',
    role: 'Full Stack Developer',
    color: '#ec4899',
    tags: ['Flutter', 'UI/UX', 'Full-Stack'],
    description: 'A Full end-to-end clone of AirBNB done natively via Flutter.',
    media: {
      type: 'image' as const,
      url: '/staysafe/home.png',
    },
    liveUrl: 'https://safe-stay-exer.netlify.app/',
    repoUrl: 'https://github.com/shaheenNawaf/StaySafe',
    problem: 'Travelers need a simple, native booking experience; the team needed a full end-to-end clone of a marketplace app.',
    solution: 'Built a full AirBNB-style app natively in Flutter, end to end, including UI, flows, and backend integration.',
    impact: 'Deployed to staging as a complete end-to-end marketplace clone.',
    caseStudyHref: '/software',
  },
  {
    id: 'proj-JCSD',
    category: 'software',
    title: 'Inventory & Employee Management System',
    date: 'March 2025',
    role: 'Full Stack Developer',
    color: '#ec4899',
    tags: ['Flutter', 'Supabase', 'Full-Stack'],
    description: 'A full end-to-end booking and management application built for a computer service and repair shop. Features customer-facing maintenance booking, serialized inventory tracking with stock in/out monitoring, and automated HR functionality covering payroll, leave, and absence management.',
    media: {
      type: 'image' as const,
      url: '/jcsd/dash.png',
    },
    liveUrl: '',
    repoUrl: 'https://github.com/shaheenNawaf/JCSD_Flutter',
    problem: 'A computer service and repair shop ran stock and HR on paper, leading to errors and slow operations.',
    solution: 'Built a Flutter + Supabase app with customer-facing maintenance booking, serialized inventory tracking with stock in/out, and automated payroll, leave, and absence management.',
    impact: 'Inventory and HR automated end to end for the shop, replacing manual processes.',
    caseStudyHref: '/software',
  },
  {
    id: 'proj-esp32',
    category: 'systems',
    title: 'ESP32 IoT Project',
    date: '2025',
    role: 'Firmware & Full-stack Developer',
    color: '#3b82f6',
    description: 'Placeholder: ESP32-based IoT device with REST telemetry and a companion dashboard.',
    problem: 'Placeholder: describe the field or monitoring problem this device solves.',
    solution: 'Placeholder: ESP32 firmware + REST API + realtime dashboard.',
    impact: 'Placeholder: deployed devices reporting telemetry.',
    tags: ['ESP32', 'IoT', 'REST APIs', 'Firmware'],
    caseStudyHref: '/software',
  },
];

export const experiences: Experience[] = [
  {
    id: 'exp-gymeasy-dev',
    category: 'software',
    title: 'Project Manager & Back-end Developer',
    company: 'GymEasy',
    date: 'June 2025 - Present',
    location: 'Davao, Philippines',
    color: '#3b82f6',
    description: 'Leading back-end architecture and project coordination for a full-service gym management SaaS targeting MSME gym owners.',
    details: [
      'Architected the Spring Boot back-end and database schema, handling member management, attendance tracking, and billing workflows.',
      'Coordinated a cross-functional team using Agile sprints, maintaining a staging deployment at gymeasy.app throughout active development.',
      'Integrated REST APIs between the Next.js front-end and Spring Boot services, with Supabase handling real-time data sync.',
    ],
  },
  {
    id: 'exp-jairosoft-intern',
    category: 'software',
    title: 'Bubble.io Web Developer - Internship',
    company: 'JairoSoft',
    date: 'May 2025 - June 2025',
    location: 'Davao, Philippines (On-site)',
    color: '#10b981',
    description: 'Developed core pages and corrected structural database design flaws within JairoSoft Institutes Learning Management System.',
    details: [
      'Developed 6 core pages for JairoSoft Institute of Technology\'s LMS, including Faculty, Course Edit/Add, and Admin Dashboards.',
      'Built reusable, high-performance UI components including an image carousel with dynamic link structures.',
      'Restructured and corrected the platform\'s relational database ERD after identifying critical design flaws from previous development cycles.',
      'Completed all software deliverables within 200 hours while serving as Scrum Master for 100 hours of the internship period.',
    ],
  },
  {
    id: 'exp-addu-cs',
    category: 'software',
    title: 'B.S. Computer Science, Dean\'s List',
    company: 'Ateneo de Davao University',
    date: '2021 - 2026',
    location: 'Davao, Philippines',
    color: '#6366f1',
    description: 'Graduating Computer Science student with a focus on full-stack development, AI systems, and software engineering methodology.',
    details: [
      'Completed major projects in Flutter (mobile/web), Python data pipelines, and RAG-based AI systems, all deployed to production or staging.',
      'Dean\'s List recognition (2021-2022) reflecting consistent academic performance alongside active industry work.',
      'Applied Systems Analysis & Design and Agile methodology across team capstone projects, including GymEasy.',
    ],
  },
  {
    id: 'exp-yohoho-lead',
    category: 'marketing',
    title: 'Philippines Team Lead',
    company: 'Yohoho',
    date: 'June 2025 - October 2025',
    location: 'Remote',
    color: '#f97316',
    description: 'Kept running costs down while ensuring a strict-4:1 ROAS.',
    details: [
      'Generated $355K in transaction volume and $100K in user acquisition revenue across 4 months by running coordinated campaigns across email, SMS, push, influencers, and Telegram, scaling the retention channel from 0 to 1,000 members in 2 weeks.',
      'Grew monthly transaction volume to a record $133K from a $72.8K August low by pivoting campaign focus from acquisition to retention at first sign of market volatility, rebounding 83% in a single month.',
      'Maintained a 4:1 ROAS across macro-creator partnerships (1M+ followers) by coordinating campaign asset delivery, payment scheduling, and KPI milestone tracking throughout the campaign period.',
    ],
    gallery: [
      '/yohoho/initial-contracts.jpg',
    ],
    video: '',
  },
  {
    id: 'exp-yohoho-influ',
    category: 'marketing',
    title: 'Influencer Specialist',
    company: 'Yohoho',
    date: 'June 2025 - October 2025',
    location: 'Remote',
    color: '#B5F916',
    description: 'Directed rapid-scale influencer recruitment and social expansion, driving $355K in bet volume.',
    details: [
      'Sustained a 4:1 ROAS while capping partner costs at 25% of generated revenue by restructuring 23 creator partnerships into performance-based models.',
      'Drove a record $133K transaction volume and $46K deposit volume in September 2025 by launching a Partner Referral Program that scaled the network to 10+ CPA-only partners, reducing overall CAC.',
      'Reduced partner activation time by 78% (14 days to 3 days) by building an automated onboarding pipeline with templated workflows and centralized document tracking.',
    ],
    gallery: [
      '/yohoho/yohoho-1.png'
    ],
    video: '',
  },
  {
    id: 'exp-rivalry-partnerships',
    category: 'marketing',
    title: 'Partnerships & Influencer Specialist',
    company: 'Rivalry.com',
    date: 'Sept 2021 - July 2024',
    location: 'Remote',
    color: '#ef4444',
    description: 'Managed end-to-end lifecycle influencer marketing campaigns and management for 10 VIP influencers (total 37M+ followers) bringing in 10M USD in Monthly Deposits.',
    details: [
      'Closed the Tier One Entertainment B2B deal by leading the pitch process, securing the Blacklist Rivalry Dota 2 partnership.',
      'Grew affiliate-driven revenue 40% and new user conversions 15-20% QoQ by managing full campaign lifecycle for 10 VIP partners (37M+ combined followers).',
      'Converted 60-70% of 500+ watch party attendees to verified depositors on-site by running full on-ground execution of the KuyaNic and V33Wise activations: GFX production, photobooth setup, influencer coordination, and a live prize-claim/KYC funnel.',
      'Processed $240K+ in agency spend across 20 invoices by drafting contracts, managing retainer and project-based billing for CBZN and LuponWXC, and reconciling each payment against contract terms and performance bonuses.',
      'Wrote 40+ content briefs and managed daily execution across posts, video, and livestreams, contributing to consistent 5-9% MoM performance gains across the partner portfolio.',
    ],
    gallery: [
      '/rivalry/rivalry-tribe.jpg',
      '/rivalry/pindabali.jpg',
      '/rivalry/bali-1.jpg',
    ],
    video:
      'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fwatch%2F%3Fv%3D483447207175593&show_text=0',
  },
  {
    id: 'exp-rivalry-community',
    category: 'marketing',
    title: 'Community Marketing Specialist',
    company: 'Rivalry.com',
    date: 'June 2023 - July 2024',
    location: 'Remote',
    color: '#3b82f6',
    description: 'Scaled direct-to-consumer marketing communities through Facebook and Viber',
    details: [
      'Rebuilt a 22,000-member Facebook community to 12,000 members after a platform strike by replicating the same content playbook into a new group, sustaining 30-40% active engagement throughout.',
      'Pushed platform activity from 2% to 20% during peak events by running weekly campaign activations tied to cultural moments, coordinating content scheduling, audience targeting, and engagement tracking.',
      'Ran lifecycle offer drops and re-engagement sequences across a 1,200-member Viber channel, with limited code drops of 200 claimed in under 60 seconds per release.',
      'Increased Daily Deposit Amount by 5-8% per activation window by running recurring "Bring Me" deposit campaigns gated by minimum bet requirements, with the League of Legends activation hitting the 8% peak.',
    ],
    gallery: [
      '/rivalry/new-tribe.jpg',
      '/rivalry/viber.jpg',
      '/rivalry/bbc.jpg',
      '/rivalry/nsns.jpg',
      '/rivalry/tt.jpg',
    ],
    video: 'https://www.facebook.com/plugins/video.php?href=https%3A%2F%2Fwww.facebook.com%2Fkuyanicwxc%2Fvideos%2F1425324814659531&show_text=0',
  },
  {
    id: 'exp-rivalry-campaigns',
    category: 'marketing',
    title: 'Campaign and Affiliates Specialist',
    company: 'Rivalry.com',
    date: 'Sept 2021 - Aug 2022',
    location: 'Remote',
    color: '#643BF6',
    description: "Created a proper lead-generating and end-to-end management pipeline for Rivalry's initial PH Affiliate Network.",
    details: [
      "Built Rivalry's Philippine affiliate network from zero to 20+ partners across Valorant, Dota 2, CS2, and League of Legends through manual cold outreach, setting the onboarding and tracking framework all subsequent campaigns ran on.",
      'Established performance-based spend allocation tied to conversion and revenue data from the first campaign, building the foundation that sustained 15-20% QoQ growth over 3 years.',
      "Ran Rivalry Philippines' first campaigns including giveaways, local tournaments, and livestream events, establishing early brand presence across Valorant, Dota 2, and League of Legends influencer communities.",
    ],
    gallery: [
      '/rivalry/initial-edits.jpg',
      '/rivalry/initial-campaign.jpg',
      '/rivalry/initial-campaign-2.jpg',
      '/rivalry/initial-affiliates.jpg',
    ],
    video: '',
  },
];
