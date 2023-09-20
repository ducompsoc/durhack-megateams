"use client";

import dynamic from "next/dynamic";

const Leaderboard = dynamic(
  () => import("@/app/components/leaderboard/Leaderboard"),
  {
    ssr: false,
  }
);

export default function LeaderboardPage() {
  return <Leaderboard />;
}
