// src/app/(home)/vlogs/[slug]/page.tsx
import VlogDetailClientPage from "./client";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import type { ContentBlock } from "../types";

export default async function VlogPage(props: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } = await props.params;

  // Fetch vlog and users data in parallel
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

  // If no vlog is found, show not found page
  if (!vlog) {
    return (
      <div className="container mx-auto p-6">
        <div className="mb-6">
          <Button variant="outline" size="sm" asChild>
            <Link href="/vlogs">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Vlogs
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-20">
            <h2 className="text-2xl font-bold mb-2">Vlog Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The vlog you&apos;re looking for doesn&apos;t exist or could not
              be loaded.
            </p>
            <Button asChild>
              <Link href="/vlogs">Browse All Vlogs</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Transform users into a lookup map
  const usersById = users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {} as Record<string, (typeof users)[0]>);

  // Type the content properly
  const content = vlog.content as ContentBlock[];

  // Transform vlog data
  const transformedVlog = {
    ...vlog,
    content,
  };

  // Pass the server-fetched data as props to the client component
  return <VlogDetailClientPage vlog={transformedVlog} usersById={usersById} />;
}
