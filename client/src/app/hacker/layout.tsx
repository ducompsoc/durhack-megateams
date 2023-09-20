"use client";

import {
  ChartBarIcon,
  CogIcon,
  HomeIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import TabbedPage from "@/app/components/TabbedPage";
import useUser from "@/app/lib/useUser";
import useSWR from "swr";
import { fetchMegateamsApi } from "../lib/api";

export default function HackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoading } = useUser({ redirectTo: "/" });
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
