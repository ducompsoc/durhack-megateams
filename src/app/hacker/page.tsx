import { TrophyIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React from "react";

export default function HackerHome() {
  const challenges = [
    { details: "Details of challenge 1", points: 2 },
    { details: "Details of challenge 2", points: 2 },
    { details: "Details of challenge 3", points: 4 },
  ];

  return (
    <div className="flex flex-col h-full font-semibold">
      <p>Hello Hacker_name,</p>
      <div className="flex mt-4">
        <div className="bg-gray-200 drop-shadow-lg p-2 text-center rounded grow mr-4">
          <h2 className="underline mb-2">Team</h2>
          <p>Team 1</p>
        </div>
        <div className="bg-gray-200 drop-shadow-lg p-2 text-center rounded grow">
          <h2 className="underline mb-2">Megateam</h2>
          <div className="flex items-center justify-center">
            <p className="text-[#0000a5] font-bold">Megateam 1</p>
            <Image src="/1.png" alt="Megateam 1 Logo" width={50} height={50} />
          </div>
        </div>
      </div>
      <div className="bg-gray-200 drop-shadow-lg p-2 text-center rounded flex mt-4">
        <div className="grow">
          <h2 className="underline mb-2">My Points</h2>
          <p>14</p>
        </div>
        <div className="grow px-4">
          <h2 className="underline mb-2">Team Points</h2>
          <div className="flex justify-center items-center">
            <p>8 (#1)</p>
            <TrophyIcon className="w-5 h-5 ml-2" />
          </div>
        </div>
        <div className="grow">
          <h2 className="underline mb-2">Megateam Points</h2>
          <p>6</p>
        </div>
      </div>
      <div className="bg-gray-200 drop-shadow-lg p-2 text-center rounded mt-4">
        <h2 className="underline mb-2">Challenges</h2>
        <div className="grid grid-cols-[min-content_1fr_auto] mx-2 gap-y-2">
          {challenges.map((challenge, i) => (
            <React.Fragment key={i}>
              <p className="mr-2">{i + 1}.</p>
              <p>{challenge.details}</p>
              <p>{challenge.points} points</p>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
