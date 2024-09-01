"use client";

import * as React from "react";
import useSWR from "swr";
import {
  ChartBarIcon,
  HomeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

import { TabbedPage } from "@/components/tabbed-page";
import { useUser } from "@/lib/useUser";
import { fetchMegateamsApi } from "@/lib/api";

export default function HackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useUser();
  const { data: { team } = { team: null } } = useSWR(
    "/user/team",
    fetchMegateamsApi
  );

  const hasTeam = team !== null;

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
  ];

  return (
    <TabbedPage tabs={tabs} showTabs={hasTeam}>
      {children}
    </TabbedPage>
  );
}
