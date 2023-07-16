"use client";

import {
  ChartBarIcon,
  NewspaperIcon,
  QrCodeIcon,
  ScaleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import TabbedPage from "../components/TabbedPage";

export default function HackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = true;

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
            path: "/volunteer/admin/challenges",
          },
          {
            icon: <ScaleIcon className="w-10 h-10" />,
            path: "/volunteer/admin/points",
          },
        ]
      : []),
  ];

  return <TabbedPage tabs={tabs} children={children} />;
}
