import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function UsersLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <div>
        <Skeleton className="h-9 w-32 rounded-md" />
        <Skeleton className="h-4 w-64 mt-2 rounded-md" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-5 w-24 rounded-md" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2 rounded-md" />
              <Skeleton className="h-3 w-32 rounded-md" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-40 rounded-md" />
          <Skeleton className="h-4 w-80 mt-2 rounded-md" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Skeleton className="h-10 w-full sm:w-64 rounded-md" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-full flex-1 sm:w-44 rounded-md" />
                <Skeleton className="h-10 w-full flex-1 sm:w-36 rounded-md" />
              </div>
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    {[...Array(7)].map((_, i) => (
                      <TableHead key={i}><Skeleton className="h-5 w-full rounded-md" /></TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><div className="flex items-center gap-3"><Skeleton className="h-8 w-8 rounded-full" /><div className="space-y-2"><Skeleton className="h-4 w-24 rounded-md" /><Skeleton className="h-3 w-32 rounded-md" /></div></div></TableCell>
                      <TableCell><Skeleton className="h-5 w-full rounded-md" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-full rounded-md" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-full rounded-md" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-full rounded-md" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-full rounded-md" /></TableCell>
                      <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
