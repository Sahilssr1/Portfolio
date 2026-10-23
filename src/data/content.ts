/**
 * Central, typed content for the portfolio.
 * Every fact here comes from Sahil's resume / brief — no invented metrics.
 * Edit this file to update the site; `showAvailability` controls the hero badge.
 */

export const siteConfig = {
  name: "Sahil Kumar",
  title: "Sahil Kumar — Software Engineer | Full Stack Developer",
  description:
    "Portfolio of Sahil Kumar, a software engineer and full-stack developer building scalable web and mobile applications, REST APIs, and database-driven systems with ASP.NET, React, Flutter, and FastAPI.",
  url: "https://sahil-sahils-projects-be6abc0e.vercel.app",
  email: "Sahilsinghrajput394@gmail.com",
  github: "https://github.com/Sahilssr1",
  githubUsername: "Sahilssr1",
  linkedin: "https://linkedin.com/in/sahil-kumar-82a785312",
  resumePath: "/Sahil_Kumar_Resume.pdf",
  /** Flip to false to hide the availability badge in the hero. */
  showAvailability: true,
  availabilityLabel: "Open to software engineering opportunities",
};

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
  current?: boolean;
  points: string[];
}

export const experience: ExperienceItem[] = [
  {
    role: "Full Stack Developer",
    company: "Sanjivani Media and Technology",
    period: "March 2025 — Present",
    current: true,
    points: [
      "Develop and maintain production web applications using C#, ASP.NET, and MySQL.",
      "Build REST API integrations and backend business logic for database-driven features.",
      "Create responsive user interfaces using HTML, CSS, JavaScript, and Bootstrap.",
      "Implement authentication, authorization, and employee and attendance management workflows.",
      "Optimize SQL queries and application logic to improve performance and scalability.",
      "Debug and resolve production issues across frontend, backend, and database layers.",
      "Support testing, deployment, and post-release troubleshooting with the team.",
    ],
  },
  {
    role: "Web Development Intern",
    company: "Sanjivani Media and Technology",
    period: "August 2024 — March 2025",
    points: [
      "Started at Sanjivani Media and Technology as a web development intern, contributing to production web applications.",
      "Worked with C#, ASP.NET, and MySQL on backend features and database operations.",
      "Built responsive pages with HTML, CSS, JavaScript, and Bootstrap alongside senior developers.",
      "Progressed to a full-time Full Stack Developer role in March 2025.",
    ],
  },
];

export interface Project {
  id: string;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  technologies: string[];
  status: string;
  highlight?: string;
  links: { label: string; href: string; kind: "live" | "repo" | "store" }[];
}

