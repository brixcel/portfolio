export type Tech = {
  name: string;
  slug: string;
  invert?: boolean;
};

export const techStack: Tech[] = [
  { name: "React", slug: "react" },
  { name: "TypeScript", slug: "typescript" },
  { name: "JavaScript", slug: "javascript" },
  { name: "Node.js", slug: "nodejs" },
  { name: "Express", slug: "express", invert: true },
  { name: "PostgreSQL", slug: "postgresql" },
  { name: "Prisma", slug: "prisma", invert: true },
  { name: "Tailwind CSS", slug: "tailwindcss" },
  { name: "Next.js", slug: "nextjs", invert: true },
  { name: "Vite", slug: "vitejs" },
  { name: "Laravel", slug: "laravel" },
  { name: "PHP", slug: "php" },
  { name: "MySQL", slug: "mysql" },
  { name: "Firebase", slug: "firebase" },
  { name: "Bootstrap", slug: "bootstrap" },
  { name: "HTML", slug: "html5" },
  { name: "CSS", slug: "css3" },
  { name: "Docker", slug: "docker" },
  { name: "GitHub Actions", slug: "githubactions" },
  { name: "Cloudflare", slug: "cloudflare" },
  { name: "Git", slug: "git" },
  { name: "GitHub", slug: "github", invert: true },
];

export const synctaskStack: Tech[] = [
  { name: "React", slug: "react" },
  { name: "TypeScript", slug: "typescript" },
  { name: "Next.js", slug: "nextjs", invert: true },
  { name: "Node.js", slug: "nodejs" },
  { name: "Express", slug: "express", invert: true },
  { name: "PostgreSQL", slug: "postgresql" },
  { name: "Prisma", slug: "prisma", invert: true },
  { name: "Tailwind CSS", slug: "tailwindcss" },
  { name: "Docker", slug: "docker" },
  { name: "Vite", slug: "vitejs" },
];

export const ursachubStack: Tech[] = [
  { name: "Laravel", slug: "laravel" },
  { name: "PHP", slug: "php" },
  { name: "MySQL", slug: "mysql" },
  { name: "Bootstrap", slug: "bootstrap" },
  { name: "Tailwind CSS", slug: "tailwindcss" },
  { name: "JavaScript", slug: "javascript" },
  { name: "HTML", slug: "html5" },
  { name: "CSS", slug: "css3" },
  { name: "Git", slug: "git" },
];

export const ursachubSocialStack: Tech[] = [
  { name: "Firebase", slug: "firebase" },
  { name: "Laravel", slug: "laravel" },
  { name: "PHP", slug: "php" },
  { name: "Tailwind CSS", slug: "tailwindcss" },
  { name: "JavaScript", slug: "javascript" },
  { name: "HTML", slug: "html5" },
  { name: "CSS", slug: "css3" },
];

export const photoboothStack: Tech[] = [
  { name: "React", slug: "react" },
  { name: "JavaScript", slug: "javascript" },
  { name: "Vite", slug: "vitejs" },
  { name: "Tailwind CSS", slug: "tailwindcss" },
  { name: "HTML", slug: "html5" },
  { name: "CSS", slug: "css3" },
  { name: "Git", slug: "git" },
];

export const ursacdsaStack: Tech[] = [
  { name: "JavaScript", slug: "javascript" },
  { name: "HTML", slug: "html5" },
  { name: "CSS", slug: "css3" },
  { name: "Git", slug: "git" },
];

export const cicdStack: Tech[] = [
  { name: "GitHub Actions", slug: "githubactions" },
  { name: "Cloudflare Pages", slug: "cloudflare" },
  { name: "pnpm", slug: "pnpm" },
  { name: "Node.js", slug: "nodejs" },
];

export const cicdSlides = [
  { src: "/assets/cicd-1.svg", alt: "Deploy pipeline: main, dev and pull requests each land in their own Cloudflare Pages environment" },
];

