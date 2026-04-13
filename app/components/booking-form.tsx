"use client";

import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { DatePicker, TimePicker, Select } from "./ui";
import { CarIcon, MapPinIcon } from "./ui/icons";
import { getVehicleTypes, type VehicleType } from "@/lib/api/vehicle-types";
import { getRegions, type Region } from "@/lib/api/regions";
import { savePendingBooking } from "@/lib/pending-booking";
import { getToken } from "@/lib/auth";
import { cn } from "@/lib/utils";
import {
    isPickupTimeDisabled,
    isDropoffTimeDisabled,
    isDropoffTimeBeforePickup,
    slotFromTimeStr,
    combineDateAndTime,
    MIN_DURATION_HOURS,
} from "@/lib/booking-constraints";
import type { SelectOption } from "./ui/select";
import { toast } from "sonner";

const STATE_OPTIONS: SelectOption[] = [];

// Extended option to carry raw API data
type VehicleOption = SelectOption & { _id: string; hourlyPrice: number };
type RegionOption = SelectOption & { _id: string };

export function BookingForm() {
    const router = useRouter();
    const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
    const [pickupTime, setPickupTime] = useState("");
    const [dropoffDate, setDropoffDate] = useState<Date | undefined>(undefined);
    const [dropoffTime, setDropoffTime] = useState("");
    const [vehicle, setVehicle] = useState("");
    const [state, setState] = useState("");

    const [isLoading, setIsLoading] = useState(false);
    const [vehicleList, setVehicleList] = useState<VehicleOption[]>([]);
    const [regionList, setRegionList] = useState<RegionOption[]>([]);


    const handlePickupDateChange = (d: Date | undefined) => {
        setPickupDate(d);
        if (d && dropoffDate && dropoffDate < d) {
            setDropoffDate(undefined);
            setDropoffTime("");
        }
    };


    const handlePickupTimeChange = (t: string) => {
        setPickupTime(t);
        // If a full combo exists, verify it's still ≥ 3 h
        if (pickupDate && dropoffDate && dropoffTime) {
            const invalid = isDropoffTimeDisabled(pickupDate, t, dropoffDate, slotFromTimeStr(dropoffTime));
            if (invalid) setDropoffTime("");
        }
    };

    const handleDropoffDateChange = (d: Date | undefined) => {
        setDropoffDate(d);
        // Re-validate the already-selected drop-off time against the new date
        if (d && pickupDate && pickupTime && dropoffTime) {
            const invalid = isDropoffTimeDisabled(pickupDate, pickupTime, d, slotFromTimeStr(dropoffTime));
            if (invalid) setDropoffTime("");
        }
    };

    useEffect(() => {
        getVehicleTypes()
            .then((res) => {
                const opts: VehicleOption[] = (res.data ?? []).map((v: VehicleType) => ({
                    label: v.name,
                    price: `$${v.hourlyPrice}/hr`,
                    _id: v._id,
                    hourlyPrice: v.hourlyPrice,
                }));
                setVehicleList(opts);
            })
            .catch(() => { });
    }, []);

    useEffect(() => {
        getRegions()
            .then((res) => {
                const opts: RegionOption[] = (res.data ?? []).map((r: Region) => ({
                    label: r.name,
                    _id: r._id,
                }));
                setRegionList(opts);
            })
            .catch(() => { });
    }, []);

    const handleQuickBooking = useCallback(async () => {

        if (!pickupDate || !pickupTime || !dropoffDate || !dropoffTime || !vehicle || !state) {
            toast.error("Please fill in all fields before proceeding.");
            return;
        }

        if (isLoading) return;
        setIsLoading(true);

        const token = getToken();

        // Find selected vehicle/region objects
        // Select stores value as `${label} ${price}` (e.g. "SUV $160/hr"), so match against that
        const selectedVehicle = vehicleList.find((v) => {
            const display = v.price ? `${v.label} ${v.price}` : v.label;
            return display === vehicle;
        });
        const selectedRegion = regionList.find((r) => r.label === state);

        // Save whatever the user has filled (can be partial)
        savePendingBooking({
            pickupDate: pickupDate ? pickupDate.toISOString() : null,
            dropoffDate: dropoffDate ? dropoffDate.toISOString() : null,
            pickupTime,
            dropoffTime,
            vehicleType: selectedVehicle?.label ?? vehicle,
            vehicleTypeId: selectedVehicle?._id ?? "",
            vehicleHourlyRate: selectedVehicle?.hourlyPrice ?? 0,
            region: selectedRegion?.label ?? state,
            regionId: selectedRegion?._id ?? "",
        });

        // Artificial 1-second delay for better UX feedback
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (token) {
            // Already logged in — go straight to booking
            router.push("/booking");
        } else {
            // Not logged in — redirect to login, then to booking
            router.push("/login?next=/booking");
        }
    }, [isLoading, vehicleList, regionList, vehicle, state, pickupDate, dropoffDate, pickupTime, dropoffTime, router]);

    const vehicleOptions: SelectOption[] = vehicleList;
    const regionOptions: SelectOption[] = regionList;

    // Calculate duration in hours between pickup and dropoff
    const durationHours = (() => {
        if (!pickupDate || !pickupTime || !dropoffDate || !dropoffTime) return null;
        const start = combineDateAndTime(pickupDate, pickupTime);
        const end = combineDateAndTime(dropoffDate, dropoffTime);
        if (!start || !end) return null;
        const h = (end.getTime() - start.getTime()) / 3_600_000;
        return h > 0 ? h : 0;
    })();

    const isDurationTooShort = durationHours !== null && durationHours < MIN_DURATION_HOURS;
    const showMinimumNotice = durationHours !== null && durationHours < MIN_DURATION_HOURS;
    const isBookingDisabled = isLoading || isDurationTooShort;

    return (
        <>
            <section className="rounded-2xl border border-[#2a3336] bg-[rgba(12,18,17,0.82)] p-3 shadow-[0_14px_40px_rgba(0,0,0,0.4)] backdrop-blur-sm sm:p-5">
                {/* Row 1: Pick Up + Vehicle */}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                    <DatePicker label="Pick Up Date" value={pickupDate} onChange={handlePickupDateChange} />
                    <TimePicker
                        label="Pick Up Time"
                        value={pickupTime}
                        onChange={handlePickupTimeChange}
                        disableSlot={(slot) => isPickupTimeDisabled(pickupDate, slot)}
                    />
                    <Select
                        label="Vehicle Type"
                        placeholder="Select Vehicle"
                        icon={<CarIcon className="h-3.5 w-3.5" />}
                        options={vehicleOptions}
                        value={vehicle}
                        onChange={setVehicle}
                    />
                    <Select
                        label="State"
                        placeholder="Select State"
                        icon={<MapPinIcon className="h-3.5 w-3.5" />}
                        options={regionOptions}
                        value={state}
                        onChange={setState}
                    />
                </div>

                {/* Row 2: Drop-off + CTA */}
                <div className="mt-2 grid grid-cols-2 gap-2 sm:mt-6 sm:grid-cols-4 sm:gap-3">
                    <DatePicker
                        label="Drop-off Date"
                        value={dropoffDate}
                        onChange={handleDropoffDateChange}
                        minDate={pickupDate}
                    />
                    <TimePicker
                        label="Drop-off Time"
                        value={dropoffTime}
                        onChange={setDropoffTime}
                        disableSlot={(slot) =>
                            isDropoffTimeBeforePickup(pickupDate, pickupTime, dropoffDate, slot)
                        }
                        disabledMessage="Must be after pick-up time"
                    />
                    <button
                        type="button"
                        aria-disabled={isBookingDisabled}
                        onClick={isBookingDisabled ? undefined : handleQuickBooking}
                        className={cn(
                            "col-span-2 mt-1 inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#4a171a] px-4 text-[14px] font-medium text-white transition-colors hover:bg-[#5a1e22] sm:col-span-2 sm:mt-6 sm:h-12 sm:text-[15px]",
                            isBookingDisabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
                        )}
                    >
                        {isLoading && (
                            <Loader2 className="mr-2 h-[1em] w-[1em] animate-spin" />
                        )}
                        Quick Booking (3+ Hrs)
                    </button>
                </div>
            </section>
            {showMinimumNotice && (
                <p className="mt-2.5 px-1 text-[11px] text-[#5a7080] sm:mt-3">
                    Regular bookings require a <span className="text-[#bca066]/80">3-hour minimum</span>.{" "}
                    <Link href="#" className="text-[#bca066]/80 underline underline-offset-2 hover:text-[#bca066] transition-colors">
                        Membership
                    </Link>{" "}
                    removes the minimum.
                </p>
            )}
        </>
    );
}
