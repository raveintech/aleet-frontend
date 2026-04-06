"use client";

import { useState, useRef } from "react";
import { Clock } from "lucide-react";
import { Dropdown, FieldTrigger, Popup } from "./dropdown";

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, "0"));
const MINUTES = ["00", "15", "30", "45"];
const PERIODS = ["AM", "PM"];

export function TimePicker({
    label,
    value,
    onChange,
    placeholder = "Select Time",
}: {
    label: string;
    value: string;
    onChange: (t: string) => void;
    placeholder?: string;
}) {
    const [open, setOpen] = useState(false);
    const [hour, setHour] = useState("10");
    const [minute, setMinute] = useState("00");
    const [period, setPeriod] = useState("AM");
    const triggerRef = useRef<HTMLDivElement>(null);

    function confirm() {
        onChange(`${hour}:${minute} ${period}`);
        setOpen(false);
    }

    return (
        <Dropdown open={open} onClose={() => setOpen(false)}>
            <div ref={triggerRef}>
                <FieldTrigger
                    label={label}
                    value={value}
                    placeholder={placeholder}
                    icon={<Clock className="h-3.5 w-3.5" />}
                    open={open}
                    onClick={() => setOpen((v) => !v)}
                />
            </div>
            {open && (
                <Popup anchorRef={triggerRef}>
                    <div className="p-3">
                        {/* Column headers */}
                        <div className="mb-2 grid grid-cols-3 text-center">
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#3a5060]">Hr</span>
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#3a5060]">Min</span>
                            <span className="text-[10px] font-semibold uppercase tracking-widest text-[#3a5060]">AM/PM</span>
                        </div>

                        <div className="mb-2 h-px bg-[#1e2a2c]" />

                        <div className="grid grid-cols-3 gap-1">
                            {/* Hours — scrollable */}
                            <div className="flex flex-col gap-0.5 max-h-42 overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                                {HOURS.map((h) => (
                                    <button
                                        key={h}
                                        type="button"
                                        onClick={() => setHour(h)}
                                        className={`w-full rounded-lg py-2 text-center text-[13px] font-semibold transition-all duration-150 ${hour === h
                                            ? "bg-[#bca066] text-[#0d0e0b] shadow-[0_2px_8px_rgba(188,160,102,0.25)]"
                                            : "text-[#6a8090] hover:bg-[#1a2830] hover:text-white"
                                            }`}
                                    >
                                        {h}
                                    </button>
                                ))}
                            </div>

                            {/* Minutes */}
                            <div className="flex flex-col gap-0.5">
                                {MINUTES.map((m) => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setMinute(m)}
                                        className={`w-full rounded-lg py-2 text-center text-[13px] font-semibold transition-all duration-150 ${minute === m
                                            ? "bg-[#bca066] text-[#0d0e0b] shadow-[0_2px_8px_rgba(188,160,102,0.25)]"
                                            : "text-[#6a8090] hover:bg-[#1a2830] hover:text-white"
                                            }`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>

                            {/* AM / PM */}
                            <div className="flex flex-col gap-0.5">
                                {PERIODS.map((p) => (
                                    <button
                                        key={p}
                                        type="button"
                                        onClick={() => setPeriod(p)}
                                        className={`w-full rounded-lg py-2 text-center text-[13px] font-semibold transition-all duration-150 ${period === p
                                            ? "bg-[#1e2a2c] text-[#bca066] ring-1 ring-[#bca066]/50"
                                            : "text-[#6a8090] hover:bg-[#1a2830] hover:text-white"
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="mt-3 h-px bg-[#1e2a2c]" />

                        <button
                            type="button"
                            onClick={confirm}
                            className="mt-3 w-full rounded-lg bg-[#bca066] py-2.5 text-[13px] font-semibold text-[#0d0e0b] transition-colors hover:bg-[#cdb077] active:scale-[0.98]"
                        >
                            Confirm {hour}:{minute} {period}
                        </button>
                    </div>
                </Popup>
            )}
        </Dropdown>
    );
}
