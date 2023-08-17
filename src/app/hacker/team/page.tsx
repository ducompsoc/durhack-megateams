"use client";

import { Fragment } from "react";
import TeamBox from "./TeamBox";
import { UserIcon } from "@heroicons/react/24/outline";

export default function Team() {
  const members = [
    { name: "Jony Ive", points: 10 },
    { name: "Steve Jobs", points: 20 },
    { name: "Tim Cook", points: 5 },
  ];

  return (
    <div className="flex flex-col h-full">
      <TeamBox grow={false} />
      <div className="mt-4 bg-gray-200 drop-shadow-lg p-2 rounded">
        <p className="font-semibold text-center">Team Members</p>
        <div className="grid grid-cols-[auto_auto] my-4 mx-4 gap-y-2 gap-x-2">
          {members.map(({ name, points }, i) => (
            <Fragment key={i}>
              <div className="flex items-center"><UserIcon className="w-4 h-4 mr-2" /><p>{name}</p></div>
              <p className="text-gray-600">{points} points</p>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
