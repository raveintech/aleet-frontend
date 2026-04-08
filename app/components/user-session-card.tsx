"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "./ui";
import { removeToken, getToken } from "@/lib/auth";
import { getProfile } from "@/lib/api/users";
import type { User } from "@/lib/api/auth";

export function UserSessionCard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }
    getProfile(token)
      .then((res) => setUser(res.data ?? null))
      .catch(() => {
        removeToken();
        router.push("/login");
      })
      .finally(() => setIsLoading(false));
  }, [router]);

  const handleLogout = () => {
    removeToken();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="rounded-xl border border-[#1e2b2c] bg-[rgba(8,19,18,0.62)] px-4 py-4">
        <div className="space-y-2">
          <div className="h-4 w-32 animate-pulse rounded bg-[#1e2b2c]" />
          <div className="h-3 w-48 animate-pulse rounded bg-[#1e2b2c]" />
          <div className="h-3 w-40 animate-pulse rounded bg-[#1e2b2c]" />
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="rounded-xl border border-[#1e2b2c] bg-[rgba(8,19,18,0.62)] px-4 py-4">
      <h3 className="text-[15px] font-semibold text-white">User data</h3>
      <dl className="mt-2 space-y-1.5 text-[13px]">
        <div className="flex items-start gap-2">
          <dt className="min-w-14.5 text-[#7f8687]">Name:</dt>
          <dd className="text-white">{user.name}</dd>
        </div>
        <div className="flex items-start gap-2">
          <dt className="min-w-14.5 text-[#7f8687]">Email:</dt>
          <dd className="break-all text-white">{user.email}</dd>
        </div>
        <div className="flex items-start gap-2">
          <dt className="min-w-14.5 text-[#7f8687]">Phone:</dt>
          <dd className="text-white">{user.phone}</dd>
        </div>
        <div className="flex items-start gap-2">
          <dt className="min-w-14.5 text-[#7f8687]">Role:</dt>
          <dd className="text-white capitalize">{user.role}</dd>
        </div>
      </dl>

      <Button
        type="button"
        variant="ghost"
        size="md"
        className="mt-3 h-9.5 text-[12px]"
        onClick={handleLogout}
      >
        Log out
      </Button>
    </div>
  );
}