export const synctaskSlides = [
  { src: "/assets/synctask-1.png", alt: "Synctask landing and sign-in" },
  { src: "/assets/synctask-2.png", alt: "Synctask all-tasks board" },
  { src: "/assets/synctask-4.png", alt: "Synctask task detail with subtasks and properties" },
  { src: "/assets/synctask-7.png", alt: "Synctask new-task dialog with Create with AI" },
  { src: "/assets/synctask-5.png", alt: "Synctask command palette" },
  { src: "/assets/synctask-6.png", alt: "Synctask notifications panel" },
  { src: "/assets/synctask-3.png", alt: "Synctask empty My Tasks board" },
];

export const ursachubSlides = [
  { src: "/assets/ursachub-1.png", alt: "UrsacHub home" },
  { src: "/assets/ursachub-3.png", alt: "UrsacHub campus merchandise products" },
  { src: "/assets/ursachub-4.png", alt: "UrsacHub news and events" },
  { src: "/assets/ursachub-6.png", alt: "UrsacHub student organizations directory" },
  { src: "/assets/ursachub-7.png", alt: "UrsacHub student login" },
  { src: "/assets/ursachub-8.png", alt: "UrsacHub buy products section" },
  { src: "/assets/ursachub-2.png", alt: "UrsacHub news feed" },
  { src: "/assets/ursachub-9.png", alt: "UrsacHub about the developers" },
];

export const ursachubSocialSlides = [
  { src: "/assets/ursachub-social-1.png", alt: "UrsacHub Social student login and welcome screen" },
  { src: "/assets/ursachub-social-2.png", alt: "UrsacHub Social campus feed with posts and interactions" },
  { src: "/assets/ursachub-social-3.png", alt: "UrsacHub Social post creation modal" },
  { src: "/assets/ursachub-social-4.png", alt: "UrsacHub Social student messages list" },
  { src: "/assets/ursachub-social-5.png", alt: "UrsacHub Social real-time student chat conversation" },
];

export const photoboothSlides = [
  { src: "/assets/photobooth-1.png", alt: "Photo Booth landing screen with photostrip preview" },
  { src: "/assets/photobooth-2.png", alt: "Photo Booth Studio with 4-photo 2x2 classic grid and customization" },
  { src: "/assets/photobooth-3.png", alt: "Photo Booth Studio with 3-photo vertical strip layout" },
  { src: "/assets/photobooth-4.png", alt: "Photo Booth Studio with 6-photo 3x2 grid layout" },
  { src: "/assets/photobooth-5.png", alt: "Photo Booth finished keepsake and standalone download" },
];

export const ursacdsaSlides = [
  { src: "/assets/ursacdsa-1.svg", alt: "DSA Workbench dashboard with 8 interactive abstract data type modules" },
  { src: "/assets/ursacdsa-2.svg", alt: "Stack visualization with LIFO discipline, O(1) mutations, and runtime memory staging" },
  { src: "/assets/ursacdsa-3.svg", alt: "Circular Queue visualization with ring buffer topology and modulo arithmetic wrap-around" },
  { src: "/assets/ursacdsa-4.svg", alt: "AVL Tree self-balancing binary search tree with height balance factor and rotation engine" },
  { src: "/assets/ursacdsa-5.svg", alt: "Doubly Linked List bidirectional pointer chain and dynamic memory heap addresses" },
];

export type Slide = { src: string; alt: string };

