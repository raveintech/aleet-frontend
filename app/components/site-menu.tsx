"use client";

import Link from "next/link";
import type { JSX, ReactNode } from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type MenuItem = {
  href: string;
  label: string;
  icon: (props: { className?: string }) => JSX.Element;
};

type SiteMenuProps = {
  items?: MenuItem[];
  className?: string;
};

const defaultItems: MenuItem[] = [
  { href: "#", label: "Book a Ride", icon: CarIcon },
  { href: "#", label: "FAQ", icon: ChatIcon },
  { href: "#", label: "Our Story / Background", icon: TeamIcon },
  { href: "#", label: "Profile Portal", icon: UserIcon },
  { href: "#", label: "Get Your Aleet Kit (NEW)", icon: StarIcon },
  { href: "#", label: "Privacy & Terms", icon: ShieldIcon },
  { href: "#", label: "Contact Us or Live Chat", icon: ContactIcon },
];

export function SiteMenu({ items = defaultItems, className }: SiteMenuProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const openMenu = () => {
    setIsMounted(true);
  };

  const closeMenu = () => {
    setIsVisible(false);
  };

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const frame = window.requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => {
      window.cancelAnimationFrame(frame);
    };
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMounted]);

  useEffect(() => {
    if (isVisible || !isMounted) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsMounted(false);
    }, 260);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [isVisible, isMounted]);

  return (
    <>
      <button
        className={cn(
          "inline-flex h-[30px] w-[38px] cursor-pointer flex-col justify-center gap-[5px] border-0 bg-transparent",
          className,
        )}
        type="button"
        aria-label={isMounted ? "Close menu" : "Open menu"}
        aria-expanded={isMounted}
        onClick={() => {
          if (isMounted) {
            closeMenu();
            return;
          }
          openMenu();
        }}
      >
        <span className="h-[2px] w-[26px] rounded-[2px] bg-[#bca066]" />
        <span className="h-[2px] w-[26px] rounded-[2px] bg-[#bca066]" />
        <span className="h-[2px] w-[26px] rounded-[2px] bg-[#bca066]" />
      </button>

      {isMounted ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close menu overlay"
            className={cn(
              "absolute inset-0 bg-[rgba(0,0,0,0.77)] transition-opacity duration-250",
              isVisible ? "opacity-100" : "opacity-0",
            )}
            onClick={closeMenu}
          />

          <aside
            className={cn(
              "relative z-10 flex h-full w-full max-w-[562px] flex-col bg-[rgba(0,0,0,0.77)] px-9 pt-[64px] pb-8 transition-transform duration-250 ease-out",
              isVisible ? "translate-x-0" : "-translate-x-full",
            )}
          >
            <div className="mb-[120px] flex items-center gap-5">
              <button
                type="button"
                className="inline-flex h-[30px] w-[38px] cursor-pointer flex-col justify-center gap-[5px] border-0 bg-transparent"
                aria-label="Close menu"
                onClick={closeMenu}
              >
                <span className="h-[2px] w-[26px] rounded-[2px] bg-[#bca066]" />
                <span className="h-[2px] w-[26px] rounded-[2px] bg-[#bca066]" />
                <span className="h-[2px] w-[26px] rounded-[2px] bg-[#bca066]" />
              </button>

              <div className="inline-flex items-center gap-3.5 text-[#bca066]">
                <span className="inline-flex h-[56px] w-[56px] items-center justify-center rounded-full border-[5px] border-[#bca066] font-serif text-[36px] leading-none font-semibold">
                  A
                </span>
                <span className="text-[52px] leading-none font-semibold tracking-[-0.02em]">
                  Aleet
                </span>
              </div>
            </div>

            <nav className="flex flex-col gap-10" aria-label="Main navigation">
              {items.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="group inline-flex items-center gap-6 text-[20px] leading-[1.1] font-semibold tracking-[-0.02em] text-white no-underline transition-colors duration-200 hover:text-[#bca066] sm:text-[18px]"
                  onClick={closeMenu}
                >
                  <item.icon className="h-[42px] w-[42px] shrink-0 text-white/45 transition-colors duration-200 group-hover:text-[#bca066]" />
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-auto pt-10">
              <button
                type="button"
                className="inline-flex h-[64px] w-full items-center justify-center rounded-[10px] border border-white bg-white px-6 text-[24px] font-semibold text-[#050d0c] transition-opacity duration-200 hover:opacity-90 sm:h-[60px] sm:text-[22px]"
                onClick={closeMenu}
              >
                Become a driver
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}

function IconBase({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

function CarIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M3 14h18" />
      <path d="M5 14V9.8a2 2 0 0 1 1.2-1.8l4.1-1.8a4 4 0 0 1 3.4 0L17.8 8A2 2 0 0 1 19 9.8V14" />
      <circle cx="7.5" cy="16.8" r="1.7" />
      <circle cx="16.5" cy="16.8" r="1.7" />
      <path d="M8.5 10.8h7" />
    </IconBase>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M4.5 12.2a7.2 7.2 0 1 0 2.6-5.6L4 9.8 4.5 12.2Z" />
      <path d="M9.2 8.8h5.6M8.3 12h4.3" />
    </IconBase>
  );
}

function TeamIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <circle cx="12" cy="8" r="2.4" />
      <circle cx="5.5" cy="9.8" r="2" />
      <circle cx="18.5" cy="9.8" r="2" />
      <path d="M8.8 18.2v-1.3A3.2 3.2 0 0 1 12 13.7a3.2 3.2 0 0 1 3.2 3.2v1.3" />
      <path d="M2.8 18v-1a2.7 2.7 0 0 1 2.7-2.7M21.2 18v-1a2.7 2.7 0 0 0-2.7-2.7" />
    </IconBase>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <circle cx="12" cy="8.2" r="3.2" />
      <path d="M5.6 18.6a6.4 6.4 0 0 1 12.8 0" />
    </IconBase>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="m12 7.6 1.3 2.7 3 .5-2.2 2.1.5 3-2.6-1.4-2.6 1.4.5-3-2.2-2.1 3-.5Z" />
    </IconBase>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M12 4.5 5.5 7v4.6c0 4.2 2.7 7 6.5 7.9 3.8-.9 6.5-3.7 6.5-7.9V7L12 4.5Z" />
      <rect x="9.4" y="11.2" width="5.2" height="4.1" rx="0.8" />
      <path d="M10.4 11.2v-1a1.6 1.6 0 1 1 3.2 0v1" />
    </IconBase>
  );
}

function ContactIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M7.2 5.6a1.8 1.8 0 0 1 2.3-.2L11 6.8a1.8 1.8 0 0 1 .4 2.2l-1 1.7a13 13 0 0 0 2.9 2.9l1.7-1a1.8 1.8 0 0 1 2.2.4l1.4 1.5a1.8 1.8 0 0 1-.2 2.3l-1 1c-.8.8-2 .9-3 .4a17.2 17.2 0 0 1-8.6-8.6c-.5-1-.4-2.2.4-3l1-1Z" />
      <path d="M13.8 7.8h5.2v4.4h-5.2z" />
    </IconBase>
  );
}
