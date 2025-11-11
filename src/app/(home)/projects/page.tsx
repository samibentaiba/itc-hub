// src/app/(home)/projects/page.tsx
import ProjectsClientPage from "./client";
import { prisma } from "@/lib/prisma";

export default async function ProjectsPage() {
  // Fetch data on the server
  const projects = await prisma.project.findMany({
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
  const transformedProjects = projects.map((project) => ({
    slug: project.slug,
    title: project.name,
    description: project.description,
    imageUrl: project.image || "placeholder.svg",
    tags: project.tags,
    author: project.author.name,
    authorAvatar: project.author.avatar,
  }));

  // Pass the server-fetched data as props to the client component
  return <ProjectsClientPage projects={transformedProjects} />;
}