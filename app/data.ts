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
  { name: "Bootstrap", slug: "bootstrap" },
  { name: "HTML", slug: "html5" },
  { name: "CSS", slug: "css3" },
  { name: "Docker", slug: "docker" },
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
