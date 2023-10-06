"use client";

import React from "react";
import MegaChart from "./MegaChart";
import { getPositionMedal } from "@/app/lib/rankEmojis";
import useSWR from "swr";

export default function Leaderboard() {
  const { data: { teams } = { teams: null } } = useSWR("/teams");

  teams?.sort((a: any, b: any) => {
    return b.points - a.points;
  });

  return (
    <div className="flex flex-col h-full">
      <div className="dh-box p-2">
        <h2 className="font-semibold">Megateams Leaderboard</h2>
        <div className="bg-purple-200 border border-accent mt-2 rounded p-4 dark:bg-purple-500/30">
          <div className="md:w-[50%] md:ml-auto md:mr-auto">
            <MegaChart />
          </div>
        </div>
      </div>
      <div className="dh-box p-2 mt-6">
        <h2 className="font-semibold">Teams Leaderboard</h2>
        <div className="bg-purple-200 border border-accent mt-2 rounded p-4 dark:bg-purple-500/30">
          <div className="grid grid-cols-[auto_auto_auto] mx-2 gap-y-2 gap-x-4">
            <p className="font-semibold mb-2">Team</p>
            <p className="font-semibold mb-2">Total Points</p>
            <p className="font-semibold mb-2">Ranking</p>
            {teams?.map((team: any, i: number) => (
              <React.Fragment key={i}>
                <p>{team.name}</p>
                <p>{team.points} points</p>
                <div className="flex items-center font-mono justify-center md:justify-start">
                  <p>{getPositionMedal(i)}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
