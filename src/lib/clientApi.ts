import type { ApiResponse } from "./api";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  process.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";

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

export const apiPost = async <T>(path: string, body: unknown) => {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API request failed: ${res.status} ${text}`);
  }

  return (await res.json()) as ApiResponse<T>;
};
