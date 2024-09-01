"use client";

import useSWR from "swr";
import { redirect } from "next/navigation";

import { useUser } from "@/lib/useUser";
import { fetchMegateamsApi } from "@/lib/api";
import { isHacker } from "@/lib/is-role";

export default function HackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading: userIsLoading } = useUser();
  const { isLoading: teamIsLoading } = useSWR("/user/team", fetchMegateamsApi);

  if (userIsLoading || teamIsLoading) return <></>;
  if (user == null || !isHacker(user)) return redirect("/");
  return children;
}
