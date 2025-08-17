"use client"

import { useState, useEffect } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { useSearchParams } from "next/navigation";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AuthLogo } from "@/components/ui/logo"

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordReset, setPasswordReset] = useState(false)
  const [tokenValid, setTokenValid] = useState<boolean | null>(null)
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    // Validate token on component mount
    const validateToken = async () => {
      if (!token) {
        setTokenValid(false)
        return
      }

      try {
        // TODO: Implement actual token validation API call
        // For now, simulate token validation
        await new Promise((resolve) => setTimeout(resolve, 1000))
        // For demo purposes, assume token is valid
        setTokenValid(true)
      } catch {
        setTokenValid(false)
      }
    }

    validateToken()
  }, [token])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Basic validation
      if (!formData.password || !formData.confirmPassword) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields.",
          variant: "destructive",
        })
        return
      }

      if (formData.password !== formData.confirmPassword) {
        toast({
          title: "Password Mismatch",
          description: "Passwords do not match. Please try again.",
          variant: "destructive",
        })
        return
      }

      if (formData.password.length < 8) {
        toast({
          title: "Password Too Short",
          description: "Password must be at least 8 characters long.",
          variant: "destructive",
        })
        return
      }

      // TODO: Implement actual password reset API call
      // For now, simulate the API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful password reset
      setPasswordReset(true)
      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated successfully.",
      })
    } catch {
      toast({
        title: "Reset Failed",
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Loading state while validating token
  if (tokenValid === null) {
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
    )
  }

  // Invalid token state
  if (tokenValid === false) {
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
    )
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
            {passwordReset ? "Your password has been reset successfully" : "Enter your new password"}
          </p>
        </div>

        {/* Reset Password Form */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">{passwordReset ? "Password Updated" : "New Password"}</CardTitle>
            <CardDescription>
              {passwordReset
                ? "You can now sign in with your new password"
                : "Choose a strong password for your account"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {passwordReset ? (
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
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? (
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
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="pl-10 pr-10"
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Updating password..." : "Update Password"}
                </Button>
              </form>
            )}

            {!passwordReset && (
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
  )
}
