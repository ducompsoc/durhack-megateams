"use client";

import { TrophyIcon } from "@heroicons/react/24/outline";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import annotationPlugin, {
  AnnotationOptions,
} from "chartjs-plugin-annotation";
import { Options } from "chartjs-plugin-datalabels/types/options";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ChartDataLabels,
  annotationPlugin
);

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

  const megateams = [
    { id: 1, points: 450, name: "Team 1", image: new Image() },
    { id: 2, points: 500, name: "Team 2", image: new Image() },
    { id: 3, points: 400, name: "Team 3", image: new Image() },
    { id: 4, points: 200, name: "Team 4", image: new Image() },
  ];

  for (let team of megateams) {
    team.image.src = `/${team.id}.png`;
  }

  const dataset = {
    labels: megateams.map((team) => team.name),
    datasets: [
      {
        label: "Points",
        data: megateams.map((team) => team.points),
      },
    ],
  };

  const datalabels: Options = { anchor: "start", align: "end" };

  const options = {
    scales: { y: { display: false }, x: { grid: { display: false } } },
    plugins: {
      datalabels,
      annotation: {
        annotations: megateams.map((team, i) => {
          const options: AnnotationOptions = {
            type: "box",
            yMin: Math.max(team.points - 100, 200),
            yMax: Math.max(team.points - 100, 200),
            xMax: i,
            xMin: i,
            label: {
              display: true,
              content: team.image,
              width: 32,
              height: 32,
              position: "center",
            },
          };
          return options;
        }),
      },
    },
  };

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-200 drop-shadow-lg p-2 rounded">
        <h2 className="underline">Megateams Leaderboard</h2>
      </div>
      <div className="bg-purple-200 border border-purple-500 mt-4 rounded p-4">
        <div className="md:w-[50%] md:ml-auto md:mr-auto">
          <Bar data={dataset} options={options} />
        </div>
      </div>
      <div className="bg-gray-200 drop-shadow-lg p-2 rounded mt-4">
        <h2 className="underline">Teams Leaderboard</h2>
      </div>
      <div className="bg-purple-200 border border-purple-500 mt-4 rounded p-4">
        <div className="grid grid-cols-[auto_auto_auto] mx-2 gap-y-2 gap-x-4">
          <p className="underline">Team</p>
          <p className="underline">Total Points</p>
          <p className="underline">Ranking</p>
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
  );
}
