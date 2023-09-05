"use client";

import React from "react";
import MegaChart from "./MegaChart";
import {positionMedals} from "@/app/constants";

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
      <div className="dh-box p-2">
        <h2 className="font-semibold">Megateams Leaderboard</h2>
        <div className="bg-purple-200 border border-purple-500 mt-2 rounded p-4">
          <div className="md:w-[50%] md:ml-auto md:mr-auto">
            <MegaChart />
          </div>
        </div>
      </div>
      <div className="dh-box p-2 mt-6">
        <h2 className="font-semibold">Teams Leaderboard</h2>
        <div className="bg-purple-200 border border-purple-500 mt-2 rounded p-4">
          <div className="grid grid-cols-[auto_auto_auto] mx-2 gap-y-2 gap-x-4 text-black">
            <p className="font-semibold mb-2">Team</p>
            <p className="font-semibold mb-2">Total Points</p>
            <p className="font-semibold mb-2">Ranking</p>
            {teams.map((team, i) => (
              <React.Fragment key={i}>
                <p>{team.name}</p>
                <p>{team.points} points</p>
                <div className="flex items-center font-mono justify-center md:justify-start">
                  <p>{i < 3 ? positionMedals[i+1] : "#" + (i+1)}</p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
