"use client";

// src/app/(auth)/forget-password/hook.ts
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import type {
  ForgetPasswordFormData,
  ForgetPasswordState,
  UseForgetPasswordReturn,
  ForgetPasswordResponse
} from "./types";

const initialFormData: ForgetPasswordFormData = {
  email: "",
};

const initialState: ForgetPasswordState = {
  isLoading: false,
  emailSent: false,
  error: null,
};

export function useForgetPassword(): UseForgetPasswordReturn {
  const [formData, setFormData] = useState<ForgetPasswordFormData>(initialFormData);
  const [state, setState] = useState<ForgetPasswordState>(initialState);
  const { toast } = useToast();

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (state.error) {
      setState(prev => ({ ...prev, error: null }));
    }
  }, [state.error]);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Validation
      if (!formData.email) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: "Please enter your email address."
        }));
        toast({
          title: "Validation Error",
          description: "Please enter your email address.",
          variant: "destructive",
        });
        return;
      }

      if (!validateEmail(formData.email)) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: "Please enter a valid email address."
        }));
        toast({
          title: "Validation Error",
          description: "Please enter a valid email address.",
          variant: "destructive",
        });
        return;
      }

      // Make API call
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const data: ForgetPasswordResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send reset email");
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        emailSent: true,
        error: null
      }));

      toast({
        title: "Reset Email Sent",
        description: "Check your email for password reset instructions.",
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to send reset email. Please try again.";

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [formData.email, toast]);

  const handleResendEmail = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const data: ForgetPasswordResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend email");
      }

      setState(prev => ({ ...prev, isLoading: false, error: null }));

      toast({
        title: "Email Resent",
        description: "Password reset email has been sent again.",
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to resend email. Please try again.";

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [formData.email, toast]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setState(initialState);
  }, []);

  return {
    formData,
    state,
    handleInputChange,
    handleSubmit,
    handleResendEmail,
    resetForm,
  };
}
