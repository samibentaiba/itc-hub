// src/app/(home)/vlogs/client.tsx
"use client";

import { PageHeader } from "@/components/PageHeader";
import type { VlogLocal } from "./types";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function VlogsClientPage({ vlogs }: { vlogs: VlogLocal[] }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Vlogs"
        description="Here you can find the latest vlogs from the ITC Hub team."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vlogs.map((vlog) => (
          <VlogCard key={vlog.slug} vlog={vlog} />
        ))}
      </div>
      {vlogs.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No vlogs found.
        </div>
      )}
    </div>
  );
}

export function VlogCard({ vlog }: { vlog: VlogLocal }) {
  return (
    <Link href={`/vlogs/${vlog.slug}`}>
      <Card className="overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={vlog.imageUrl}
              alt={vlog.title}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg font-bold">{vlog.title}</CardTitle>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {vlog.description}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4 pt-0">
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={
                  vlog.authorAvatar || `https://github.com/${vlog.author}.png`
                }
                alt={vlog.author}
              />
              <AvatarFallback>{vlog.author.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium">{vlog.author}</span>
          </div>
          <time className="text-sm text-muted-foreground">
            {new Date(vlog.date).toLocaleDateString()}
          </time>
        </CardFooter>
      </Card>
    </Link>
  );
}
