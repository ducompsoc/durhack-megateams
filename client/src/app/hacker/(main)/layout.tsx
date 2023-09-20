"use client";

import { fetchMegateamsApi } from "@/app/lib/api";
import useUser from "@/app/lib/useUser";
import { redirect, usePathname } from "next/navigation";
import useSWR from "swr";

export default function HackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser({ redirectTo: "/" });
  const { data: { team } = { team: null } } = useSWR("/user/team");
  const pathname = usePathname();

  if (isLoading) return <></>;
  if (user?.role !== "hacker") return redirect("/");
  if (team === null && pathname !== "/hacker") return redirect("/hacker");

  return children;
}
