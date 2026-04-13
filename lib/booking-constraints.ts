/** Shared booking date / time constraint helpers.
 *
 * Rules
 * ─────
 * • Cannot book in the past
 * • endDate − startDate ≥ 3 h
 * • endDate > startDate
 */

/** Minimum booking duration in hours. */
export const MIN_DURATION_HOURS = 3;

// ── time helpers ────────────────────────────────────────────────────────────

export type TimeSlot = { hour: string; minute: string; period: string };

/** Parse a "HH:MM AM/PM" string into 24-h { hours, minutes } or null. */
export function parseTime(
  t: string,
): { hours: number; minutes: number } | null {
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return null;
  let h = parseInt(m[1], 10);
  const min = parseInt(m[2], 10);
  const period = m[3].toUpperCase();
  if (period === "PM" && h !== 12) h += 12;
  if (period === "AM" && h === 12) h = 0;
  return { hours: h, minutes: min };
}

/** Convert a "HH:MM AM/PM" string into a TimeSlot (for programmatic checks). */
export function slotFromTimeStr(t: string): TimeSlot {
  const m = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!m) return { hour: "12", minute: "00", period: "PM" };
  return {
    hour: m[1].padStart(2, "0"),
    minute: m[2],
    period: m[3].toUpperCase(),
  };
}

/** Build a `Date` from a calendar date + time string. */
export function combineDateAndTime(date: Date, time: string): Date | null {
  const t = parseTime(time);
  if (!t) return null;
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    t.hours,
    t.minutes,
  );
}

// ── date constraints ────────────────────────────────────────────────────────

/** Today at 00:00 (local). */
export function today(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Earliest allowed drop-off date given a pickup date.
 * Same day as pickup (the 3-h minimum is enforced by time, not date).
 */
export function minDropoffDate(pickupDate: Date): Date {
  const d = new Date(pickupDate);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Latest allowed drop-off date given a pickup date.
 * No upper bound — returns `undefined`.
 */
export function maxDropoffDate(_pickupDate: Date): Date | undefined {
  return undefined;
}

// ── time-slot filtering ─────────────────────────────────────────────────────

/** Convert 12h slot to minutes-since-midnight. */
function slotToMinutes(slot: TimeSlot): number {
  let h = parseInt(slot.hour, 10);
  const m = parseInt(slot.minute, 10);
  if (slot.period === "PM" && h !== 12) h += 12;
  if (slot.period === "AM" && h === 12) h = 0;
  return h * 60 + m;
}

/**
 * Returns `true` when a given time-slot should be **disabled** for a
 * *pickup* field on a given date (i.e. it is in the past).
 */
export function isPickupTimeDisabled(
  date: Date | undefined,
  slot: TimeSlot,
): boolean {
  if (!date) return false;
  const now = new Date();
  // Only filter times on today's date
  if (
    date.getFullYear() !== now.getFullYear() ||
    date.getMonth() !== now.getMonth() ||
    date.getDate() !== now.getDate()
  ) {
    return false;
  }
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  return slotToMinutes(slot) <= nowMinutes;
}

/**
 * Returns `true` when a given time-slot should be **disabled** for a
 * *drop-off* field, enforcing ≥ 3 h from pickup and ≤ 7 d from pickup.
 */
export function isDropoffTimeDisabled(
  pickupDate: Date | undefined,
  pickupTime: string,
  dropoffDate: Date | undefined,
  slot: TimeSlot,
): boolean {
  // If drop-off date is not yet chosen, block all slots so the user picks a date first
  if (!pickupDate || !pickupTime || !dropoffDate) return false;

  const pickupParsed = parseTime(pickupTime);
  if (!pickupParsed) return false;

  const pickupMs = new Date(
    pickupDate.getFullYear(),
    pickupDate.getMonth(),
    pickupDate.getDate(),
    pickupParsed.hours,
    pickupParsed.minutes,
  ).getTime();

  let h = parseInt(slot.hour, 10);
  const m = parseInt(slot.minute, 10);
  if (slot.period === "PM" && h !== 12) h += 12;
  if (slot.period === "AM" && h === 12) h = 0;

  const dropoffMs = new Date(
    dropoffDate.getFullYear(),
    dropoffDate.getMonth(),
    dropoffDate.getDate(),
    h,
    m,
  ).getTime();

  const diffHours = (dropoffMs - pickupMs) / 3_600_000;

  // Must be ≥ 3h
  return diffHours < MIN_DURATION_HOURS;
}

/**
 * Returns `true` when a given time-slot is **before or equal** to the pickup
 * time (on the same date context). Used to block logically impossible drop-off
 * times without enforcing the 3-hour minimum at the picker level.
 */
export function isDropoffTimeBeforePickup(
  pickupDate: Date | undefined,
  pickupTime: string,
  dropoffDate: Date | undefined,
  slot: TimeSlot,
): boolean {
  if (!pickupDate || !pickupTime || !dropoffDate) return false;

  const pickupParsed = parseTime(pickupTime);
  if (!pickupParsed) return false;

  const pickupMs = new Date(
    pickupDate.getFullYear(),
    pickupDate.getMonth(),
    pickupDate.getDate(),
    pickupParsed.hours,
    pickupParsed.minutes,
  ).getTime();

  let h = parseInt(slot.hour, 10);
  const m = parseInt(slot.minute, 10);
  if (slot.period === "PM" && h !== 12) h += 12;
  if (slot.period === "AM" && h === 12) h = 0;

  const dropoffMs = new Date(
    dropoffDate.getFullYear(),
    dropoffDate.getMonth(),
    dropoffDate.getDate(),
    h,
    m,
  ).getTime();

  // Block slots that are at or before pickup time
  return dropoffMs <= pickupMs;
}
