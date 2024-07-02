"use client";

import {
  ChartBarIcon,
  NewspaperIcon,
  QrCodeIcon,
  ScaleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import TabbedPage from "../components/TabbedPage";
import useUser from "../lib/useUser";
import { redirect } from "next/navigation";

export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser({ redirectTo: "/" });
  if (isLoading) return <></>;
  if (!["volunteer", "sponsor", "admin"].includes(user?.role))
    return redirect("/");
  const isAdmin = user?.role === "admin";
  const isVolunteer = user?.role === "admin" || user?.role === "volunteer";

  const tabs = [
    { icon: QrCodeIcon, path: "/volunteer" },
    {
      icon: ChartBarIcon,
      path: "/volunteer/leaderboard",
    },
    ...(isVolunteer
      ? [
        {
          icon: UserGroupIcon,
            path: "/volunteer/teams",
          },
          ...(isAdmin
            ? [
                {
                  icon: NewspaperIcon,
                  path: "/volunteer/challenges",
                },
              ]
            : []),
          {
            icon: ScaleIcon,
            path: "/volunteer/admin",
          },
        ]
      : []),
  ];

  return <TabbedPage tabs={tabs}>{children}</TabbedPage>;
}
