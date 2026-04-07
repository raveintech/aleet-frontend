"use client";

import { useState, useEffect } from "react";
import { DatePicker, TimePicker, Select } from "./ui";
import { CarIcon, MapPinIcon } from "./ui/icons";
import { getVehicleTypes, type VehicleType } from "@/lib/api/vehicle-types";
import { getRegions, type Region } from "@/lib/api/regions";
import type { SelectOption } from "./ui/select";

const STATE_OPTIONS: SelectOption[] = [];

export function BookingForm() {
    const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
    const [pickupTime, setPickupTime] = useState("");
    const [dropoffDate, setDropoffDate] = useState<Date | undefined>(undefined);
    const [dropoffTime, setDropoffTime] = useState("");
    const [vehicle, setVehicle] = useState("");
    const [state, setState] = useState("");

    const [vehicleOptions, setVehicleOptions] = useState<SelectOption[]>([]);
    const [regionOptions, setRegionOptions] = useState<SelectOption[]>([]);

    useEffect(() => {
        getVehicleTypes()
            .then((res) => {
                const options: SelectOption[] = (res.data ?? []).map((v: VehicleType) => ({
                    label: v.name,
                    price: `$${v.hourlyPrice}/hr`,
                }));
                setVehicleOptions(options);
            })
            .catch(() => { });
    }, []);

    useEffect(() => {
        getRegions()
            .then((res) => {
                const options: SelectOption[] = (res.data ?? []).map((r: Region) => ({
                    label: r.name,
                }));
                setRegionOptions(options);
            })
            .catch(() => { });
    }, []);

    return (
        <section className="rounded-2xl border border-[#2a3336] bg-[rgba(12,18,17,0.82)] p-3 shadow-[0_14px_40px_rgba(0,0,0,0.4)] backdrop-blur-sm sm:p-5">
            {/* Row 1: Pick Up + Vehicle */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
                <DatePicker label="Pick Up Date" value={pickupDate} onChange={setPickupDate} />
                <TimePicker label="Pick Up Time" value={pickupTime} onChange={setPickupTime} />
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
                <DatePicker label="Drop-off Date" value={dropoffDate} onChange={setDropoffDate} minDate={pickupDate} />
                <TimePicker label="Drop-off Time" value={dropoffTime} onChange={setDropoffTime} />
                <button
                    type="button"
                    className="col-span-2 mt-1 cursor-pointer inline-flex h-11 w-full items-center justify-center rounded-xl bg-[#4a171a] px-4 text-[14px] font-medium text-white transition-colors hover:bg-[#5a1e22] sm:col-span-2 sm:mt-6 sm:h-12 sm:text-[15px]"
                >
                    Quick Booking (3+ Hrs)
                </button>
            </div>
        </section>
    );
}
