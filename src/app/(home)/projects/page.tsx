import { PageHeader } from "@/components/PageHeader";
import { ProjectCard } from "./project-card";

const projects = [
  {
    slug: "project-1",
    title: "Project 1",
    description: "This is a description for the first project.",
    imageUrl: "https://via.placeholder.com/1280x720.png?text=Project+1",
    tags: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
  {
    slug: "project-2",
    title: "Project 2",
    description: "This is a description for the second project.",
    imageUrl: "https://via.placeholder.com/1280x720.png?text=Project+2",
    tags: ["React", "JavaScript", "Shadcn UI"],
  },
  {
    slug: "project-3",
    title: "Project 3",
    description: "This is a description for the third project.",
    imageUrl: "https://via.placeholder.com/1280x720.png?text=Project+3",
    tags: ["Node.js", "Express", "Prisma"],
  },
  {
    slug: "project-4",
    title: "Project 3",
    description: "This is a description for the third project.",
    imageUrl: "https://via.placeholder.com/1280x720.png?text=Project+3",
    tags: ["Node.js", "Express", "Prisma"],
  },
];

export default async function ProjectsPage() {
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
    </div>
  );
}
