"use client";

import {
  ChartBarIcon,
  CogIcon,
  HomeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import TabbedPage from "../components/TabbedPage";
import { useState } from "react";
import useUser from "../lib/useUser";
import { redirect } from "next/navigation";

export default function HackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser({ redirectTo: "/" });
  if (isLoading) return <></>;
  if (user?.role !== "hacker") return redirect("/");

  const tabs = [
    {
      icon: HomeIcon,
      path: "/hacker",
    },
    {
      icon: ChartBarIcon,
      path: "/hacker/leaderboard",
    },
    {
      icon: UserGroupIcon,
      path: "/hacker/team",
    },
    {
      icon: CogIcon,
      path: "https://durhack.com/",
      openNewWindow: true,
    },
  ];

  const [hasTeam] = useState(true);

  return (
    <TabbedPage tabs={tabs} showTabs={hasTeam}>
      {children}
    </TabbedPage>
  );
}
