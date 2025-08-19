"use client";

// src/app/(auth)/reset-password/[token]/client.tsx
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { AuthLogo } from "@/components/ui/logo";
import { useResetPassword } from "./hook";

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    formData,
    state,
    handleInputChange,
    handleSubmit,
    togglePasswordVisibility,
  } = useResetPassword(token);

  // Loading state while validating token
  if (state.tokenValid === null) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
              <p className="text-muted-foreground">Validating reset link...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Invalid token state
  if (state.tokenValid === false) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center mb-4">
              <AuthLogo />
            </div>
            <h1 className="text-2xl font-bold">Invalid Reset Link</h1>
            <p className="text-muted-foreground">This password reset link is invalid or has expired</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <AlertCircle className="h-16 w-16 text-red-500 mx-auto" />
                <div className="space-y-2">
                  <p className="font-medium">Reset Link Invalid</p>
                  <p className="text-sm text-muted-foreground">
                    This password reset link is either invalid or has expired. Please request a new one.
                  </p>
                </div>
                <div className="space-y-2">
                  <Button className="w-full" asChild>
                    <Link href="/forget-password">Request New Reset Link</Link>
                  </Button>
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/login">Back to Sign In</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button variant="ghost" asChild>
              <Link href="/" className="text-sm">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-4">
            <AuthLogo />
          </div>
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground">
            {state.passwordReset ? "Your password has been reset successfully" : "Enter your new password"}
          </p>
        </div>

        {/* Reset Password Form */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">{state.passwordReset ? "Password Updated" : "New Password"}</CardTitle>
            <CardDescription>
              {state.passwordReset
                ? "You can now sign in with your new password"
                : "Choose a strong password for your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state.passwordReset ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center p-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <div className="text-center space-y-2">
                  <p className="font-medium">Password Reset Complete</p>
                  <p className="text-sm text-muted-foreground">
                    Your password has been successfully updated. You can now sign in with your new password.
                  </p>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/login">Sign In Now</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {state.error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md border border-red-200">
                    {state.error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={state.showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                      disabled={state.isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility('password')}
                      disabled={state.isLoading}
                    >
                      {state.showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={state.showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                      disabled={state.isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => togglePasswordVisibility('confirmPassword')}
                      disabled={state.isLoading}
                    >
                      {state.showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={state.isLoading}>
                  {state.isLoading ? "Updating password..." : "Update Password"}
                </Button>
              </form>
            )}

            {!state.passwordReset && (
              <>
                <Separator className="my-4" />
                <div className="text-center text-sm">
                  <span className="text-muted-foreground">Remember your password? </span>
                  <Link href="/login" className="text-red-500 hover:text-red-600 transition-colors font-medium">
                    Sign in
                  </Link>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center">
          <Button variant="ghost" asChild>
            <Link href="/" className="text-sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
