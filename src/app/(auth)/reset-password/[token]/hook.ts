"use client";

// src/app/(auth)/reset-password/[token]/hook.ts
import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import type {
  ResetPasswordFormData,
  ResetPasswordState,
  UseResetPasswordReturn,
  ResetPasswordResponse,
  TokenValidationResponse
} from "./types";

const initialFormData: ResetPasswordFormData = {
  password: "",
  confirmPassword: "",
};

const initialState: ResetPasswordState = {
  isLoading: false,
  showPassword: false,
  showConfirmPassword: false,
  passwordReset: false,
  tokenValid: null,
  error: null,
};

export function useResetPassword(token: string | null): UseResetPasswordReturn {
  const [formData, setFormData] = useState<ResetPasswordFormData>(initialFormData);
  const [state, setState] = useState<ResetPasswordState>(initialState);
  const { toast } = useToast();

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        setState(prev => ({ ...prev, tokenValid: false }));
        return;
      }

      try {
        const response = await fetch(`/api/auth/validate-reset-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        const data: TokenValidationResponse = await response.json();

        setState(prev => ({
          ...prev,
          tokenValid: response.ok && data.valid
        }));

      } catch {
        setState(prev => ({ ...prev, tokenValid: false }));
      }
    };

    validateToken();
  }, [token]);

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

  const validateForm = useCallback((): boolean => {
    if (!formData.password || !formData.confirmPassword) {
      setState(prev => ({
        ...prev,
        error: "Please fill in all required fields."
      }));
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setState(prev => ({
        ...prev,
        error: "Passwords do not match. Please try again."
      }));
      return false;
    }

    if (formData.password.length < 8) {
      setState(prev => ({
        ...prev,
        error: "Password must be at least 8 characters long."
      }));
      return false;
    }

    return true;
  }, [formData.password, formData.confirmPassword]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password: formData.password,
        }),
      });

      const data: ResetPasswordResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        passwordReset: true,
        error: null
      }));

      toast({
        title: "Password Reset Successful",
        description: "Your password has been updated successfully.",
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to reset password. Please try again.";

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      toast({
        title: "Reset Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [formData.password, token, toast, validateForm]);

  const togglePasswordVisibility = useCallback((field: 'password' | 'confirmPassword') => {
    setState(prev => ({
      ...prev,
      [field === 'password' ? 'showPassword' : 'showConfirmPassword']:
        !prev[field === 'password' ? 'showPassword' : 'showConfirmPassword']
    }));
  }, []);

  return {
    formData,
    state,
    handleInputChange,
    handleSubmit,
    togglePasswordVisibility,
  };
}
