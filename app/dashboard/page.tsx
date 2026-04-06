import { cn } from "@/lib/utils";
import { AuthMenu } from "../components/auth-shell";
import { Button } from "../components/ui";
import { UserSessionCard } from "../components/user-session-card";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-page-bg px-5 pt-6 pb-10 text-white sm:px-10 sm:pt-12">
      <AuthMenu />

      <main className="mx-auto mt-8 w-full sm:mt-12">
        <div className="mb-4 grid gap-4 sm:max-w-[420px]">
          <UserSessionCard />
        </div>
        <section className="grid gap-4 lg:grid-cols-[92px_1fr]">
          {/* <aside className="rounded-xl border border-[#1e2b2c] bg-[rgba(8,19,18,0.62)] p-3">
            <nav className="flex gap-3 lg:flex-col" aria-label="Dashboard navigation">
              <SideItem label="Dashboard" active icon={<DashboardIcon className="h-5 w-5" />} />
              <SideItem label="Trip History" icon={<CarIcon className="h-5 w-5" />} />
              <SideItem label="Book Trip" icon={<CalendarIcon className="h-5 w-5" />} />
            </nav>
          </aside>

          <section className="space-y-4">
            <div className="rounded-2xl border border-[#1e2b2c] bg-[rgba(8,19,18,0.62)] px-6 py-7 sm:px-8">
              <h1 className="text-[34px] leading-[1.12] font-medium text-white sm:text-[44px]">
                Welcome Alex Thompson!
              </h1>
              <p className="mt-2 text-[15px] text-[#c7c7c7] sm:text-[18px]">
                Manage your trips and enjoy premium transportation services.
              </p>
              <Button className="mt-5 h-[42px] w-auto px-5 text-[15px] sm:text-[16px]" type="button">
                + Book New Trip
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <StatCard icon={<CalendarIcon className="h-7 w-7" />} value="2" label="Upcoming Trips" />
              <StatCard icon={<ClockIcon className="h-7 w-7" />} value="1" label="Active Trips" />
              <StatCard icon={<MarkerCarIcon className="h-7 w-7" />} value="5" label="Total Trips" />
            </div>

            <section className="rounded-2xl border border-[#1e2b2c] bg-[rgba(8,19,18,0.62)]">
              <header className="border-b border-[#1e2b2c] px-6 py-4">
                <h2 className="text-[24px] font-medium text-white">Upcoming (2)</h2>
              </header>

              <div className="grid gap-3 p-3 lg:grid-cols-2">
                <TripCard
                  date="Dec 15, 2025 at 9:00 AM"
                  badge="Upcoming"
                  meta="Trip starts in 2 days"
                  pickupTitle="Pickup"
                  pickupText="123 Business District, Downtown"
                  stopTitle="Stops (1)"
                  stopText="Coffee Shop on 5th St"
                  dropoffTitle="Drop-off"
                  dropoffText="Airport Terminal 1"
                  driver="Michael Johnson"
                  car="Mercedes S-Class"
                />
                <TripCard
                  date="Dec 18, 2025 at 2:30 PM"
                  badge="Upcoming"
                  meta="Trip starts in 5 days"
                  pickupTitle="Pickup"
                  pickupText="Home - 456 Oak Avenue"
                  stopTitle=""
                  stopText=""
                  dropoffTitle="Drop-off"
                  dropoffText="City Conference Center"
                  driver="Sarah Williams"
                  car="BMW 7 Series"
                />
              </div>
            </section>
          </section> */}
        </section>
      </main>
    </div>
  );
}

function SideItem({
  label,
  icon,
  active = false,
}: {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-lg border border-transparent px-2 py-2 text-center transition-colors lg:h-[86px]",
        active ? "text-[#bca066]" : "text-[#7f8687] hover:text-white",
      )}
    >
      {icon}
      <span className="text-[12px] leading-tight font-medium">{label}</span>
    </button>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
}) {
  return (
    <article className="flex items-center gap-3 rounded-xl border border-[#1e2b2c] bg-[rgba(8,19,18,0.62)] px-4 py-4">
      <span className="text-[#bca066]">{icon}</span>
      <div className="leading-tight">
        <p className="text-[34px] font-medium text-[#bca066]">{value}</p>
        <p className="text-[16px] font-semibold text-white">{label}</p>
      </div>
    </article>
  );
}

