// src/app/(home)/vlogs/[slug]/page.tsx
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
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; text: string; level: 1 | 2 | 3 | 4 | 5 | 6 }
  | { type: "image"; src: string; alt: string }
  | { type: "code"; code: string; language: string };

function renderContentBlock(
  block: ContentBlock,
  index: number,
  usersById: Record<string, { id: string; name: string }>
) {
  switch (block.type) {
    case "heading":
      const Tag = `h${block.level}` as keyof JSX.IntrinsicElements;
      return React.createElement(
        Tag,
        {
          key: index,
          className: `font-bold text-${5 - block.level}xl mt-8 mb-4`,
        },
        block.text
      );
    case "paragraph":
      const text = block.text;
      const elements = [];
      const regex = /@\[user:(.*?)\]/g;
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(text)) !== null) {
        elements.push(text.substring(lastIndex, match.index));
        const userId = match[1];
        const user = usersById[userId];
        const userName = user ? user.name : "Unknown User";
        elements.push(
          <Link
            key={match.index}
            href={`/users/${userId}`}
            className="text-blue-500 hover:underline"
          >
            {`@${userName}`}
          </Link>
        );
        lastIndex = regex.lastIndex;
      }
      elements.push(text.substring(lastIndex));

      return (
        <p key={index} className="mb-4 text-lg leading-relaxed">
          {elements.map((el, i) => (
            <React.Fragment key={i}>{el}</React.Fragment>
          ))}
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
          className="bg-gray-800 text-white p-4 rounded-lg overflow-x-auto my-4"
        >
          <code className={`language-${block.language}`}>{block.code}</code>
        </pre>
      );
    default:
      return null;
  }
}

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function VlogPage(props: PageProps) {
  const { slug } = await props.params;

  const vlogPromise = prisma.vlog.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  const usersPromise = prisma.user.findMany({
    select: { id: true, name: true },
  });

  const [vlog, users] = await Promise.all([vlogPromise, usersPromise]);

  if (!vlog) {
    notFound();
  }

  const usersById = users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {} as Record<string, (typeof users)[0]>);

  const content = vlog.content as ContentBlock[];

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="mx-auto max-w-4xl">
        <Link
          href="/vlogs"
          className="text-primary hover:underline mb-2 sm:mb-4 inline-block text-sm sm:text-base"
        >
          ← Back to vlogs
        </Link>
        <div className="relative mb-8 h-96 w-full">
          <Image
            src={vlog.image || "placeholder.svg"}
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
                src={
                  vlog.author.avatar ||
                  `https://github.com/${vlog.author.name}.png`
                }
                alt={vlog.author.name}
              />
              <AvatarFallback>{vlog.author.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="text-lg font-medium">{vlog.author.name}</span>
          </div>
          <time className="text-lg text-muted-foreground">
            {vlog.createdAt.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
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
          {content.map((block, index) =>
            renderContentBlock(block, index, usersById)
          )}
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={
                  vlog.author.avatar ||
                  `https://github.com/${vlog.author.name}.png`
                }
                alt={vlog.author.name}
              />
              <AvatarFallback>{vlog.author.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm text-muted-foreground">Written by</p>
              <Link
                href={`/users/${vlog.author.id}`}
                className="font-semibold hover:underline"
              >
                {vlog.author.name}
              </Link>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
