"use client";

import {
  ChartBarIcon,
  CogIcon,
  HomeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import TabbedPage from "@/app/components/TabbedPage";
import { useState } from "react";
import useUser from "@/app/lib/useUser";

export default function HackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser({ redirectTo: "/" });
  const [hasTeam] = useState(true);

  if (isLoading) return <></>;

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

  return (
    <TabbedPage tabs={tabs} showTabs={hasTeam}>
      {children}
    </TabbedPage>
  );
}
