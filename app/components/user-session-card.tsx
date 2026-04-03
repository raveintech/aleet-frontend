"use client";

import { useRouter } from "next/navigation";
import { Button } from "./ui";
import { removeToken } from "@/lib/auth";

type UserSessionCardProps = {
  name: string;
  email: string;
  phone: string;
};

export function UserSessionCard({ name, email, phone }: UserSessionCardProps) {
  const router = useRouter();

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  return (
    <div className="rounded-xl border border-[#1e2b2c] bg-[rgba(8,19,18,0.62)] px-4 py-4">
      <h3 className="text-[15px] font-semibold text-white">User data (test)</h3>
      <dl className="mt-2 space-y-1.5 text-[13px]">
        <div className="flex items-start gap-2">
          <dt className="min-w-[58px] text-[#7f8687]">Name:</dt>
          <dd className="text-white">{name}</dd>
        </div>
        <div className="flex items-start gap-2">
          <dt className="min-w-[58px] text-[#7f8687]">Email:</dt>
          <dd className="break-all text-white">{email}</dd>
        </div>
        <div className="flex items-start gap-2">
          <dt className="min-w-[58px] text-[#7f8687]">Phone:</dt>
          <dd className="text-white">{phone}</dd>
        </div>
      </dl>

      <Button
        type="button"
        variant="ghost"
        size="md"
        className="mt-3 h-[38px] text-[12px]"
        onClick={handleLogout}
      >
        Log out
      </Button>
    </div>
  );
}
