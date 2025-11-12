// src/app/(protected)/admin/content-types.ts
import { z } from "zod";

// ===== PROJECT TYPES =====

export interface Project {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string | null;
  projectLink: string | null;
  githubLink: string | null;
  demoLink: string | null;
  type: ProjectType;
  tags: string[];
  authorId: string;
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
  status: "draft" | "published" | "pending";
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

export type ProjectType =
  | "AI"
  | "UI_UX"
  | "SOFTWARE"
  | "WEB_DEV"
  | "NETWORKING"
  | "SECURITY"
  | "DEV_OPS"
  | "VFX"
  | "MEDIA"
  | "SPONSORS"
  | "ROBOTICS"
  | "GAME_DEV";

// ===== VLOG TYPES =====

export interface Vlog {
  id: string;
  title: string;
  slug: string;
  description: string;
  image: string | null;
  gallery: string[];
  content: ContentBlock[];
  authorId: string;
  author: {
    id: string;
    name: string;
    avatar: string | null;
  };
  status: "draft" | "published" | "pending";
  createdAt: string;
  updatedAt: string;
  [key: string]: unknown;
}

// ===== CONTENT BLOCK TYPES =====

export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level: 1 | 2 | 3 | 4 | 5 | 6 }
  | { type: "image"; src: string; alt: string }
  | { type: "code"; code: string; language: string };

// ===== PENDING REQUEST TYPES =====

export interface PendingProject extends Project {
  submittedBy: string;
  submittedById: string;
  submittedByType: "user" | "team" | "department";
  submittedAt: string;
}

export interface PendingVlog extends Vlog {
  submittedBy: string;
  submittedById: string;
  submittedByType: "user" | "team" | "department";
  submittedAt: string;
}

// ===== FORM SCHEMAS =====

export const projectFormSchema = z.object({
  name: z.string().min(3, { message: "Project name must be at least 3 characters." }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug must be lowercase with hyphens only." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  image: z.string().url({ message: "Please enter a valid image URL." }).optional(),
  projectLink: z.string().url({ message: "Please enter a valid URL." }).optional().or(z.literal("")),
  githubLink: z.string().url({ message: "Please enter a valid GitHub URL." }).optional().or(z.literal("")),
  demoLink: z.string().url({ message: "Please enter a valid demo URL." }).optional().or(z.literal("")),
  type: z.enum([
    "AI", "UI_UX", "SOFTWARE", "WEB_DEV", "NETWORKING",
    "SECURITY", "DEV_OPS", "VFX", "MEDIA", "SPONSORS",
    "ROBOTICS", "GAME_DEV"
  ]),
  tags: z.string().min(1, { message: "Please add at least one tag." }),
  status: z.enum(["draft", "published", "pending"]),
});

export const vlogFormSchema = z.object({
  title: z.string().min(3, { message: "Vlog title must be at least 3 characters." }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters." })
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, { message: "Slug must be lowercase with hyphens only." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  image: z.string().url({ message: "Please enter a valid image URL." }).optional(),
  status: z.enum(["draft", "published", "pending"]),
});

export type ProjectFormData = z.infer<typeof projectFormSchema>;
export type VlogFormData = z.infer<typeof vlogFormSchema>;

// ===== UTILITY TYPES =====

export type ContentStatus = "draft" | "published" | "pending";

export interface ContentStats {
  total: number;
  published: number;
  pending: number;
  draft: number;
}