"use client";

import {
  ChartBarIcon,
  CogIcon,
  HomeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import TabbedPage from "../components/TabbedPage";
import TeamSetup from "./TeamSetup";
import { useState } from "react";

export default function HackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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

  return hasTeam ? (
    <TabbedPage tabs={tabs}>{children}</TabbedPage>
  ) : (
    <TabbedPage tabs={tabs} showTabs={false}><TeamSetup /></TabbedPage>
  );
}
