"use client";

import useUser from "@/app/lib/useUser";
import { redirect } from "next/navigation";

export default function HackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser({ redirectTo: "/" });

  if (isLoading) return <></>;
  if (user?.role !== "hacker") return redirect("/");

  return children;
}
