// src/app/(auth)/forget-password/loading.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AuthLogo } from "@/components/ui/logo";

export default function ForgetPasswordLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-4">
            <AuthLogo variant="auto" />
          </div>
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>

        {/* Form Card */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">
              <Skeleton className="h-6 w-32" />
            </CardTitle>
            <CardDescription>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4 mt-1" />
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <div className="relative">
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>

              <Skeleton className="h-10 w-full" />

              <div className="flex items-center">
                <Skeleton className="h-px flex-1" />
              </div>

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
