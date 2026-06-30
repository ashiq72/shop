"use client";

import { apiPost } from "./clientApi";

export type CreateAccountResult = {
  verificationRequired?: boolean;
  delivered?: boolean;
  developmentCode?: string;
};

export type LoginResult = {
  accessToken: string;
  tenantId?: string;
};

const setCookie = (name: string, value: string, maxAge: number) => {
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? "; secure"
      : "";
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; samesite=lax${secure}`;
};

export const createAccount = (payload: {
  name: string;
  email: string;
  password: string;
}) =>
  apiPost<CreateAccountResult>("/users/create-user", {
    ...payload,
    email: payload.email.trim().toLowerCase(),
  });

export const verifyAccountEmail = (email: string, code: string) =>
  apiPost<null>("/auth/verify-email", {
    email: email.trim().toLowerCase(),
    code,
  });

export const resendAccountVerification = (email: string) =>
  apiPost<{ developmentCode?: string } | null>("/auth/resend-verification", {
    email: email.trim().toLowerCase(),
  });

export const loginAccount = async (email: string, password: string) => {
  const response = await apiPost<LoginResult>("/auth/login", {
    email: email.trim().toLowerCase(),
    password,
  });
  if (!response.data?.accessToken) throw new Error("The server returned no session");
  setCookie("shopAccessToken", response.data.accessToken, 24 * 60 * 60);
  window.dispatchEvent(new Event("commerce360-auth-changed"));
  return response;
};

export const hasAccountSession = () =>
  typeof document !== "undefined" &&
  document.cookie
    .split(";")
    .some((entry) => entry.trim().startsWith("shopAccessToken="));

export const logoutAccount = () => {
  document.cookie = "shopAccessToken=; path=/; max-age=0; samesite=lax";
  window.dispatchEvent(new Event("commerce360-auth-changed"));
};

