"use client";

import { fetchMegateamsApi } from "@/app/lib/api";
import useUser from "@/app/lib/useUser";
import {
  ArrowPathIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function RedeemPage() {
  const [qrPoints, setQrPoints] = useState<number | null>(null);
  const [qrChecked, setQrChecked] = useState(false);
  const searchParams = useSearchParams();
  const { user, isLoading } = useUser();

  if (!isLoading && user?.role !== "hacker") {
    if (qrChecked) {
      return redirect("/");
    } else {
      return redirect(
        "/api/auth/durhack-live?referrer=" +
          encodeURIComponent(
            "/hacker/redeem?qr_id=" +
              encodeURIComponent(searchParams.get("qr_id") ?? "")
          )
      );
    }
  }

  async function tryRedeemQR() {
    const uuid = searchParams.get("qr_id");
    if (uuid && uuid !== "invalid") {
      try {
        const result = await fetchMegateamsApi("/qr_codes/redeem", {
          method: "POST",
          body: JSON.stringify({ uuid }),
          headers: { "Content-Type": "application/json" },
        });
        setQrPoints(result.points);
      } catch {
        setQrChecked(true);
      }
    }
    setQrChecked(true);
  }

  useEffect(() => {
    tryRedeemQR();
  }, [searchParams]);

  function RedeemContainer({ children }: { children: ReactNode }) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-y-10 text-center">
        {children}
      </div>
    );
  }

  function RedeemSuccess() {
    return (
      <RedeemContainer>
        <div className="mx-auto flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
          <CheckIcon className="h-12 w-12 text-green-500" aria-hidden="true" />
        </div>
        <p className="text-lg">QR Redeemed Successfully!</p>
        <p>
          You've gained
          <span className="font-bold">
            {" " + qrPoints + (qrPoints ?? 0 > 1 ? " points " : " point ")}
          </span>
          for your team!
        </p>
        <Link href="/hacker" className="dh-btn">
          Return Home
        </Link>
      </RedeemContainer>
    );
  }

  function RedeemFailure() {
    return (
      <RedeemContainer>
        <div className="mx-auto flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
          <XMarkIcon className="h-12 w-12 text-red-600" aria-hidden="true" />
        </div>
        <p className="text-lg">QR Failed to Redeem</p>
        <p>Please speak to a volunteer if you believe this is in error.</p>
        <Link href="/hacker" className="dh-btn">
          Return Home
        </Link>
      </RedeemContainer>
    );
  }

  function RedeemPending() {
    return (
      <RedeemContainer>
        <div className="mx-auto flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
          <ArrowPathIcon
            className="h-12 w-12 text-accent animate-spin"
            aria-hidden="true"
          />
        </div>
        <p>Redeeming QR code...</p>
      </RedeemContainer>
    );
  }

  if (!qrChecked) return <RedeemPending />
  
  if (!qrPoints) return <RedeemFailure />
  
  return <RedeemSuccess />
}
