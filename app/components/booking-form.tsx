"use client";

import { useState } from "react";
import { DatePicker, TimePicker, Select } from "./ui";
import { CarIcon, MapPinIcon } from "./ui/icons";

const VEHICLE_OPTIONS = [
    { label: "Black Truck", price: "$150/hr" },
    { label: "Sedan", price: "$137/hr" },
    { label: "SUV", price: "$160/hr" },
    { label: "Sprinter", price: "$200/hr" },
];

const STATE_OPTIONS = [
    { label: "New York" },
    { label: "Texas" },
    { label: "Florida" },
    { label: "Illinois" },
    { label: "Pennsylvania" },
    { label: "Ohio" },
    { label: "Georgia" },
    { label: "North Carolina" },
    { label: "Michigan" },
];

export function BookingForm() {
    const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
    const [pickupTime, setPickupTime] = useState("");
    const [dropoffDate, setDropoffDate] = useState<Date | undefined>(undefined);
    const [dropoffTime, setDropoffTime] = useState("");
    const [vehicle, setVehicle] = useState("");
    const [state, setState] = useState("");

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
                    options={VEHICLE_OPTIONS}
                    value={vehicle}
                    onChange={setVehicle}
                />
                <Select
                    label="State"
                    placeholder="Select State"
                    icon={<MapPinIcon className="h-3.5 w-3.5" />}
                    options={STATE_OPTIONS}
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
