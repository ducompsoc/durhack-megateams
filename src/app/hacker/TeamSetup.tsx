import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function TeamSetup() {
  // Need to do this server side in future for obvious reasons
  const names = ["MegaScarySquid", "BigFriendlyBear", "SmallSavvySerpent"];
  function generateTeamName() {
    return names[Math.floor(Math.random() * names.length)];
  }

  const [name, setName] = useState(names[0]);

  return (
    <div className="flex flex-col h-full">
      <p>Hello Hacker_name,</p>
      <div className="bg-gray-200 drop-shadow-lg p-4 rounded mt-4">
        <h2 className="font-semibold mb-2">Create Team</h2>
        <div className="my-2 flex items-center">
          <p>
            Name: <em>{name}</em>
          </p>
          <span className="grow"></span>
          <button onClick={() => setName(generateTeamName())}>
            <ArrowPathRoundedSquareIcon className="w-6 h-6" />
          </button>
        </div>
        <button className="rounded px-2 py-1 bg-accent text-white">
          Create
        </button>
      </div>
      <div className="bg-gray-200 drop-shadow-lg p-4 rounded mt-4">
        <h2 className="font-semibold">Join Team</h2>
        <input
          type="text"
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6 my-2"
          placeholder="Join code..."
        />
        <button className="rounded px-2 py-1 bg-accent text-white">Join</button>
      </div>
    </div>
  );
}
