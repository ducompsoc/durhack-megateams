"use client";

import useUser from "@/app/lib/useUser";
import { redirect, usePathname } from "next/navigation";
import useSWR from "swr";

export default function HackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading: userIsLoading } = useUser({ redirectTo: "/" });
  const { data: { team } = { team: null }, isLoading: teamIsLoading } =
    useSWR("/user/team");
  const pathname = usePathname();

  if (userIsLoading || teamIsLoading) return <></>;
  if (user?.role !== "hacker") return redirect("/");
  if (team === null && pathname !== "/hacker") return redirect("/hacker");

  return children;
}
