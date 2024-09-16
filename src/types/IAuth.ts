export interface AuthState {
    isAuthenticated: boolean;
    user: {
      fullName: string;
      email: string;
    } | null;
    accessToken: string | null;
    error: string | null;
  }