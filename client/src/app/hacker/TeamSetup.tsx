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
      <div className="dh-box p-4 mt-4">
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
      <div className="dh-box p-4 mt-4">
        <h2 className="font-semibold">Join Team</h2>
        <p><i>This is a 4 character code anyone on the team can view and share with you.</i></p>
        <input
          type="text"
          className="dh-input w-full my-2"
          placeholder="Join code..."
        />
        <button className="rounded px-2 py-1 bg-accent text-white">Join</button>
      </div>
    </div>
  );
}
