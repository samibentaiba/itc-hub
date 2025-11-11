// src/app/(home)/vlogs/page.tsx
import VlogsClientPage from "./client";
import { prisma } from "@/lib/prisma";

export default async function VlogsPage() {
  // Fetch data on the server
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

  // Transform the data to match the expected format
  const transformedVlogs = vlogs.map((vlog) => ({
    slug: vlog.slug,
    title: vlog.title,
    description: vlog.description,
    imageUrl: vlog.image || "placeholder.svg",
    author: vlog.author.name,
    authorAvatar: vlog.author.avatar,
    date: vlog.createdAt.toISOString().split("T")[0],
  }));

  // Pass the server-fetched data as props to the client component
  return <VlogsClientPage vlogs={transformedVlogs} />;
}