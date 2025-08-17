"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"

import { Mail, ArrowLeft, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { AuthLogo } from "@/components/ui/logo"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
  })
  const { toast } = useToast()

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
      if (!formData.email) {
        toast({
          title: "Validation Error",
          description: "Please enter your email address.",
          variant: "destructive",
        })
        return
      }

      // TODO: Implement actual password reset API call
      // For now, simulate the API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate successful email send
      setEmailSent(true)
      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to send reset email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendEmail = async () => {
    setIsLoading(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      toast({
        title: "Email Resent",
        description: "Password reset email has been sent again.",
      })
    } catch {
      toast({
        title: "Error",
        description: "Failed to resend email. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center mb-4">
            <AuthLogo />
          </div>
          <h1 className="text-2xl font-bold">Forgot Password</h1>
          <p className="text-muted-foreground">
            {emailSent ? "We've sent you a reset link" : "Enter your email to reset your password"}
          </p>
        </div>

        {/* Forgot Password Form */}
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-xl">{emailSent ? "Check Your Email" : "Reset Password"}</CardTitle>
            <CardDescription>
              {emailSent
                ? "We've sent a password reset link to your email address"
                : "Enter your email address and we'll send you a link to reset your password"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {emailSent ? (
              <div className="space-y-4">
                <div className="flex items-center justify-center p-4">
                  <CheckCircle className="h-16 w-16 text-green-500" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">We&apos;ve sent a password reset link to:</p>
                  <p className="font-medium">{formData.email}</p>
                  <p className="text-sm text-muted-foreground">
                    Click the link in the email to reset your password. If you don&apos;t see the email, check your spam
                    folder.
                  </p>
                </div>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={handleResendEmail}
                    disabled={isLoading}
                  >
                    {isLoading ? "Resending..." : "Resend Email"}
                  </Button>
                  <Button variant="ghost" className="w-full" asChild>
                    <Link href="/login">Back to Sign In</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="pl-10"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </Button>
              </form>
            )}

            {!emailSent && (
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
