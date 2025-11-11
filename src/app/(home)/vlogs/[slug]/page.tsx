import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

type Vlog = {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  date: string;
  gallery: string[];
  content: ContentBlock[];
};

const vlogs: { [key: string]: Vlog } = {
  "vlog-1": {
    slug: "vlog-1",
    title: "Vlog Post 1",
    description: "This is a description for the first vlog post.",
    imageUrl: "https://placehold.co/1280x720.png?text=Vlog+Post+1",
    author: "Sami",
    date: "2025-11-11",
    gallery: [
      "https://placehold.co/600x400.png?text=Image+1",
      "https://placehold.co/600x400.png?text=Image+2",
      "https://placehold.co/600x400.png?text=Image+3",
      "https://placehold.co/600x400.png?text=Image+4",
    ],
    content: [
      { type: "heading", level: 2, text: "Introduction" },
      {
        type: "paragraph",
        text: "This is the full content of the first vlog post. It can be a long text with markdown formatting. Thanks to @samibentaiba for the help!",
      },
      { type: "heading", level: 3, text: "Section 1.1" },
      { type: "paragraph", text: "Here is some content for the first section." },
      {
        type: "image",
        src: "https://placehold.co/800x450.png?text=In-content+Image",
        alt: "In-content image",
      },
      { type: "heading", level: 3, text: "Section 1.2" },
      {
        type: "paragraph",
        text: "Here is some more content. @anotheruser was also involved.",
      },
      {
        type: "code",
        language: "typescript",
        code: 'console.log("Hello, world!");',
      },
    ],
  },
  "vlog-2": {
    slug: "vlog-2",
    title: "Vlog Post 2",
    description: "This is a description for the second vlog post.",
    imageUrl: "https://placehold.co/1280x720.png?text=Vlog+Post+2",
    author: "Sami",
    date: "2025-11-10",
    gallery: [],
    content: [
      {
        type: "paragraph",
        text: "This is the full content of the second vlog post.",
      },
    ],
  },
  "vlog-3": {
    slug: "vlog-3",
    title: "Vlog Post 3",
    description: "This is a description for the third vlog post.",
    imageUrl: "https://placehold.co/1280x720.png?text=Vlog+Post+3",
    author: "Sami",
    date: "2025-11-09",
    gallery: [],
    content: [
      {
        type: "paragraph",
        text: "This is the full content of the third vlog post.",
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

export default async function VlogPage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const vlog = vlogs[slug];

  if (!vlog) {
    return <div>Vlog not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="mx-auto max-w-4xl">
        <div className="relative mb-8 h-96 w-full">
          <Image
            src={vlog.imageUrl}
            alt={vlog.title}
            fill
            style={{ objectFit: "cover" }}
            className="rounded-lg"
          />
        </div>
        <h1 className="text-5xl font-extrabold mb-4">{vlog.title}</h1>
        <div className="mb-8 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={"https://github.com/Sami.png"}
                alt={vlog.author}
              />
              <AvatarFallback>{vlog.author.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="text-lg font-medium">{vlog.author}</span>
          </div>
          <time className="text-lg text-muted-foreground">{vlog.date}</time>
        </div>

        {vlog.gallery.length > 0 && (
          <div className="my-8">
            <h2 className="text-3xl font-bold mb-4">Gallery</h2>
            <Carousel className="w-full">
              <CarouselContent>
                {vlog.gallery.map((image, index) => (
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
          {vlog.content.map((block, index) => renderContentBlock(block, index))}
        </div>
      </article>
    </div>
  );
}