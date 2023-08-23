"use client";

import {
  ChartBarIcon,
  NewspaperIcon,
  QrCodeIcon,
  ScaleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import TabbedPage from "../components/TabbedPage";
import { useState } from "react";

export default function VolunteerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAdmin] = useState(true);

  const tabs = [
    { icon: QrCodeIcon, path: "/volunteer" },
    {
      icon: ChartBarIcon,
      path: "/volunteer/leaderboard",
    },
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
  ];

  return <TabbedPage tabs={tabs}>{children}</TabbedPage>;
}
