import { cache } from "react";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  process.env.VITE_API_URL ||
  "http://localhost:5000/api/v1";
const TENANT_ID =
  process.env.NEXT_PUBLIC_TENANT_ID ||
  process.env.TENANT_ID ||
  "";

export type ApiMeta = {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
};

export type ApiResponse<T> = {
  success: boolean;
  message?: string;
  data: T;
  meta?: ApiMeta;
};

const headers = () => {
  const base: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (TENANT_ID) base["x-tenant-id"] = TENANT_ID;
  return base;
};

export const apiGet = cache(async <T>(path: string) => {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: headers(),
    next: { revalidate: 60 },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(
      `API request failed: ${res.status} ${path} ${body}`,
    );
  }
  return (await res.json()) as ApiResponse<T>;
});

export const apiGetSafe = cache(async <T>(path: string) => {
  try {
    return await apiGet<T>(path);
  } catch (err) {
    console.error(err);
    return {
      success: false,
      message: "API request failed",
      data: [] as unknown as T,
    } as ApiResponse<T>;
  }
});
