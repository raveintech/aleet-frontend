"use client";

import { useRef, useEffect, useState } from "react";
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
            if (ref.current && ref.current.contains(e.target as Node)) return;
            // Не закриваємо якщо клік всередині portal popup
            if ((e.target as HTMLElement).closest("[data-dropdown-popup]")) return;
            onClose();
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
    placement = "bottom",
    matchWidth = true,
}: {
    anchorRef: React.RefObject<HTMLElement | null>;
    children: React.ReactNode;
    placement?: "top" | "bottom";
    /** If true (default), popup width matches the anchor. If false, popup can be wider (min-width = anchor). */
    matchWidth?: boolean;
}) {
    const popupRef = useRef<HTMLDivElement>(null);
    const [coords, setCoords] = useState<{ top: number; left: number; width: number; minWidth: number; maxHeight: number } | null>(null);
    const [visible, setVisible] = useState(false);

    function measure() {
        const anchor = anchorRef.current;
        const popup = popupRef.current;
        if (!anchor || !popup) return;

        const margin = 8;
        const r = anchor.getBoundingClientRect();
        const popupHeight = popup.offsetHeight;
        const popupWidth = matchWidth ? r.width : popup.scrollWidth;
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        // Clamp left so the popup doesn't overflow the right edge of the viewport
        const maxLeft = vw - popupWidth - margin;
        const left = Math.min(r.left, maxLeft);

        // Vertical: auto-flip to whichever side has more room, then clamp into viewport
        const spaceBelow = vh - r.bottom - margin;
        const spaceAbove = r.top - margin;
        let side = placement;
        if (side === "bottom" && popupHeight > spaceBelow && spaceAbove > spaceBelow) {
            side = "top";
        } else if (side === "top" && popupHeight > spaceAbove && spaceBelow > spaceAbove) {
            side = "bottom";
        }

        let top = side === "top" ? r.top - popupHeight - margin : r.bottom + margin;
        const maxTop = vh - popupHeight - margin;
        top = Math.max(margin, Math.min(top, maxTop));

        setCoords({
            top,
            left: Math.max(margin, left),
            width: matchWidth ? r.width : popupWidth,
            minWidth: r.width,
            maxHeight: vh - 2 * margin,
        });
    }

    useEffect(() => {
        measure();
        // два RAF — гарантовано після браузерного paint з правильними coords
        let raf1: number;
        let raf2: number;
        raf1 = requestAnimationFrame(() => {
            raf2 = requestAnimationFrame(() => setVisible(true));
        });
        return () => {
            cancelAnimationFrame(raf1);
            cancelAnimationFrame(raf2);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        window.addEventListener("scroll", measure, true);
        window.addEventListener("resize", measure);
        return () => {
            window.removeEventListener("scroll", measure, true);
            window.removeEventListener("resize", measure);
        };
    }, [anchorRef, placement, matchWidth]);

    return createPortal(
        <div
            ref={popupRef}
            data-dropdown-popup=""
            style={coords
                ? { top: coords.top, left: coords.left, width: coords.width, minWidth: coords.minWidth, maxHeight: coords.maxHeight }
                : { top: -9999, left: -9999, width: 0, minWidth: 0 }
            }
            className={`fixed z-9999 overflow-x-hidden overflow-y-auto rounded-xl border border-[#2a3336] bg-[#111918] shadow-[0_16px_48px_rgba(0,0,0,0.6)] transition-opacity duration-150 ${visible ? "opacity-100" : "opacity-0"}`}
        >
            {children}
        </div>,
        document.body,
    );
}
