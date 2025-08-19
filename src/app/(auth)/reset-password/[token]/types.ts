// src/app/(auth)/reset-password/[token]/types.ts
export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

export interface ResetPasswordState {
  isLoading: boolean;
  showPassword: boolean;
  showConfirmPassword: boolean;
  passwordReset: boolean;
  tokenValid: boolean | null;
  error: string | null;
}

export interface UseResetPasswordReturn {
  formData: ResetPasswordFormData;
  state: ResetPasswordState;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  togglePasswordVisibility: (field: 'password' | 'confirmPassword') => void;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface TokenValidationResponse {
  valid: boolean;
  message: string;
}
