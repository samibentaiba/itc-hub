// src/app/(auth)/register/types.ts
export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
}

export interface RegisterState {
  isLoading: boolean;
  error: string | null;
  showPassword: boolean;
  showConfirmPassword: boolean;
  success: boolean;
}

export interface UseRegisterReturn {
  formData: RegisterFormData;
  state: RegisterState;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCheckboxChange: (checked: boolean) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  togglePasswordVisibility: (field: 'password' | 'confirmPassword') => void;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user?: {
    id: string;
    email: string;
    name: string;
  };
}