export const projects: Project[] = [
  {
    id: "atheleos",
    name: "Atheleos",
    tagline: "Sports Social Platform",
    description:
      "A complete sports social platform for athletes, coaches, scouts, and brands — live on the web, with a Flutter mobile app in testing and a full-featured React admin console.",
    features: [
      "Athlete profiles, social posts, and short-form video clips.",
      "24-hour stories, real-time chat, and events.",
      "Flutter mobile app with Firebase Auth and Firestore data management.",
      "Cloudflare R2 media storage and FCM push notifications.",
      "React + TypeScript admin panel with around 80 API endpoints across 18 sections.",
      "Content moderation, reports and appeals, verification queue, analytics, role-based access, and audit logs.",
    ],
    technologies: [
      "React",
      "TypeScript",
      "Express",
      "Flutter",
      "Firebase",
      "Firestore",
      "Cloud Functions",
      "Cloudflare R2",
      "FCM",
    ],
    status: "Website live · Mobile app in testing",
    highlight: "~80 admin API endpoints · 18 sections",
    links: [
      { label: "Live Website", href: "https://atheleos.in", kind: "live" },
      { label: "App Repository", href: "https://github.com/Sahilssr1/Atheleos_App", kind: "repo" },
      { label: "Admin Repository", href: "https://github.com/Sahilssr1/Atheleos_Admin", kind: "repo" },
    ],
  },
  {
    id: "hrms",
    name: "HR Management System",
    tagline: "Production HR platform — web & mobile",
    description:
      "A production HR management system used by real staff, covering the full employee lifecycle from geo-fenced attendance to attendance-driven payroll, published on the Google Play Store.",
    features: [
      "Centralized employee profiles and records with secure, database-backed storage.",
      "Geo-fenced attendance with device-based authentication, reducing proxy attendance.",
      "Break In / Out tracking with automated time calculation.",
      "Leave requests and late-arrival management linked to attendance data.",
      "Payroll processing driven by attendance, leave, and late records.",
      "Attendance, leave, and payroll reports for HR and management review.",
      "Admin panel with authentication and authorization controls.",
    ],
    technologies: ["C#", "ASP.NET", "MySQL", "Bootstrap 5", "REST APIs"],
    status: "Published on Google Play",
    highlight: "5,000+ downloads on Google Play",
    links: [
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.sanjivani.SanjivaniGroup",
        kind: "store",
      },
    ],
  },
  {
    id: "ai-voice",
    name: "AI Voice Calling Platform",
    tagline: "Open-source real-time AI voice agent",
    description:
      "A real-time AI voice calling platform that runs entirely on open-source models hosted locally — no paid AI APIs. Browser microphone in, spoken conversation out, in English and Hindi.",
    features: [
      "Pipeline of voice activity detection, speech-to-text, LLM, and text-to-speech using only local open-source models.",
      "WebSocket call protocol with barge-in support for natural interruptions.",
      "Async FastAPI backend with JWT authentication and per-agent tool calling.",
      "RAG knowledge base over uploaded documents.",
      "Call transcripts and latency stored in PostgreSQL; React dashboard for agents and calls.",
      "Docker Compose deployment and 23 pytest tests.",
    ],
    technologies: [
      "Python",
      "FastAPI",
      "WebSockets",
      "React",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Ollama",
      "faster-whisper",
    ],
    status: "Open source",
    highlight: "Fully self-hosted · English & Hindi",
    links: [
      { label: "GitHub Repository", href: "https://github.com/Sahilssr1/New_Voice_model", kind: "repo" },
    ],
  },
];

export interface SkillCategory {
  title: string;
  skills: string[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: "Languages",
    skills: ["JavaScript", "TypeScript", "C#", "SQL", "Java", "Python (basic)", "Dart", "HTML5", "CSS3"],
  },
  {
    title: "Frontend & Mobile",
    skills: ["React.js", "Next.js", "Tailwind CSS", "Bootstrap 5", "Flutter", "Android Development"],
  },
  {
    title: "Backend",
    skills: ["Node.js", "Express", "ASP.NET", "FastAPI", "REST APIs", "WebSockets", "Authentication & Authorization"],
  },
  {
    title: "Databases",
    skills: ["MySQL", "PostgreSQL", "Firestore", "Database Design", "SQL Query Optimization"],
  },
  {
    title: "Tools & Platforms",
    skills: ["Git", "GitHub", "Docker", "Firebase", "Cloudflare", "Visual Studio"],
  },
];

export interface EducationItem {
  degree: string;
  institution: string;
  period: string;
  status: string;
}

export const education: EducationItem[] = [
  {
    degree: "Master of Computer Applications (MCA)",
    institution: "Lovely Professional University",
    period: "2025 — 2027",
    status: "Pursuing",
  },
  {
    degree: "Bachelor of Science (B.Sc.) — Information Technology",
    institution: "Patliputra University",
    period: "2022 — 2025",
    status: "Completed",
  },
];

/** Repositories featured in the GitHub section — fetched live from the GitHub API. */
export const featuredRepos: string[] = [
  "New_Voice_model",
  "Atheleos_App",
  "Atheleos_Admin",
  "insta_Insights",
  "CallingStream",
  "Nemi",
];

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];
