// src/app/(auth)/forget-password/types.ts
export interface ForgetPasswordFormData {
  email: string;
}

export interface ForgetPasswordState {
  isLoading: boolean;
  emailSent: boolean;
  error: string | null;
}

export interface ForgetPasswordResponse {
  success: boolean;
  message: string;
  data?: {
    email: string;
  };
}

export interface UseForgetPasswordReturn {
  formData: ForgetPasswordFormData;
  state: ForgetPasswordState;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleResendEmail: () => Promise<void>;
  resetForm: () => void;
}