function TripCard({
  date,
  badge,
  meta,
  pickupTitle,
  pickupText,
  stopTitle,
  stopText,
  dropoffTitle,
  dropoffText,
  driver,
  car,
}: {
  date: string;
  badge: string;
  meta: string;
  pickupTitle: string;
  pickupText: string;
  stopTitle: string;
  stopText: string;
  dropoffTitle: string;
  dropoffText: string;
  driver: string;
  car: string;
}) {
  return (
    <article className="overflow-hidden rounded-2xl border border-[#1e2b2c] bg-[rgba(6,17,16,0.7)]">
      <div className="space-y-4 px-5 py-5">
        <div className="flex items-start justify-between gap-3">
          <p className="text-[14px] font-semibold text-white">{date}</p>
          <EditIcon className="h-4 w-4 text-[#7f8687]" />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#bca066] px-2.5 py-1 text-[11px] font-semibold text-[#252728]">
            {badge}
          </span>
          <span className="text-[12px] text-[#9ca3a4]">{meta}</span>
        </div>

        <TripPoint title={pickupTitle} text={pickupText} />
        {stopTitle ? <TripPoint title={stopTitle} text={stopText} /> : null}
        <TripPoint title={dropoffTitle} text={dropoffText} />
      </div>

      <footer className="flex items-center justify-between border-t border-[#1e2b2c] px-5 py-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(160deg,#d1d5db,#9ca3af)] text-[12px] font-semibold text-[#1f2937]">
            {driver
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)}
          </span>
          <div>
            <p className="text-[16px] font-medium text-[#bca066]">{driver}</p>
            <p className="text-[12px] text-[#d1d5db]">{car}</p>
            <p className="text-[11px] text-[#d1d5db]">★ 4.9</p>
          </div>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 text-[14px] font-medium text-white transition-colors hover:text-[#bca066]"
        >
          <PhoneIcon className="h-4 w-4" />
          Contact
        </button>
      </footer>
    </article>
  );
}

function TripPoint({ title, text }: { title: string; text: string }) {
  return (
    <div>
      <p className="text-[15px] font-semibold text-white">{title}</p>
      <p className="text-[12px] text-[#d1d5db]">{text}</p>
    </div>
  );
}

function IconBase({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

function DashboardIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <rect x="3" y="4" width="18" height="16" rx="2.5" />
      <path d="M7 9h10M7 13h6M16 13h1" />
    </IconBase>
  );
}

function CarIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M3 14h18" />
      <path d="M5 14V9.8a2 2 0 0 1 1.2-1.8l4.1-1.8a4 4 0 0 1 3.4 0L17.8 8A2 2 0 0 1 19 9.8V14" />
      <circle cx="7.5" cy="16.8" r="1.7" />
      <circle cx="16.5" cy="16.8" r="1.7" />
    </IconBase>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <rect x="3" y="5" width="18" height="16" rx="2.5" />
      <path d="M8 3.5v3M16 3.5v3M3 10h18M8 13h.01M12 13h.01M16 13h.01M8 17h.01M12 17h.01" />
    </IconBase>
  );
}

function ClockIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M12 22a10 10 0 1 1 10-10" />
      <path d="M12 7v5l3 2M19.5 4.5v4m-2-2h4" />
    </IconBase>
  );
}

function MarkerCarIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4Z" />
      <path d="M12 21c4.8-4.4 7-7.3 7-10.2" />
      <path d="M3 19h14m-12 0v-2.6a1.6 1.6 0 0 1 .9-1.4l3.2-1.4a3 3 0 0 1 2.4 0l3.2 1.4a1.6 1.6 0 0 1 .9 1.4V19M7.2 20.2h.01m6.6 0h.01" />
    </IconBase>
  );
}

function EditIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="m4 20 4.2-.8L20 7.4 16.6 4 4.8 15.8 4 20Z" />
      <path d="m14.8 5.8 3.4 3.4" />
    </IconBase>
  );
}

function PhoneIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path d="M7.2 5.6a1.8 1.8 0 0 1 2.3-.2L11 6.8a1.8 1.8 0 0 1 .4 2.2l-1 1.7a13 13 0 0 0 2.9 2.9l1.7-1a1.8 1.8 0 0 1 2.2.4l1.4 1.5a1.8 1.8 0 0 1-.2 2.3l-1 1c-.8.8-2 .9-3 .4a17.2 17.2 0 0 1-8.6-8.6c-.5-1-.4-2.2.4-3l1-1Z" />
    </IconBase>
  );
}
