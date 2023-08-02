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
    { icon: <QrCodeIcon className="w-10 h-10" />, path: "/volunteer" },
    {
      icon: <ChartBarIcon className="w-10 h-10" />,
      path: "/volunteer/leaderboard",
    },
    {
      icon: <UserGroupIcon className="w-10 h-10" />,
      path: "/volunteer/teams",
    },
    ...(isAdmin
      ? [
          {
            icon: <NewspaperIcon className="w-10 h-10" />,
            path: "/volunteer/challenges",
          },
        ]
      : []),
    {
      icon: <ScaleIcon className="w-10 h-10" />,
      path: "/volunteer/admin",
    },
  ];

  return <TabbedPage tabs={tabs}>{children}</TabbedPage>;
}
