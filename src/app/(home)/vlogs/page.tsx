// src/app/(home)/vlogs/page.tsx
import { PageHeader } from "@/components/PageHeader";
import { VlogCard } from "./vlog-card";
import { prisma } from "@/lib/prisma";

export default async function VlogsPage() {
  const vlogs = await prisma.vlog.findMany({
    include: {
      author: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const transformedVlogs = vlogs.map((vlog) => ({
    slug: vlog.slug,
    title: vlog.title,
    description: vlog.description,
    imageUrl: vlog.image || "placeholder.svg",
    author: vlog.author.name,
    authorAvatar: vlog.author.avatar,
    date: vlog.createdAt.toISOString().split("T")[0],
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Vlogs"
        description="Here you can find the latest vlogs from the ITC Hub team."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {transformedVlogs.map((vlog) => (
          <VlogCard key={vlog.slug} vlog={vlog} />
        ))}
      </div>
      {transformedVlogs.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No vlogs found.
        </div>
      )}
    </div>
  );
}