"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Select from "react-select";

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
      megateam: "Team Beta",
    },
  ];

  const megateams = [
    {
      name: "Team Alpha",
      areas: [
        { label: "Table 1", value: "Table 1" },
        { label: "Table 2", value: "Table 2" },
        { label: "Table 3", value: "Table 3" },
      ],
    },
    {
      name: "Team Beta",
      areas: [
        { label: "Table 4", value: "Table 4" },
        { label: "Table 5", value: "Table 5" },
        { label: "Table 6", value: "Table 6" },
      ],
    },
    {
      name: "IDK any more Greek",
      areas: [
        { label: "Table 7", value: "Table 7" },
        { label: "Table 8", value: "Table 8" },
        { label: "Table 9", value: "Table 9" },
      ],
    },
  ];

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
          <select className="by-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6" value={megateam}>
            {megateams.map(({ name }) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <Select
            options={megateams.filter(({name}) => name === megateam)[0].areas}
            className="mt-2"
            menuPortalTarget={document.body} 
            styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
          />
          <button className="w-full rounded px-2 py-1 bg-accent text-white mt-2">
            Save
          </button>
        </div>
      ))}
    </div>
  );
}
