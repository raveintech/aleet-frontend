/** Live same-day booking availability for the booking wizard.
 *
 * The backend (src/services/availabilityService.js) turns same-day booking ON
 * for a region only when `AQD - RB - CL >= MCT` and no admin block is set.
 * This hook surfaces that status so the wizard can show a styled notice and
 * block the booking BEFORE the user reaches the final submit.
 */

import { useEffect, useState } from "react";
import { combineDateAndTime } from "@/lib/booking-constraints";
import { getSameDayStatus, type SameDayStatus } from "@/lib/api/regions";

/** Pickup within this window of "now" counts as same-day (matches backend). */
const SAME_DAY_WINDOW_MS = 24 * 60 * 60 * 1000;

/** True when the chosen pickup falls inside the same-day (24h) window. */
export function isSameDayPickup(
  pickupDate?: Date,
  pickupTime?: string,
): boolean {
  if (!pickupDate) return false;

  // With a time, use the precise 24h window the backend enforces.
  if (pickupTime) {
    const dt = combineDateAndTime(pickupDate, pickupTime);
    if (dt) return dt.getTime() - Date.now() <= SAME_DAY_WINDOW_MS;
  }

  // No time chosen yet — a pickup dated today is always same-day.
  const now = new Date();
  return (
    pickupDate.getFullYear() === now.getFullYear() &&
    pickupDate.getMonth() === now.getMonth() &&
    pickupDate.getDate() === now.getDate()
  );
}

export type SameDayAvailability = {
  /** Live region status, or null when not applicable / still loading. */
  status: SameDayStatus | null;
  /** The availability lookup is in flight. */
  loading: boolean;
  /** The selected pickup falls inside the same-day window. */
  isSameDay: boolean;
  /** Same-day pickup AND the region is currently unavailable. */
  blocked: boolean;
};

/** A resolved lookup, tagged with the region it belongs to. */
type Resolved = { regionId: string; status: SameDayStatus | null };

/**
 * Resolve live same-day availability for the chosen region + pickup.
 *
 * Only calls the API when the pickup is actually same-day; otherwise it stays
 * idle. Fails open — a failed lookup never blocks booking, since the backend
 * re-checks availability on submit.
 */
export function useSameDayAvailability(
  regionId: string | undefined,
  pickupDate: Date | undefined,
  pickupTime: string | undefined,
): SameDayAvailability {
  // Result is tagged with its region so a stale value is never trusted.
  const [resolved, setResolved] = useState<Resolved | null>(null);

  const isSameDay = isSameDayPickup(pickupDate, pickupTime);
  const applicable = !!regionId && isSameDay;

  useEffect(() => {
    if (!applicable || !regionId) return;

    let cancelled = false;

    // Small debounce — region/date can change in quick succession.
    const timer = setTimeout(() => {
      getSameDayStatus(regionId)
        .then((res) => {
          if (!cancelled) setResolved({ regionId, status: res.data ?? null });
        })
        .catch(() => {
          // Fail open — record a null status so we stop showing "loading".
          if (!cancelled) setResolved({ regionId, status: null });
        });
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [applicable, regionId]);

  // Everything below is derived — a stale `resolved` from another region is
  // simply ignored, so the effect never needs a synchronous state reset.
  const fresh = applicable && resolved?.regionId === regionId;
  const status = fresh ? resolved!.status : null;
  const loading = applicable && !fresh;
  const blocked = applicable && !!status && !status.available;

  return { status, loading, isSameDay, blocked };
}
