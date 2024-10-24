"use client";

import { redirect } from "next/navigation";

import { isHacker } from "@/lib/is-role";
import { useMegateamsContext } from "@/hooks/use-megateams-context";

export default function HackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, userIsLoading, teamIsLoading } = useMegateamsContext();

  if (userIsLoading || teamIsLoading) return <></>;
  if (user == null || !isHacker(user)) return redirect("/");
  return children;
}
