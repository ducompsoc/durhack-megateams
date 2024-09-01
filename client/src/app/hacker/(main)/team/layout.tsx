"use client";

import * as React from "react"
import useSWR from "swr";
import { redirect } from "next/navigation";

import { fetchMegateamsApi } from "@/lib/api";

export default function HackerTeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: { team }, isLoading: teamIsLoading } = useSWR("/user/team", fetchMegateamsApi);

  if (teamIsLoading) return <></>;
  if (team == null) return redirect("/hacker");
  return children;
}
