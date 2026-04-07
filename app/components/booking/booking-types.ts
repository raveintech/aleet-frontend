export type BookingStop = {
  id: string;
  address: PlaceValue;
};

/** Stores both the display text and the stable Google placeId */
export type PlaceValue = {
  text: string; // human-readable address (for display only)
  placeId: string; // stable Google Place ID (save this to DB)
};

export type BookingData = {
  // Step 1
  pickupDate: Date | undefined;
  pickupTime: string;
  dropoffDate: Date | undefined;
  dropoffTime: string;
  vehicleType: string;
  vehicleTypeId: string;
  vehicleHourlyRate: number;
  region: string;
  regionId: string;

  // Step 2
  pickupAddress: PlaceValue;
  dropoffAddress: PlaceValue;
  stops: BookingStop[];
  freeRouting: boolean;
  quantity: number;
  selectedAddons: string[];
  specialRequests: string;
};

export const EMPTY_BOOKING: BookingData = {
  pickupDate: undefined,
  pickupTime: "",
  dropoffDate: undefined,
  dropoffTime: "",
  vehicleType: "",
  vehicleTypeId: "",
  vehicleHourlyRate: 0,
  region: "",
  regionId: "",

  pickupAddress: { text: "", placeId: "" },
  dropoffAddress: { text: "", placeId: "" },
  stops: [],
  freeRouting: false,
  quantity: 1,
  selectedAddons: [],
  specialRequests: "",
};
