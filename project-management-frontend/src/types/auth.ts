// Type for the registration form data
export interface RegisterRequest {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
    confirmPassword: string;
  }
  
  // Type for the authentication response
  export interface AuthenticationResponse {
    firstName: string;
    lastName: string;
    email: string;
    token: string;
  }

  export interface OtpVerificationRequest {
    email: string;
    otp: string;
  }

  export interface ForgotPassRequest {
    email: string;
  }
  
  export interface ForgotPassResponse {
    token: string;
    userId: number;
  }
  