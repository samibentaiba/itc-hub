// prisma/mocks/vlog.mock.ts
interface VlogMock {
  title: string;
  slug: string;
  description: string;
  image: string;
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

const vlogs: VlogMock[] = [
  {
    title: "Our Journey to Building ITC Hub",
    slug: "journey-to-itc-hub",
    description: "Behind the scenes of creating our internal platform.",
    image: "https://placehold.co/1280x720.png?text=ITC+Journey",
    gallery: [
      "https://placehold.co/600x400.png?text=Planning+Phase",
      "https://placehold.co/600x400.png?text=Development",
      "https://placehold.co/600x400.png?text=Launch+Day",
    ],
    content: [
      { type: "heading", level: 2, text: "The Beginning" },
      {
        type: "paragraph",
        text: "It all started when @[user:USER-001] noticed the need for a centralized platform. Thanks to @[user:USER-002] for the initial mockups!",
      },
      { type: "heading", level: 3, text: "Development Phase" },
      {
        type: "paragraph",
        text: "We spent three months building the core features, with @[user:USER-003] leading the backend development.",
      },
      {
        type: "image",
        src: "https://placehold.co/800x450.png?text=Team+Working",
        alt: "Team working together",
      },
      { type: "heading", level: 3, text: "Lessons Learned" },
      {
        type: "paragraph",
        text: "Communication is key! Regular standups helped us stay aligned.",
      },
    ],
    authorId: "USER-001",
  },
  {
    title: "Team Building at Engineering Department",
    slug: "team-building-engineering",
    description: "A recap of our recent team building activities.",
    image: "https://placehold.co/1280x720.png?text=Team+Building",
    gallery: [
      "https://placehold.co/600x400.png?text=Activity+1",
      "https://placehold.co/600x400.png?text=Activity+2",
    ],
    content: [
      { type: "heading", level: 2, text: "Great Day Together" },
      {
        type: "paragraph",
        text: "We had an amazing day! Special thanks to @[user:USER-006] for organizing everything.",
      },
      {
        type: "image",
        src: "https://placehold.co/800x450.png?text=Team+Photo",
        alt: "Team photo",
      },
    ],
    authorId: "USER-002",
  },
  {
    title: "New AI Features Coming Soon",
    slug: "new-ai-features",
    description: "Exciting AI capabilities we're adding to the platform.",
    image: "https://placehold.co/1280x720.png?text=AI+Features",
    gallery: [],
    content: [
      { type: "heading", level: 2, text: "Innovation in Progress" },
      {
        type: "paragraph",
        text: "Our AI team, led by @[user:USER-003], is working on intelligent automation features. @[user:USER-005] is handling the data pipeline.",
      },
      {
        type: "code",
        language: "python",
        code: 'def predict_task_priority(task):\n    # AI magic happens here\n    return priority',
      },
    ],
    authorId: "USER-003",
  },
  {
    title: "Q4 2025 Retrospective",
    slug: "q4-2025-retrospective",
    description: "Looking back at our achievements this quarter.",
    image: "placeholder.svg",
    gallery: [],
    content: [
      { type: "heading", level: 2, text: "Amazing Quarter!" },
      {
        type: "paragraph",
        text: "Thanks to everyone's hard work, especially @[user:USER-004] and @[user:USER-007] for their dedication.",
      },
    ],
    authorId: "USER-001",
  },
];

export default vlogs;