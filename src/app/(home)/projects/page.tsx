// src/app/(home)/projects/page.tsx
import { PageHeader } from "@/components/PageHeader";
import { ProjectCard } from "./project-card";
import { prisma } from "@/lib/prisma";

export default async function ProjectsPage() {
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

  const transformedProjects = projects.map((project) => ({
    slug: project.slug,
    title: project.name,
    description: project.description,
    imageUrl: project.image || "placeholder.svg",
    tags: project.tags,
    author: project.author.name,
    authorAvatar: project.author.avatar,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Projects"
        description="Here you can find the latest projects from the ITC Hub team."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {transformedProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
      {transformedProjects.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No projects found.
        </div>
      )}
    </div>
  );
}