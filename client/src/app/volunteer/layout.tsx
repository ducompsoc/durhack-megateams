"use client";

import {
  ChartBarIcon,
  NewspaperIcon,
  QrCodeIcon,
  ScaleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

import { TabbedPage } from "@/components/tabbed-page";
import { useUser } from "@/lib/useUser";
import { isAdmin as getIsAdmin, isVolunteer as getIsVolunteer } from "@/lib/is-role";
import { redirect } from "next/navigation";

export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();
  if (isLoading) return <></>;
  if (user == null) return redirect("/")

  const isAdmin = getIsAdmin(user)
  const isVolunteer = isAdmin || getIsVolunteer(user)
  if (!isAdmin && !isVolunteer) return redirect("/");

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
