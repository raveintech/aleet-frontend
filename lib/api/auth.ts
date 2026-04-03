import { apiFetch } from "@/lib/api";

export type User = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "driver";
  isPhoneVerified: boolean;
  subscriptionStatus: string;
};

// ── Login ────────────────────────────────────────────────────────────────────

export type LoginPayload = {
  identifier: string;
  password: string;
};

export type LoginData = {
  token: string;
  user: User;
};

export function login(payload: LoginPayload) {
  return apiFetch<LoginData>("/auth/login", {
    method: "POST",
    body: payload,
  });
}

// ── Signup — Step 1: Start (send OTP) ────────────────────────────────────────

export type SignupStartPayload = {
  phone: string;
  email: string;
  name: string;
};

export type SignupStartData = {
  phone: string;
  expiresIn: string;
};

export function signupStart(payload: SignupStartPayload) {
  return apiFetch<SignupStartData>("/auth/signup/start", {
    method: "POST",
    body: payload,
  });
}

// ── Signup — Step 2: Verify OTP ───────────────────────────────────────────────

export type SignupVerifyPayload = {
  phone: string;
  code: string;
};

export type SignupVerifyData = {
  signupToken: string;
};

export function signupVerify(payload: SignupVerifyPayload) {
  return apiFetch<SignupVerifyData>("/auth/signup/verify", {
    method: "POST",
    body: payload,
  });
}

// ── Signup — Step 3: Complete ─────────────────────────────────────────────────

export type SignupCompletePayload = {
  signupToken: string;
  password: string;
};

export type SignupCompleteData = {
  token: string;
  user: User;
};

export function signupComplete(payload: SignupCompletePayload) {
  return apiFetch<SignupCompleteData>("/auth/signup/complete", {
    method: "POST",
    body: payload,
  });
}

// ── Forgot Password ───────────────────────────────────────────────────────────

export type ForgotPasswordPayload = {
  email: string;
  resetBaseUrl?: string;
};

export function forgotPassword(payload: ForgotPasswordPayload) {
  return apiFetch("/auth/password/forgot", {
    method: "POST",
    body: payload,
  });
}

// ── Reset Password ────────────────────────────────────────────────────────────

export type ResetPasswordPayload = {
  token: string;
  password: string;
};

export function resetPassword(payload: ResetPasswordPayload) {
  return apiFetch("/auth/password/reset", {
    method: "POST",
    body: payload,
  });
}
