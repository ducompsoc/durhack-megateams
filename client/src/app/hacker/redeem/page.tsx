"use client";

import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function RedeemPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const qr_id = searchParams.get("qr_id");
    console.log(qr_id);
  }, [searchParams]);

  return (
    <div className="h-full flex flex-col items-center justify-center gap-y-12">
      <div className="mx-auto flex h-28 w-28 flex-shrink-0 items-center justify-center rounded-full bg-purple-100">
        <ArrowPathIcon
          className="h-12 w-12 text-accent animate-spin"
          aria-hidden="true"
        />
      </div>
      <p>Redeeming QR code...</p>
    </div>
  );
}
