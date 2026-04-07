"use client";

import { createContext, useContext, useState } from "react";
import Image, { StaticImageData } from "next/image";
import { Toggle } from "./ui/toggle";

type DayNightMode = "day" | "night";

interface DayNightContextValue {
    mode: DayNightMode;
    toggle: () => void;
}

const DayNightContext = createContext<DayNightContextValue | null>(null);

function useDayNight() {
    const ctx = useContext(DayNightContext);
    if (!ctx) throw new Error("useDayNight must be used inside DayNightProvider");
    return ctx;
}

export function DayNightProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<DayNightMode>("day");
    const toggle = () => setMode((m) => (m === "night" ? "day" : "night"));

    return (
        <DayNightContext.Provider value={{ mode, toggle }}>
            {children}
        </DayNightContext.Provider>
    );
}

interface DayNightBackgroundProps {
    bgDay: StaticImageData;
    bgNight: StaticImageData;
}

export function DayNightBackground({ bgDay, bgNight }: DayNightBackgroundProps) {
    const { mode } = useDayNight();

    return (
        <>
            <Image
                src={bgNight}
                alt="Night background"
                className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${mode === "night" ? "opacity-100" : "opacity-0"
                    }`}
                priority
            />
            <Image
                src={bgDay}
                alt="Day background"
                className={`pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${mode === "day" ? "opacity-100" : "opacity-0"
                    }`}
                priority
            />
        </>
    );
}

export function DayNightToggleButton() {
    const { mode, toggle } = useDayNight();
    const isDay = mode === "day";

    return (
        <Toggle
            checked={isDay}
            onChange={() => toggle()}
            ariaLabel={isDay ? "Switch to night mode" : "Switch to day mode"}
        />
    );
}
