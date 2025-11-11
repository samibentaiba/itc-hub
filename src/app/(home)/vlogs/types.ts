// src/app/(home)/vlogs/types.d.ts

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level: 1 | 2 | 3 | 4 | 5 | 6 }
  | { type: "image"; src: string; alt: string }
  | { type: "code"; code: string; language: string };

export interface VlogAuthor {
  id: string;
  name: string;
  avatar: string | null;
}

export interface VlogLocal {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  authorAvatar?: string | null;
  date: string;
}

export interface VlogDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string | null;
  gallery: string[];
  content: ContentBlock[];
  author: VlogAuthor;
  createdAt: Date;
  updatedAt: Date;
}