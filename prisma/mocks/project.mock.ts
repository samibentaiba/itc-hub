// prisma/mocks/project.mock.ts
interface ProjectMock {
  name: string;
  slug: string;
  description: string;
  image: string;
  projectLink?: string;
  githubLink?: string;
  demoLink?: string;
  type: string;
  tags: string[];
  gallery: string[];
  content: {
    type: string;
    text?: string;
    level?: number;
    src?: string;
    alt?: string;
    code?: string;
    language?: string;
  }[];
  authorId: string;
}

const projects: ProjectMock[] = [
  {
    name: "ITC Hub Platform",
    slug: "itc-hub-platform",
    description: "A comprehensive internal platform for managing teams, departments, and projects.",
    image: "https://placehold.co/1280x720.png?text=ITC+Hub",
    githubLink: "https://github.com/samibentaiba/itc-hub",
    demoLink: "https://itc-hub.vercel.app",
    type: "WEB_DEV",
    tags: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    gallery: [
      "https://placehold.co/600x400.png?text=Dashboard",
      "https://placehold.co/600x400.png?text=Teams+View",
    ],
    content: [
      { type: "heading", level: 2, text: "About the Project" },
      {
        type: "paragraph",
        text: "This project was developed by @samibentaiba. It is a full-stack application using the latest technologies to streamline internal communications and project management.",
      },
      { type: "heading", level: 3, text: "Key Features" },
      {
        type: "paragraph",
        text: "Includes authentication with NextAuth, real-time notifications, team management, ticketing system, and event calendar. Special thanks to @janedoe for UI/UX contributions.",
      },
      {
        type: "image",
        src: "https://placehold.co/800x450.png?text=Feature+Showcase",
        alt: "Feature showcase",
      },
      { type: "heading", level: 3, text: "Tech Stack" },
      {
        type: "code",
        language: "typescript",
        code: 'const framework = "Next.js 15";\nconst database = "PostgreSQL";',
      },
    ],
    authorId: "USER-001",
  },
  {
    name: "AI Chat Assistant",
    slug: "ai-chat-assistant",
    description: "An intelligent chatbot powered by advanced AI for customer support.",
    image: "https://placehold.co/1280x720.png?text=AI+Chat",
    projectLink: "https://example.com/chat",
    type: "AI",
    tags: ["Python", "TensorFlow", "React", "FastAPI"],
    gallery: [],
    content: [
      { type: "heading", level: 2, text: "Overview" },
      {
        type: "paragraph",
        text: "Developed by @johnsmith, this AI assistant helps automate customer support with natural language processing.",
      },
    ],
    authorId: "USER-003",
  },
  {
    name: "Design System Library",
    slug: "design-system-library",
    description: "A comprehensive UI component library for consistent design across products.",
    image: "https://placehold.co/1280x720.png?text=Design+System",
    githubLink: "https://github.com/example/design-system",
    type: "UI_UX",
    tags: ["React", "Storybook", "Tailwind CSS", "TypeScript"],
    gallery: [
      "https://placehold.co/600x400.png?text=Components",
      "https://placehold.co/600x400.png?text=Styles",
    ],
    content: [
      { type: "heading", level: 2, text: "Design Philosophy" },
      {
        type: "paragraph",
        text: "Created by @janedoe to ensure consistency and scalability across all company products.",
      },
    ],
    authorId: "USER-002",
  },
  {
    name: "Network Monitoring Tool",
    slug: "network-monitoring-tool",
    description: "Real-time network monitoring and analytics dashboard.",
    image: "https://placehold.co/1280x720.png?text=Network+Monitor",
    type: "NETWORKING",
    tags: ["Node.js", "WebSocket", "D3.js", "Express"],
    gallery: [],
    content: [
      { type: "heading", level: 2, text: "Features" },
      {
        type: "paragraph",
        text: "Built by @peterjones, this tool provides real-time insights into network performance and security.",
      },
    ],
    authorId: "USER-004",
  },
];

export default projects;