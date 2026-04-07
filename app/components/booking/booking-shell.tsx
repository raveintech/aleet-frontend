"use client";

import { useState } from "react";
import { BookingWizard, BookingStepIndicator } from "./booking-wizard";

export function BookingShell() {
    const [step, setStep] = useState(1);

    return (
        <>
            {/* ── Step indicator — full viewport width, visually centered like header ── */}
            <div className="w-full border-b border-white/4 bg-[#050d0c]/60 py-5">
                <div className="mx-auto px-4 max-w-5xl">
                    <BookingStepIndicator step={step as 1 | 2 | 3} />
                </div>
            </div>

            {/* ── Wizard content ── */}
            <main className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
                <BookingWizard onStepChange={setStep} />
            </main>
        </>
    );
}