export interface IdentifyData {
  email: string;
}

export interface LoginData {
  password: string;
}

export type AuthStep = 'PASSWORD' | 'CHECK_MAIL';

export type MailPurpose = 'SET_PASSWORD' | 'RESET_PASSWORD';

export interface IdentifyResponse {
  nextStep: AuthStep;
}

export interface AuthResponse {
  accessToken: string;
}

export interface SetupPasswordData {
  token: string;
  newPassword: string;
  confirmNewPassword: string;
}

export type PasswordSetupAction = 'set' | 'reset';

export interface ValidatePasswordTokenData {
  token: string;
}
