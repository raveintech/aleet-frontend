"use client";

import { BookingWizard, BookingStepIndicator } from "./booking-wizard";

export function BookingShell() {
    return (
        <BookingWizard
            renderIndicator={(step) => (
                <div className="w-full border-b border-white/4 bg-[#050d0c]/60 py-5">
                    <div className="mx-auto px-4 max-w-5xl">
                        <BookingStepIndicator step={step} />
                    </div>
                </div>
            )}
        />
    );
}