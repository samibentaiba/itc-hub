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

export type Vlog = {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  author: string;
  date: string;
};

type VlogCardProps = {
  vlog: Vlog;
};

export function VlogCard({ vlog }: VlogCardProps) {
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
          <p className="mt-2 text-sm text-muted-foreground">
            {vlog.description}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between p-4 pt-0">
            <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                    <AvatarImage src={`https://github.com/${vlog.author}.png`} alt={vlog.author} />
                    <AvatarFallback>{vlog.author.slice(0,2)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">{vlog.author}</span>
            </div>
          <time className="text-sm text-muted-foreground">{vlog.date}</time>
        </CardFooter>
      </Card>
    </Link>
  );
}
