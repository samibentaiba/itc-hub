import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import Link from "next/link";
import React, { JSX } from "react";

type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level: 1 | 2 | 3 | 4 | 5 | 6 }
  | { type: "image"; src: string; alt: string }
  | { type: "code"; code: string; language: string };

enum ProjectType {
  AI = "AI",
  UI_UX = "UI/UX",
  SOFTWARE = "SOFTWARE",
  WEB_DEV = "WEB DEV",
  NETWORKING = "NETWORKING",
  SECURITY = "SECURITY",
  DEV_OPS = "DEV OPS",
  VFX = "VFX",
  MEDIA = "MEDIA",
  SPONSORS = "SPONSORS",
  ROBOTICS = "ROBOTICS",
  GAME_DEV = "GAME DEV",
}

type Project = {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
  projectLink?: string;
  githubLink?: string;
  demoLink?: string;
  type: ProjectType;
  gallery: string[];
  content: ContentBlock[];
};

const projects: { [key: string]: Project } = {
  "project-1": {
    slug: "project-1",
    title: "Project 1",
    description: "This is a description for the first project.",
    imageUrl: "https://placehold.co/1280x720.png?text=Project+1",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
    githubLink: "https://github.com",
    demoLink: "https://vercel.com",
    type: ProjectType.WEB_DEV,
    gallery: [
      "https://placehold.co/600x400.png?text=Image+1",
      "https://placehold.co/600x400.png?text=Image+2",
    ],
    content: [
      { type: "heading", level: 2, text: "About the project" },
      {
        type: "paragraph",
        text: "This project was developed by @samibentaiba. It is a full-stack application using the latest technologies.",
      },
      { type: "heading", level: 3, text: "Features" },
      {
        type: "paragraph",
        text: "It includes features like authentication, real-time chat, and more. Special thanks to @anotheruser for their contribution.",
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
        code: 'const framework = "Next.js";',
      },
    ],
  },
  "project-2": {
    slug: "project-2",
    title: "Project 2",
    description: "This is a description for the second project.",
    imageUrl: "https://placehold.co/1280x720.png?text=Project+2",
    tags: ["React", "JavaScript", "Shadcn UI"],
    projectLink: "https://example.com",
    type: ProjectType.UI_UX,
    gallery: [],
    content: [
      {
        type: "paragraph",
        text: "This is the full content of the second project.",
      },
    ],
  },
  "project-3": {
    slug: "project-3",
    title: "Project 3",
    description: "This is a description for the third project.",
    imageUrl: "https://placehold.co/1280x720.png?text=Project+3",
    tags: ["Node.js", "Express", "Prisma"],
    githubLink: "https://github.com",
    type: ProjectType.SOFTWARE,
    gallery: [],
    content: [
      {
        type: "paragraph",
        text: "This is the full content of the third project.",
      },
    ],
  },
};

function renderContentBlock(block: ContentBlock, index: number) {
  switch (block.type) {
    case "heading":
      const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
      return React.createElement(
        Tag,
        {
          key: index,
          className: `font-bold text-${5 - block.level}xl mt-8 mb-4`,
        },
        block.text,
      );
    case "paragraph":
      const parts = block.text.split(/(@\w+)/g);
      return (
        <p key={index} className="mb-4 text-lg leading-relaxed">
          {parts.map((part, i) => {
            if (part.startsWith("@")) {
              const username = part.substring(1);
              return (
                <Link
                  key={i}
                  href={`/profile/${username}`}
                  className="text-blue-500 hover:underline"
                >
                  {part}
                </Link>
              );
            }
            return part;
          })}
        </p>
      );
    case "image":
      return (
        <div key={index} className="relative my-8 h-96 w-full">
          <Image
            src={block.src}
            alt={block.alt}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
      );
    case "code":
      return (
        <pre
          key={index}
          className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto"
        >
          <code className={`language-${block.language}`}>{block.code}</code>
        </pre>
      );
    default:
      return null;
  }
}

export default function ProjectPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const project = projects[slug];

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="mx-auto max-w-4xl">
        <div className="relative mb-8 h-96 w-full">
          <Image
            src={project.imageUrl}
            alt={project.title}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
        <h1 className="text-5xl font-extrabold mb-4">{project.title}</h1>
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="default">{project.type}</Badge>
          {project.tags.map((tag: string) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
        <div className="flex gap-4 mb-8">
          {project.projectLink && (
            <Button asChild>
              <Link
                href={project.projectLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Project Link
              </Link>
            </Button>
          )}
          {project.githubLink && (
            <Button asChild>
              <Link
                href={project.githubLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                View on GitHub
              </Link>
            </Button>
          )}
          {project.demoLink && (
            <Button asChild variant="secondary">
              <Link
                href={project.demoLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                Live Demo
              </Link>
            </Button>
          )}
        </div>

        {project.gallery.length > 0 && (
          <div className="my-8">
            <h2 className="text-3xl font-bold mb-4">Gallery</h2>
            <Carousel className="w-full">
              <CarouselContent>
                {project.gallery.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <Card>
                        <CardContent className="relative aspect-video flex items-center justify-center p-6">
                          <Image
                            src={image}
                            alt={`Gallery image ${index + 1}`}
                            fill
                            style={{ objectFit: "cover" }}
                            className="rounded-lg"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        )}

        <div className="prose prose-lg dark:prose-invert max-w-none">
          {project.content.map((block, index) =>
            renderContentBlock(block, index),
          )}
        </div>
      </article>
    </div>
  );
}