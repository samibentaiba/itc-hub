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

export type Project = {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  tags: string[];
};

type ProjectCardProps = {
  project: Project;
};

export function ProjectCard({ project }: ProjectCardProps) {
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
          <p className="mt-2 text-sm text-muted-foreground">
            {project.description}
          </p>
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
