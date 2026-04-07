"use client";

import { Fragment, useState, useEffect, useRef } from "react";
import Link from "next/link";
import { EMPTY_BOOKING, type BookingData } from "./booking-types";
import { StepTrip } from "./step-trip";
import { StepRoute } from "./step-route";
import { StepConfirm } from "./step-confirm";
import { calculateBookingPrice, startBooking, type BookingPriceResult } from "@/lib/api/bookings";
import { fetchAddons, type ApiAddon } from "@/lib/api/addons";
import { PriceBar } from "./price-bar";
import { getToken } from "@/lib/auth";
import { ApiError } from "@/lib/api";
import { toast } from "@/app/components/ui";

type Step = 1 | 2 | 3;

const STEPS: { label: string; sub: string }[] = [
    { label: "Trip", sub: "Dates & vehicle" },
    { label: "Route", sub: "Locations & extras" },
    { label: "Confirm", sub: "Review & book" },
];

function StepIndicator({ current }: { current: Step }) {
    return (
        <div className="flex w-full items-center">
            {STEPS.map((step, i) => {
                const idx = (i + 1) as Step;
                const isDone = current > idx;
                const isActive = current === idx;
                return (
                    <Fragment key={step.label}>
                        {/* Left connector (before this node) */}
                        {i > 0 && (
                            <div className="relative mb-6 h-0.5 flex-1 overflow-hidden rounded-full bg-[#1e2a2c]">
                                <div
                                    className="absolute inset-0 origin-left rounded-full bg-[#bca066]/50 transition-transform duration-500 ease-in-out"
                                    style={{ transform: current > idx - 1 ? "scaleX(1)" : "scaleX(0)" }}
                                />
                            </div>
                        )}
                        {/* Node */}
                        <div className="flex shrink-0 flex-col items-center gap-1.5">
                            <div
                                className={`flex h-8 w-8 items-center justify-center rounded-full border text-[13px] font-semibold transition-all duration-300 ${isDone
                                    ? "border-[#bca066]/30 bg-[#bca066]/15 text-[#bca066]"
                                    : isActive
                                        ? "border-[#bca066] bg-[#bca066] text-[#0a0900] shadow-[0_0_12px_rgba(188,160,102,0.35)]"
                                        : "border-[#1e2a2c] bg-[#0c1211] text-[#3a5060]"
                                    }`}
                            >
                                {isDone ? (
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4">
                                        <path d="m5 13 4 4L19 7" />
                                    </svg>
                                ) : (
                                    idx
                                )}
                            </div>
                            <div className="text-center">
                                <p className={`text-[12px] font-semibold ${isActive ? "text-white" : isDone ? "text-[#bca066]/70" : "text-[#3a5060]"}`}>
                                    {step.label}
                                </p>
                                <p className="hidden text-[10px] text-[#3a5060] sm:block">{step.sub}</p>
                            </div>
                        </div>
                        {/* Right connector (after last node — not needed) */}
                    </Fragment>
                );
            })}
        </div>
    );
}

export function BookingStepIndicator({ step }: { step: Step }) {
    return <StepIndicator current={step} />;
}

