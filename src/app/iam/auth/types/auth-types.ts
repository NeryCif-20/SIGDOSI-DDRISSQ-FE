export interface IdentifyData {
  email: string;
}

export interface LoginData {
  password: string;
}

export type AuthStep = 'PASSWORD' | 'CHECK_MAIL';

export interface IdentifyResponse {
  nextStep: AuthStep;
}

export interface AuthResponse {
  accessToken: string;
}

export type PasswordSetupAction = 'SET' | 'RESET';
