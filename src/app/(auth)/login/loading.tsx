// src/app/(auth)/login/loading.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthLogo } from "@/components/ui/logo";

export default function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-4">
            <AuthLogo />
          </div>
          <Skeleton className="h-8 w-40 mx-auto" />
          <Skeleton className="h-4 w-60 mx-auto" />
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">
              <Skeleton className="h-6 w-20" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-full" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <div className="relative">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <div className="relative">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
              </div>

              <Skeleton className="h-10 w-full" />

              <div className="flex items-center">
                <Skeleton className="h-px flex-1" />
              </div>

              <Skeleton className="h-10 w-full" />

              <div className="text-center text-sm">
                <Skeleton className="h-4 w-48 mx-auto" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Skeleton className="h-8 w-32 mx-auto" />
        </div>
      </div>
    </div>
  );
}
