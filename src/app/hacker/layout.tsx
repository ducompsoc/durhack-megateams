"use client";

import { ChartBarIcon, CogIcon, HomeIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import TabbedPage from "../components/TabbedPage";

export default function HackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const tabs = [
    { icon: <HomeIcon className="w-10 h-10" />, path: "/hacker" },
    {
      icon: <ChartBarIcon className="w-10 h-10" />,
      path: "/hacker/leaderboard",
    },
    {
      icon: <UserGroupIcon className="w-10 h-10" />,
      path: "/hacker/team",
    },
    { icon: <CogIcon className="w-10 h-10" />, path: "/hacker/settings" },
  ];

  return (
    <TabbedPage tabs={tabs} children={children} />
  );
}