export type Project = {
  id: string;
  number: string;
  title: string;
  kind: string;
  role: string;
  description: string;
  /** Only what the real interface shows (see the screenshots) — nothing invented. */
  highlights?: string[];
  liveHref?: string;
  githubHref?: string;
  note?: string;
  stack: Tech[];
  slides: Slide[];
  /** Width / height of the screenshots, so the frame never crops them. */
  aspect: string;
  /** CSS custom property suffix: var(--project-<tone>) */
  tone: "moss" | "clay" | "harbor" | "ink-blue" | "rose";
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: "synctask",
    number: "01",
    title: "Synctask",
    kind: "Full-stack web application",
    role: "Full-Stack Developer",
    description:
      "A full-stack task management platform with AI-powered natural-language workflows for organizing and managing projects.",
    highlights: [
      "Create tasks with AI from the new-task dialog",
      "Board, list, calendar and analytics views",
      "Command palette and notifications panel",
      "Task details with subtasks and properties",
    ],
    liveHref: "https://synctask-proj.vercel.app/",
    githubHref: "https://github.com/brixcel/taskflow",
    note: "The repository is named taskflow — the project was renamed to Synctask during development.",
    stack: synctaskStack,
    slides: synctaskSlides,
    aspect: "1439 / 782",
    tone: "moss",
    featured: true,
  },
  {
    id: "egoist-cicd",
    number: "02",
    title: "Egoist Labs CI/CD",
    kind: "Frontend deploy pipelines",
    role: "CI/CD, Egoist Labs",
    description:
      "GitHub Actions workflows that build the Capability Studio and Learning Platform frontends and deploy them to Cloudflare Pages with Wrangler.",
    highlights: [
      "main ships to production, dev to the dev site",
      "Every pull request gets its own preview URL",
      "Nothing deploys until the checks pass",
      "Superseded runs cancel themselves",
    ],
    note: "Wrote Learning Platform's deploy workflow and reworked Capability Studio's into per-environment deploys.",
    stack: cicdStack,
    slides: cicdSlides,
    aspect: "1200 / 750",
    tone: "harbor",
  },
  {
    id: "ursachub",
    number: "03",
    title: "UrsacHub",
    kind: "Campus platform",
    role: "Front-End Developer",
    description:
      "A campus web platform that brings the student store, school news and student organizations together in one place.",
    highlights: [
      "Campus merchandise shop",
      "News and events feed",
      "Student organizations directory",
      "Student login",
    ],
    liveHref: "https://ursachub.onrender.com/student/home",
    githubHref: "https://github.com/markPie29/ursachub",
    note: "Built with a team — this repo covers my front-end work.",
    stack: ursachubStack,
    slides: ursachubSlides,
    aspect: "1430 / 782",
    tone: "clay",
    featured: true,
  },
  {
    id: "ursachub-social",
    number: "04",
    title: "UrsacHub Social",
    kind: "Social networking & campus community platform",
    role: "Lead Developer",
    description:
      "Reimagined URSAC Hub as a social networking platform inspired by Facebook. Students can create posts, interact through likes and comments, join conversations, and stay updated with organizations through a familiar social media experience.",
    highlights: [
      "Social media feed",
      "Posts, likes & comments",
      "Organization pages",
      "Authentication & role management",
    ],
    note: "Led the architecture, the full-stack implementation and the real-time chat.",
    stack: ursachubSocialStack,
    slides: ursachubSocialSlides,
    aspect: "16 / 9",
    tone: "harbor",
  },
  {
    id: "ursac-dsa",
    number: "05",
    title: "DSA Workbench",
    kind: "Interactive academic visualization suite",
    role: "Lead Developer",
    description:
      "A teaching tool built for URS Antipolo Campus that shows what data structures actually do in memory as you push, pop, insert and rotate.",
    highlights: [
      "8 interactive abstract data types",
      "Real-time memory & pointer stage",
      "Ring buffer modulo mechanics",
      "AVL tree rotations & balance factors",
    ],
    liveHref: "https://ursacdsa.vercel.app/index.html",
    note: "Covers Stacks, Regular & Circular Queues, Priority Queues, Singly / Doubly / Circular Linked Lists, and AVL Trees.",
    stack: ursacdsaStack,
    slides: ursacdsaSlides,
    aspect: "1200 / 750",
    tone: "ink-blue",
  },
  {
    id: "photobooth",
    number: "06",
    title: "Photo Booth",
    kind: "Interactive camera & photostrip web app",
    role: "Solo Developer",
    description:
      "A browser photobooth: pick a strip layout, shoot with a countdown, decorate with theme stickers and download the finished strip in high resolution.",
    liveHref: "https://simple-photobooth.vercel.app/",
    githubHref: "https://github.com/brixcel/photo-booth",
    note: "Layouts adapt automatically to the chosen photo count (3, 4 or 6).",
    stack: photoboothStack,
    slides: photoboothSlides,
    aspect: "1024 / 557",
    tone: "rose",
  },
];

