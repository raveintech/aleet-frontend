"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { ChevronDown } from "lucide-react";

// ─── Dropdown wrapper ──────────────────────────────────────────────────────

export function Dropdown({
    open,
    onClose,
    children,
}: {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        function handler(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) onClose();
        }
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [open, onClose]);

    return (
        <div ref={ref} className="relative">
            {children}
        </div>
    );
}

// ─── Field trigger ─────────────────────────────────────────────────────────

export function FieldTrigger({
    label,
    value,
    placeholder,
    icon,
    open,
    onClick,
}: {
    label: string;
    value: string;
    placeholder: string;
    icon: React.ReactNode;
    open: boolean;
    onClick: () => void;
}) {
    return (
        <div>
            <p className="mb-1.5 text-[12px] font-semibold uppercase tracking-widest text-[#7a8a9a]">
                {label}
            </p>
            <button
                type="button"
                onClick={onClick}
                className={`inline-flex h-11 w-full items-center gap-2 rounded-lg border px-3 text-[13px] transition-all duration-200 sm:h-12 sm:text-[14px] ${open
                    ? "border-[#bca066]/60 bg-[#1e1a0e] text-white shadow-[0_0_0_1px_rgba(188,160,102,0.2)]"
                    : value
                        ? "border-[#3a4245] bg-[#212829] text-white hover:border-[#bca066]/30"
                        : "border-[#2e3638] bg-[#1e2527] text-[#5a6870] hover:border-[#3a4245]"
                    }`}
            >
                <span className="text-[#bca066]/70">{icon}</span>
                <span className="flex-1 text-left">{value || placeholder}</span>
                <ChevronDown
                    className={`h-3.5 w-3.5 text-[#5a6870] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>
        </div>
    );
}

// ─── Popup container (portal) ──────────────────────────────────────────────

export function Popup({
    anchorRef,
    children,
}: {
    anchorRef: React.RefObject<HTMLElement | null>;
    children: React.ReactNode;
}) {
    const [mounted, setMounted] = useState(false);
    const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);

    const measure = useCallback(() => {
        if (!anchorRef.current) return;
        const r = anchorRef.current.getBoundingClientRect();
        setCoords({
            top: r.bottom + window.scrollY + 8,
            left: r.left + window.scrollX,
            width: r.width,
        });
    }, [anchorRef]);

    useEffect(() => {
        setMounted(true);
        measure();
        window.addEventListener("scroll", measure, true);
        window.addEventListener("resize", measure);
        return () => {
            window.removeEventListener("scroll", measure, true);
            window.removeEventListener("resize", measure);
        };
    }, [measure]);

    if (!mounted || !coords) return null;

    return createPortal(
        <div
            style={{ top: coords.top, left: coords.left, minWidth: coords.width }}
            className="fixed z-9999 overflow-hidden rounded-xl border border-[#2a3336] bg-[#111918] shadow-[0_16px_48px_rgba(0,0,0,0.6)] animate-in fade-in slide-in-from-top-2 duration-150"
        >
            {children}
        </div>,
        document.body,
    );
}
