"use client";

import { TrophyIcon } from "@heroicons/react/24/outline";
import React from "react";
import MegaChart from "./MegaChart";

export default function Leaderboard() {
  const teams = [
    { name: "Team 4", points: 140 },
    { name: "Team 8", points: 132 },
    { name: "Team 1", points: 124 },
    { name: "Team 2", points: 120 },
    { name: "Team 5", points: 100 },
    { name: "Team 6", points: 93 },
    { name: "Team 7", points: 84 },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-200 drop-shadow-lg p-2 rounded">
        <h2 className="font-semibold">Megateams Leaderboard</h2>
        <div className="bg-purple-200 border border-purple-500 mt-2 rounded p-4">
          <div className="md:w-[50%] md:ml-auto md:mr-auto">
            <MegaChart />
          </div>
        </div>
      </div>
      <div className="bg-gray-200 drop-shadow-lg p-2 rounded mt-6">
        <h2 className="font-semibold">Teams Leaderboard</h2>
        <div className="bg-purple-200 border border-purple-500 mt-2 rounded p-4">
          <div className="grid grid-cols-[auto_auto_auto] mx-2 gap-y-2 gap-x-4">
            <p className="font-semibold">Team</p>
            <p className="font-semibold">Total Points</p>
            <p className="font-semibold">Ranking</p>
            {teams.map((team, i) => (
              <React.Fragment key={i}>
                <p className={i === 0 ? "mt-2" : ""}>{team.name}</p>
                <p className={i === 0 ? "mt-2" : ""}>{team.points} points</p>
                <div className={"flex items-center " + (i === 0 ? "mt-2" : "")}>
                  <p>#{i + 1}</p>
                  {i < 3 && <TrophyIcon className="w-5 h-5 ml-2" />}
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
