"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Select from "react-select";

export default function TeamsPage() {
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
      <div className="dh-box p-4 mb-6">
        <div className="flex flex-row items-center">
          <input
            type="text"
            className="dh-input w-full pl-10"
            placeholder="Search for teams..."
          />
          <MagnifyingGlassIcon className="w-6 h-6 absolute ml-2" />
        </div>
      </div>
      {teams.map(({ name, code, megateam }) => (
        <div className="dh-box p-4 mb-4" key={code}>
          <div className="flex mb-2">
            <p>{name}</p>
            <p className="ml-2 text-gray-600 dark:text-neutral-400">Join code: {code}</p>
          </div>
          <select
            className="by-2 dh-input w-full"
            value={megateam}
          >
            {megateams.map(({ name }) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <Select
            options={megateams.filter(({ name }) => name === megateam)[0].areas}
            className="mt-2 dh-select"
            classNamePrefix="dh-select"
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
          />
          <div className="md:flex md:justify-end">
            <button className="w-full rounded px-2 py-1 bg-accent text-white mt-2 md:w-fit">
              Save
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
