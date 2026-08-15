/**
 * API boundary for Phase 2 integration.
 * UI modules should call this service instead of addressing a backend directly.
 */
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export async function apiRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options?.headers },
  });
  if (!response.ok) throw new Error(`Request failed with status ${response.status}`);
  return response.json() as Promise<T>;
}

export const endpoints = {
  projects: "/projects",
  employees: "/employees",
  contractors: "/contractors",
  tasks: "/tasks",
  dailyReports: "/daily-reports",
  attendance: "/attendance",
  photos: "/site-photos",
  inventory: "/inventory",
  materialMovements: "/material-movements",
  expenses: "/expenses",
  reports: "/reports",
  users: "/users",
} as const;
