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

  const isAdmin = true;

  return (
    <div className="flex flex-col h-full">
      <div className="dh-box p-4 mb-6">
        <div className="flex flex-row items-center">
          <input
            type="text"
            className="dh-input w-full pl-10"
            placeholder="Search for users..."
          />
          <MagnifyingGlassIcon className="w-6 h-6 absolute ml-2" />
        </div>
      </div>
      {users.map(({ name, email, points, megateam, team }, i) => (
        <div className="dh-box p-4 mb-4" key={i}>
          <p className="mb-2">
            {name} - {email}
          </p>
          <p className="mb-2">
            {points} points | {megateam}
          </p>
          <Select
            className="mb-4 dh-select"
            options={teams}
            classNamePrefix="dh-select"
            menuPortalTarget={document.body}
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            defaultValue={teams.filter((val) => val.value === team)[0]}
          />
          {isAdmin && (
            <div className="flex items-center">
              <input
                type="number"
                className="dh-input w-20"
              />
              <p className="ml-2">points</p>
              <button className="ml-4 dh-btn">
                Add
              </button>
              <button className="ml-2 dh-btn">
                Remove
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
