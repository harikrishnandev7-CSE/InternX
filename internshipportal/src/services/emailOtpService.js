import api from "../api/api";

// Send OTP to email
export const sendOtp = (email) => {
  return api.post("/auth/send-otp", { email });
};

// Resend OTP to email
export const resendOtp = (email) => {
  return api.post("/auth/resend-otp", { email });
};

// Verify OTP code
export const verifyOtp = (email, otp) => {
  return api.post("/auth/verify-otp", { email, otp });
};

// Reset password with verified OTP
export const resetPassword = (email, otp, newPassword) => {
  return api.post("/auth/reset-password", {
    email,
    otp,
    new_password: newPassword,
  });
};
