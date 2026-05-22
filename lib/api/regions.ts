import { apiFetch } from "@/lib/api";

export type Region = {
  _id: string;
  name: string;
  code: string;
};

export function getRegions() {
  return apiFetch<Region[]>("/regions", { method: "GET" });
}

/** Reason a region's same-day booking is unavailable (null when available). */
export type SameDayReason =
  | "region_inactive"
  | "manual_block"
  | "insufficient_coverage"
  | null;

/**
 * Live same-day availability for a region.
 * Mirrors the backend `computeSameDayStatus` payload
 * (src/services/availabilityService.js).
 */
export type SameDayStatus = {
  regionId?: string;
  aqd: number; // Active Qualified Drivers
  rb: number; // Reserved Buffer
  cl: number; // Committed Load
  mct: number; // Minimum Coverage Threshold
  formulaPass: boolean;
  manualBlock: boolean;
  available: boolean;
  reason: SameDayReason;
  message: string;
};

export function getSameDayStatus(regionId: string) {
  return apiFetch<SameDayStatus>(`/regions/${regionId}/same-day-status`, {
    method: "GET",
  });
}
