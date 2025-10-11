"use client";

// src/app/(auth)/login/hook.ts
import { useState, useCallback } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import type {
  LoginFormData,
  LoginState
} from "./types";

const initialFormData: LoginFormData = {
  email: "",
  password: "",
};

const initialState: LoginState = {
  isLoading: false,
  error: null,
  showPassword: false,
};

export function useLogin() {
  const [formData, setFormData] = useState<LoginFormData>(initialFormData);
  const [state, setState] = useState<LoginState>(initialState);
  const { data: session, status } = useSession();
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

  const validateForm = useCallback((): boolean => {
    if (!formData.email || !formData.password) {
      setState(prev => ({
        ...prev,
        error: "Please fill in all required fields."
      }));
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setState(prev => ({
        ...prev,
        error: "Please enter a valid email address."
      }));
      return false;
    }

    return true;
  }, [formData.email, formData.password]);

const handleSubmit = useCallback(async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  setState(prev => ({ ...prev, isLoading: true, error: null }));

  try {
    const result = await signIn("credentials", {
      email: formData.email,
      password: formData.password,
      redirect: false,
    });

    if (result?.ok) {
      toast({
        title: "Welcome back!",
        description: "You have been signed in successfully.",
      });
      router.push("/dashboard");
    } else {
      // ✅ Preserve backend error (like email not verified)
      const errorMessage = result?.error || "Invalid email or password. Please try again.";
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage
      }));

      toast({
        title: "Sign In Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  } catch {
    setState(prev => ({
      ...prev,
      isLoading: false,
      error: "An unexpected error occurred. Please try again."
    }));

    toast({
      title: "Sign In Error",
      description: "An unexpected error occurred. Please try again.",
      variant: "destructive",
    });
  }
}, [formData, router, toast, validateForm]);


  const togglePasswordVisibility = useCallback(() => {
    setState(prev => ({
      ...prev,
      showPassword: !prev.showPassword
    }));
  }, []);

  const handleGoogleSignIn = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      await signIn("google", {
        callbackUrl: "/dashboard",
      });
    } catch {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: "Failed to sign in with Google. Please try again."
      }));

      toast({
        title: "Google Sign In Failed",
        description: "Failed to sign in with Google. Please try again.",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    formData,
    state,
    handleInputChange,
    handleSubmit,
    togglePasswordVisibility,
    handleGoogleSignIn,
    session,
    status,
  };
}
