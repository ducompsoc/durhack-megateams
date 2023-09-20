"use client";

import useUser from "@/app/lib/useUser";
import { redirect, usePathname } from "next/navigation";

export default function HackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser({ redirectTo: "/" });
  const pathname = usePathname();

  if (isLoading) return <></>;
  if (user?.role !== "hacker") return redirect("/");
  if (user?.team_id === null && pathname !== "/hacker") return redirect("/hacker");

  return children;
}
