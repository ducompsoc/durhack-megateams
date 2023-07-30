"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Select from "react-select";

export default function Admin() {
  const users = [
    {
      name: "Jonny Doe",
      email: "jondoe@gmail.com",
      points: 254,
      megateam: "Megateam 1",
      team: "Team 5",
    },
  ];

  const teams = [
    { value: "Team 1", label: "Team 1" },
    { value: "Team 2", label: "Team 2" },
    { value: "Team 3", label: "Team 3" },
    { value: "Team 4", label: "Team 4" },
    { value: "Team 5", label: "Team 5" },
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-200 drop-shadow-lg p-4 rounded mb-6">
        <div className="flex flex-row items-center">
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6 pl-10"
            placeholder="Search for users..."
          />
          <MagnifyingGlassIcon className="w-6 h-6 absolute ml-2" />
        </div>
      </div>
      {users.map(({ name, email, points, megateam, team }, i) => (
        <div className="bg-gray-200 drop-shadow-lg p-4 rounded mb-4" key={i}>
          <p className="mb-2">
            {name} - {email}
          </p>
          <p className="mb-2">
            {points} points | {megateam}
          </p>
          <Select
            className="mb-4"
            options={teams}
            defaultValue={teams.filter((val) => val.value === team)[0]}
          />
          <div className="flex items-center">
            <input
              type="number"
              className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6 w-20"
            />
            <p className="ml-2">points</p>
            <button className="ml-4 rounded px-2 py-1 bg-accent text-white">
              Add
            </button>
            <button className="ml-2 rounded px-2 py-1 bg-accent text-white">
              Remove
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
