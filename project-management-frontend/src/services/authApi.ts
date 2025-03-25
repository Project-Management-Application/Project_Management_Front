import axios from "axios";
import { RegisterRequest, AuthenticationResponse } from "../types/auth";
import { ForgotPassRequest, ForgotPassResponse } from "../types/auth";
import { ResetPasswordRequest } from "../types/auth";
import { OtpVerificationRequest } from "../types/auth";
import { AuthenticationRequest } from "../types/auth";

const API_URL = import.meta.env.VITE_API_URL;


export const registerUser = async (data: RegisterRequest): Promise<AuthenticationResponse> => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/auth/register`, data);
      return response.data;
    } catch (error) {
      throw new Error("Error during registration");
    }
};

export const verifyOtp = async (data: OtpVerificationRequest) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/email-verification`, data);
      return response.data;
    } catch (error) {
      throw new Error("Error during email verification");
    }
};



export const forgotPassword = async (data: ForgotPassRequest): Promise<ForgotPassResponse> => {
  const response = await axios.post<ForgotPassResponse>(`${API_URL}/api/v1/auth/Forgotpassword`, data);
  return response.data;
};



export const resetPassword = async (data: ResetPasswordRequest) => {
  try {
    const response = await axios.patch(`${API_URL}/api/v1/auth/resetpassword`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error resetting password:", error);
    throw error;
  }
};

export const authenticate = async (data: AuthenticationRequest): Promise<AuthenticationResponse> => {
  const response = await axios.post<AuthenticationResponse>(`${API_URL}/api/v1/auth/authenticate`, data);
  return response.data;
};

export const googleAuthenticate = async (idToken: string): Promise<AuthenticationResponse> => {
  const response = await axios.post<AuthenticationResponse>(`${API_URL}/google-authenticate`, null, {
    params: { idToken },
  });
  return response.data;
};

