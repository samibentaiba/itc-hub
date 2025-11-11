// src/app/(home)/projects/types.d.ts

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level: 1 | 2 | 3 | 4 | 5 | 6 }
  | { type: "image"; src: string; alt: string }
  | { type: "code"; code: string; language: string };

export interface ProjectAuthor {
  id: string;
  name: string;
  avatar: string | null;
}

export interface ProjectLocal {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  author?: string;
  authorAvatar?: string | null;
}

export interface ProjectDetail {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  projectLink: string | null;
  githubLink: string | null;
  demoLink: string | null;
  type: string;
  tags: string[];
  gallery: string[];
  content: ContentBlock[];
  author: ProjectAuthor;
  createdAt: Date;
  updatedAt: Date;
}