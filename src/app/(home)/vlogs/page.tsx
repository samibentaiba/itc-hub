import { PageHeader } from "@/components/PageHeader";
import { VlogCard } from "./vlog-card";

const vlogs = [
  {
    slug: "vlog-1",
    title: "Vlog Post 1",
    description: "This is a description for the first vlog post.",
    imageUrl: "https://via.placeholder.com/1280x720.png?text=Vlog+Post+1",
    author: "Sami",
    date: "2025-11-11",
  },
  {
    slug: "vlog-2",
    title: "Vlog Post 2",
    description: "This is a description for the second vlog post.",
    imageUrl: "https://via.placeholder.com/1280x720.png?text=Vlog+Post+2",
    author: "Sami",
    date: "2025-11-10",
  },
  {
    slug: "vlog-3",
    title: "Vlog Post 3",
    description: "This is a description for the third vlog post.",
    imageUrl: "placeholder.svg",
    author: "Sami",
    date: "2025-11-09",
  },
  {
    slug: "vlog-4",
    title: "Vlog Post 3",
    description: "This is a description for the third vlog post.",
    imageUrl: "https://via.placeholder.com/1280x720.png?text=Vlog+Post+3",
    author: "Sami",
    date: "2025-11-09",
  },
];

export default async function VlogsPage() {
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
    </div>
  );
}
