import type { ApiResponse } from "./api";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  process.env.VITE_API_URL ||
  "http://localhost:4000/api/v1";

const TENANT_ID =
  process.env.NEXT_PUBLIC_TENANT_ID ||
  process.env.TENANT_ID ||
  "";

const headers = () => {
  const base: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (TENANT_ID) base["x-tenant-id"] = TENANT_ID;
  return base;
};

const readError = async (res: Response) => {
  const text = await res.text();
  try {
    const parsed = JSON.parse(text) as {
      message?: string;
      errorSources?: Array<{ message?: string }>;
    };
    return (
      parsed.message ||
      parsed.errorSources?.map((item) => item.message).filter(Boolean).join(", ") ||
      `Request failed (${res.status})`
    );
  } catch {
    return text || `Request failed (${res.status})`;
  }
};

export const apiPost = async <T>(path: string, body: unknown) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) throw new Error(await readError(res));

  return (await res.json()) as ApiResponse<T>;
};

export const apiGetClient = async <T>(
  path: string,
  query?: Record<string, string | number | undefined>,
) => {
  const params = new URLSearchParams();
  Object.entries(query || {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") params.set(key, String(value));
  });
  const suffix = params.size ? `?${params.toString()}` : "";
  const res = await fetch(`${API_BASE}${path}${suffix}`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as ApiResponse<T>;
};

export const getAccountToken = () => {
  if (typeof document === "undefined") return "";
  const entry = document.cookie
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith("shopAccessToken="));
  return entry ? decodeURIComponent(entry.slice("shopAccessToken=".length)) : "";
};

export const apiAuthRequest = async <T>(
  path: string,
  options: RequestInit = {},
) => {
  const token = getAccountToken();
  if (!token) throw new Error("Please sign in to continue");
  const requestHeaders = new Headers(options.headers);
  requestHeaders.set("Content-Type", "application/json");
  requestHeaders.set("Authorization", `Bearer ${token}`);
  if (TENANT_ID) requestHeaders.set("x-tenant-id", TENANT_ID);

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: requestHeaders,
  });
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()) as ApiResponse<T>;
};

export const apiGetAuth = <T>(path: string) =>
  apiAuthRequest<T>(path, { method: "GET", cache: "no-store" });

export const apiPostAuth = <T>(path: string, body: unknown) =>
  apiAuthRequest<T>(path, {
    method: "POST",
    body: JSON.stringify(body),
  });

export const apiPatchAuth = <T>(path: string, body: unknown) =>
  apiAuthRequest<T>(path, {
    method: "PATCH",
    body: JSON.stringify(body),
  });

export const apiDeleteAuth = <T>(path: string) =>
  apiAuthRequest<T>(path, { method: "DELETE" });
