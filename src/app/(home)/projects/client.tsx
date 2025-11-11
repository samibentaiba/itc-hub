// src/app/(home)/projects/client.tsx
"use client";

import { PageHeader } from "@/components/PageHeader";
import type { ProjectLocal } from "./types";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";



export default function ProjectsClientPage({ projects }: {projects: ProjectLocal[]}) {
  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Projects"
        description="Here you can find the latest projects from the ITC Hub team."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
      {projects.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          No projects found.
        </div>
      )}
    </div>
  );
}


export function ProjectCard({ project }: {project: ProjectLocal}) {
  return (
    <Link href={`/projects/${project.slug}`}>
      <Card className="overflow-hidden transition-all hover:scale-[1.02] hover:shadow-lg">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={project.imageUrl}
              alt={project.title}
              fill
              style={{ objectFit: "cover" }}
            />
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <CardTitle className="text-lg font-bold">{project.title}</CardTitle>
          <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
            {project.description}
          </p>
          {project.author && (
            <div className="flex items-center gap-2 mt-3">
              <Avatar className="h-6 w-6">
                <AvatarImage src={project.authorAvatar || ""} alt={project.author} />
                <AvatarFallback className="text-xs">
                  {project.author.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground">by {project.author}</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-wrap gap-2 p-4 pt-0">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </CardFooter>
      </Card>
    </Link>
  );
}