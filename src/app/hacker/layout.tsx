"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  HomeIcon,
  ChartBarIcon,
  UserGroupIcon,
  CogIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function HackerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const path = usePathname();

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
    <div className="h-full flex flex-col text-black">
      <div className="flex flex-row py-4 px-6 items-center justify-center border-b border-black justify-evenly">
        <Image src="/logo.png" alt="DurHack Logo" width={64} height={64} />
        <h1 className="text-4xl font-bold">DurHack</h1>
        <Link href="/hacker">
          <ArrowRightOnRectangleIcon className="w-12 h-12" />
        </Link>
      </div>
      <div className="p-6 grow overflow-auto">{children}</div>
      <div className="flex">
        <span className="md:grow border border-black border-r-0 md:border-r"></span>
        {tabs.map((tab) => {
          const active = tab.path === path;

          return (
            <Link
              href={tab.path}
              key={tab.path}
              className={
                "w-full md:w-fit py-4 md:px-6 border border-black border-l-0 flex justify-center " +
                (active ? "bg-blue-200" : "bg-gray-200")
              }
            >
              {tab.icon}
            </Link>
          );
        })}
        <span className="md:grow border border-black border-l-0 border-r-0 md:border-r"></span>
      </div>
    </div>
  );
}
