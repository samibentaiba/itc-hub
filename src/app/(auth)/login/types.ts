// src/app/(auth)/login/types.ts
export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginState {
  isLoading: boolean;
  error: string | null;
  showPassword: boolean;
}

export interface UseLoginReturn {
  formData: LoginFormData;
  state: LoginState;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  togglePasswordVisibility: () => void;
  handleGoogleSignIn: () => Promise<void>;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}
