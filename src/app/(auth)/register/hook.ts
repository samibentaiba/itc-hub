"use client";

// src/app/(auth)/register/hook.ts
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type {
  RegisterFormData,
  RegisterState,
  UseRegisterReturn,
  RegisterResponse
} from "./types";

const initialFormData: RegisterFormData = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  agreeToTerms: false,
};

const initialState: RegisterState = {
  isLoading: false,
  error: null,
  showPassword: false,
  showConfirmPassword: false,
  success: false,
};

export function useRegister(): UseRegisterReturn {
  const [formData, setFormData] = useState<RegisterFormData>(initialFormData);
  const [state, setState] = useState<RegisterState>(initialState);
  const router = useRouter();
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

  const handleCheckboxChange = useCallback((checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      agreeToTerms: checked,
    }));

    if (state.error) {
      setState(prev => ({ ...prev, error: null }));
    }
  }, [state.error]);

  const validateForm = useCallback((): boolean => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setState(prev => ({
        ...prev,
        error: "Please fill in all required fields"
      }));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setState(prev => ({
        ...prev,
        error: "Please enter a valid email address"
      }));
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setState(prev => ({
        ...prev,
        error: "Passwords do not match"
      }));
      return false;
    }

    if (formData.password.length < 6) {
      setState(prev => ({
        ...prev,
        error: "Password must be at least 6 characters long"
      }));
      return false;
    }

    if (!formData.agreeToTerms) {
      setState(prev => ({
        ...prev,
        error: "Please agree to the terms and conditions"
      }));
      return false;
    }

    return true;
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data: RegisterResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setState(prev => ({
        ...prev,
        isLoading: false,
        success: true,
        error: null
      }));

      toast({
        title: "Registration Successful",
        description: "Welcome to ITC Hub! Please check your email to verify your account.",
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Registration failed";

      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  }, [formData, router, toast, validateForm]);

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
    handleCheckboxChange,
    handleSubmit,
    togglePasswordVisibility,
  };
}
