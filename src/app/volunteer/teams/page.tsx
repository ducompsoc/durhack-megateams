"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Teams() {
  const teams = [
    {
      name: "Team 1",
      code: "1234",
      megateam: "Team Alpha",
    },
    {
      name: "Team 2",
      code: "5678",
      megateam: "Team Alpha",
    },
  ];

  const megateams = ["Team Alpha", "Team Beta", "IDK any more Greek"];

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-200 drop-shadow-lg p-4 rounded mb-6">
        <div className="flex flex-row items-center">
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6 pl-10"
            placeholder="Search for teams..."
          />
          <MagnifyingGlassIcon className="w-6 h-6 absolute ml-2" />
        </div>
      </div>
      {teams.map(({ name, code, megateam }) => (
        <div className="bg-gray-200 drop-shadow-lg p-4 rounded mb-4" key={code}>
          <div className="flex mb-2">
            <p>{name}</p>
            <p className="ml-2 text-gray-600">Join code: {code}</p>
          </div>
          <select className="by-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6">
            {megateams.map((megateam) => (
              <option key={megateam} value={megateam}>
                {megateam}
              </option>
            ))}
          </select>
          <button className="w-full rounded px-2 py-1 bg-accent text-white mt-2">
            Save
          </button>
        </div>
      ))}
    </div>
  );
}