export function BookingWizard({ onStepChange }: { onStepChange?: (s: number) => void }) {
    const [step, setStep] = useState<Step>(1);
    const [data, setData] = useState<BookingData>(EMPTY_BOOKING);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [serverPrice, setServerPrice] = useState<BookingPriceResult | null>(null);
    const [priceLoading, setPriceLoading] = useState(false);
    const [freeAddons, setFreeAddons] = useState<ApiAddon[]>([]);
    const [paidAddons, setPaidAddons] = useState<ApiAddon[]>([]);
    const [addonsLoading, setAddonsLoading] = useState(true);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Fetch addons once on mount
    useEffect(() => {
        fetchAddons(getToken() ?? undefined)
            .then((res) => {
                if (res.data) {
                    setFreeAddons(res.data.free);
                    setPaidAddons(res.data.paid);
                }
            })
            .catch(() => { /* silently ignore */ })
            .finally(() => setAddonsLoading(false));
    }, []);

    // Recalculate price whenever data changes (debounced 600ms)
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(async () => {
            if (!data.vehicleTypeId) return;
            if (!data.dropoffDate || !data.dropoffTime) return;
            setPriceLoading(true);
            try {
                const token = getToken() ?? undefined;
                const res = await calculateBookingPrice(data, token);
                if (res.data) setServerPrice(res.data);
            } catch (err) {
                toast.error(err instanceof ApiError ? err.message : "Failed to calculate price.");
            } finally {
                setPriceLoading(false);
            }
        }, 600);
        return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
    }, [data]);

    async function goTo(s: Step) {
        setStep(s);
        onStepChange?.(s);
    }

    function handleChange(patch: Partial<BookingData>) {
        setData((prev) => ({ ...prev, ...patch }));
    }

    async function handleConfirm() {
        setIsSubmitting(true);
        try {
            const token = getToken() ?? undefined;
            await startBooking(data, token);
            setSubmitted(true);
        } catch (err) {
            toast.error(err instanceof ApiError ? err.message : "Failed to create booking.");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (submitted) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-[#bca066]/30 bg-[#bca066]/10 text-[#bca066]">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-8 w-8">
                        <path d="m5 13 4 4L19 7" />
                    </svg>
                </div>
                <h2 className="mb-2 text-[24px] font-semibold text-white">Booking Confirmed</h2>
                <p className="max-w-sm text-[14px] text-white/50">
                    Your reservation has been received. You&apos;ll get a confirmation email shortly.
                </p>
                <Link
                    href="/dashboard"
                    className="mt-8 inline-flex items-center gap-2 rounded-xl border border-[#bca066]/30 bg-[#bca066]/10 px-5 py-2.5 text-[13px] font-medium text-[#bca066] transition-colors hover:bg-[#bca066]/20"
                >
                    View my bookings →
                </Link>
            </div>
        );
    }

    const clientEstimate = data.vehicleHourlyRate > 0 && data.quantity > 0
        ? (() => {
            const { pickupDate, dropoffDate, pickupTime, dropoffTime } = data;
            if (!pickupDate || !dropoffDate || !pickupTime || !dropoffTime) return null;
            const parseTime = (t: string) => {
                const m = t.match(/^(\d+):(\d+)\s*(AM|PM)?$/i);
                if (!m) return null;
                let h = parseInt(m[1], 10);
                const min = parseInt(m[2], 10);
                const period = m[3]?.toUpperCase();
                if (period === "PM" && h !== 12) h += 12;
                if (period === "AM" && h === 12) h = 0;
                return { h, min };
            };
            const p = parseTime(pickupTime);
            const d = parseTime(dropoffTime);
            if (!p || !d) return null;
            const pickupMs = new Date(pickupDate.getFullYear(), pickupDate.getMonth(), pickupDate.getDate(), p.h, p.min).getTime();
            const dropoffMs = new Date(dropoffDate.getFullYear(), dropoffDate.getMonth(), dropoffDate.getDate(), d.h, d.min).getTime();
            const diff = (dropoffMs - pickupMs) / 3600000;
            if (diff <= 0) return null;
            return data.vehicleHourlyRate * data.quantity * diff;
        })()
        : null;

    const priceBarEl = (
        <PriceBar
            serverPrice={serverPrice}
            priceLoading={priceLoading}
            clientEstimate={clientEstimate}
        />
    );

    return (
        <div>
            {step === 1 && (
                <StepTrip data={data} onChange={handleChange} onNext={() => goTo(2)} priceBar={priceBarEl} />
            )}
            {step === 2 && (
                <StepRoute data={data} onChange={handleChange} onNext={() => goTo(3)} onBack={() => goTo(1)} priceBar={priceBarEl} freeAddons={freeAddons} paidAddons={paidAddons} addonsLoading={addonsLoading} />
            )}
            {step === 3 && (
                <StepConfirm
                    data={data}
                    serverPrice={serverPrice}
                    priceLoading={priceLoading}
                    freeAddons={freeAddons}
                    paidAddons={paidAddons}
                    onBack={() => goTo(2)}
                    onConfirm={handleConfirm}
                    isLoading={isSubmitting}
                />
            )}
        </div>
    );
}
