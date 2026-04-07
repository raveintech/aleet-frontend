import { apiFetch } from "@/lib/api";

export type Region = {
  _id: string;
  name: string;
  code: string;
};

export function getRegions() {
  return apiFetch<Region[]>("/regions", { method: "GET" });
}
