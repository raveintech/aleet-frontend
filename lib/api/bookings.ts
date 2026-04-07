import { apiFetch } from "@/lib/api";
import type { BookingData } from "@/app/components/booking/booking-types";
import moment from "moment";

// ─── Response types ────────────────────────────────────────────────────────

export type BookingPreviewAddon = {
  _id: string;
  name: string;
  type: string;
  price: number;
};

export type BookingPreviewDistance = {
  baseToPickupMiles: number;
  freeMiles: number;
  surchargePerMile: number;
  distanceSurcharge: number;
};

export type BookingPreviewBreakdown = {
  baseRate: number;
  hours: number;
  qty: number;
  addOns?: BookingPreviewAddon[];
  freeHoursUsed: number;
  freeHoursLeft: number;
  distance: BookingPreviewDistance;
};

export type BookingPriceResult = {
  vehicleType: { _id: string; name: string; hourlyPrice: number };
  quantity: number;
  startDate: string;
  endDate: string;
  hours: number;
  regularPrice: number;
  total: number;
  breakdown: BookingPreviewBreakdown;
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function buildDateTime(date: Date, timeStr: string): string {
  // Try strict parse first with all common formats
  // "10:00 AM", "08:15 AM", "10:30 am", "10:30AM", "14:00", "14:00:00"
  let parsed = moment(
    timeStr.trim(),
    [
      "h:mm A",
      "hh:mm A",
      "h:mm a",
      "hh:mm a",
      "h:mmA",
      "hh:mmA",
      "H:mm",
      "HH:mm",
      "H:mm:ss",
      "HH:mm:ss",
    ],
    true, // strict
  );

  // If strict fails (e.g. ambiguous format), fall back to non-strict
  if (!parsed.isValid()) {
    parsed = moment(
      timeStr.trim(),
      ["h:mm A", "hh:mm A", "H:mm", "HH:mm"],
      false,
    );
  }

  if (!parsed.isValid()) {
    console.warn("[bookings] Could not parse time:", JSON.stringify(timeStr));
  }

  const h = parsed.isValid() ? parsed.hours() : 0;
  const min = parsed.isValid() ? parsed.minutes() : 0;

  // Build as UTC to avoid local timezone shifting the date
  return moment
    .utc({
      year: date.getFullYear(),
      month: date.getMonth(),
      date: date.getDate(),
      hour: h,
      minute: min,
      second: 0,
      millisecond: 0,
    })
    .toISOString();
}

function serializeBookingData(data: BookingData) {
  // Fall back to pickupTime if dropoffTime was never confirmed in the picker
  const effectiveDropoffTime =
    data.dropoffTime || data.pickupTime || "10:00 AM";

  console.log("[bookings] serialize times:", {
    pickupTime: data.pickupTime,
    dropoffTime: data.dropoffTime,
    effectiveDropoffTime,
  });

  const startDate =
    data.pickupDate && data.pickupTime
      ? buildDateTime(data.pickupDate, data.pickupTime)
      : undefined;
  const endDate = data.dropoffDate
    ? buildDateTime(data.dropoffDate, effectiveDropoffTime)
    : undefined;

  return {
    region: data.regionId || data.region,
    startDate,
    endDate,
    vehicleTypeId: data.vehicleTypeId,
    quantity: data.quantity,
    pickupLocation: data.pickupAddress.text || data.pickupAddress.placeId,
    dropoffLocation: data.dropoffAddress.text || data.dropoffAddress.placeId,
    freeRouting: data.freeRouting,
    stops: data.stops
      .filter((s) => s.address.text)
      .map((s) => ({ location: s.address.text })),
    addOns: data.selectedAddons,
  };
}

// ─── Response types for booking creation ──────────────────────────────────

export type BookingResult = {
  booking: {
    _id: string;
    status: string;
    region: string;
    pickupLocation: string;
    dropoffLocation: string;
    dates: { startDate: string; endDate: string };
    vehicleType: string;
    quantity: number;
    addOns: string[];
    stops: unknown[];
    finalPrice: number;
    regularPrice: number;
    paymentStatus: string;
    createdAt: string;
  };
  breakdown: Record<string, unknown>;
};

// ─── API calls ──────────────────────────────────────────────────────────────

export function calculateBookingPrice(data: BookingData, token?: string) {
  return apiFetch<BookingPriceResult>("/bookings/preview", {
    method: "POST",
    body: serializeBookingData(data),
    token,
  });
}

export function startBooking(data: BookingData, token?: string) {
  return apiFetch<BookingResult>("/bookings/start", {
    method: "POST",
    body: serializeBookingData(data),
    token,
  });
}
