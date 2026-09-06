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
  draft?: boolean;
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
  github: "github.com/shaheenNawaf",
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

/** Proof metrics shown in the hero proof band. `num`/`prefix`/`suffix` drive the count-up; `value` is the no-JS fallback. */
export const hubStats = [
  {
    value: "$355K+",
    num: 355,
    prefix: "$",
    suffix: "K+",
    label: "Total Transaction Volume in just 4 months",
    sub: "Grew from $6K/mo to $355K total in just 4 months",
  },
  {
    value: "22K+",
    num: 22,
    prefix: "",
    suffix: "K+",
    label: "Community members",
    sub: "Acquired and retained, KYC-gated",
  },
  {
    value: "25+",
    num: 25,
    prefix: "",
    suffix: "+",
    label: "Influencer partnerships",
    sub: "SEA macro-creators managed end-to-end",
  },
  {
    value: "4:1",
    num: 4,
    prefix: "",
    suffix: ":1",
    label: "Validated ROAS",
    sub: "Across every creator onboarded",
  },
  {
    value: "2",
    num: 2,
    prefix: "",
    suffix: "",
    label: "Live SaaS products",
    sub: "In paid beta with real users",
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

/** Toolchains shown in each zone hero */
export const softwareTools = [
  "Cursor & VS Code",
  "Android Studio",
  "Postman",
  "Firebase & Supabase",
  "Bubble.io",
  "Docker",
] as const;

export const marketingTools = [
  "Meta Business Suite",
  "Telegram & Viber",
  "Figma & Canva",
  "Notion & Airtable",
  "HubSpot",
] as const;

export const sharedTools = ["Claude, ChatGPT & n8n"] as const;

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

// NOTE: projects + experiences now live in src/content/projects/*.md and
// src/content/experiences/*.md (editable via /admin). See src/data/content.ts.

export type Stat = (typeof hubStats)[number];

export interface Social {
  id: string;
  label: string;
  href: string;
  icon: 'github' | 'linkedin' | 'mail' | 'doc';
  tint: 'gh' | 'li' | 'mail' | 'doc';
  external: boolean;
  popover: { handle: string; network: string; blurb: string };
}

/** Sticker-style link pills. Single source of truth for the sidebar, hero, and footer. */
export const socials: Social[] = [
  {
    id: 'github',
    label: 'GitHub',
    href: `https://${contact.github}`,
    icon: 'github',
    tint: 'gh',
    external: true,
    popover: {
      handle: 'shaheenNawaf',
      network: 'GitHub',
      blurb: 'Flutter, Next.js, and half-finished experiments.',
    },
  },
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: `https://${contact.linkedin}`,
    icon: 'linkedin',
    tint: 'li',
    external: true,
    popover: {
      handle: 'in/aladwani',
      network: 'LinkedIn',
      blurb: 'Full-stack engineer & growth lead · Davao',
    },
  },
  {
    id: 'email',
    label: 'Email',
    href: `mailto:${contact.email}`,
    icon: 'mail',
    tint: 'mail',
    external: false,
    popover: {
      handle: contact.email,
      network: 'Email',
      blurb: 'Replies within 24–48 hours.',
    },
  },
  {
    id: 'resume-swe',
    label: 'SWE Resume',
    href: resumes.software,
    icon: 'doc',
    tint: 'doc',
    external: true,
    popover: {
      handle: 'PDF · Google Docs',
      network: 'Resume',
      blurb: 'Engineering track, one page.',
    },
  },
  {
    id: 'resume-mkt',
    label: 'MKT Resume',
    href: resumes.marketing,
    icon: 'doc',
    tint: 'doc',
    external: true,
    popover: {
      handle: 'PDF · Google Docs',
      network: 'Resume',
      blurb: 'Growth track, one page.',
    },
  },
];

/** Dotted-underline phrases that reveal a mono-font joke on hover/focus. */
export const secrets = {
  location: { trigger: contact.location, reveal: 'GMT+8 · probably still shipping' },
  roas: { trigger: '4:1 ROAS', reveal: 'math checked out, barely' },
  present: { trigger: 'Present', reveal: 'still here somehow' },
  status: { trigger: hub.status, reveal: "yes, both. no, I don't sleep much" },
} as const;

/** Blur-crossfade word swaps: `from` rests visible, `to` replaces it on hover. */
export const swaps = {
  position: { from: hub.position, to: 'two jobs, one person' },
} as const;

/** Username for the public-activity heatmap popover. */
export const githubUser = 'shaheenNawaf';
