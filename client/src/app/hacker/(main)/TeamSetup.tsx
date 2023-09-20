import { fetchMegateamsApi } from "@/app/lib/api";
import useUser from "@/app/lib/useUser";
import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";

export default function TeamSetup() {
  const { user } = useUser();
  const [name, setName] = useState("");

  async function generateTeamName() {
    const { name } = await fetchMegateamsApi("/teams/generate-name");
    setName(name);
  }

  useEffect(() => {
    generateTeamName();
  }, []);

  return (
    <div className="flex flex-col h-full">
      <p>Hello {user?.preferred_name},</p>
      <div className="dh-box p-4 mt-4">
        <h2 className="font-semibold mb-2">Create Team</h2>
        <div className="my-2 flex items-center">
          <p>
            Name:
            <br />
            <em>{name}</em>
          </p>
          <span className="grow"></span>
          <button onClick={() => generateTeamName()}>
            <ArrowPathRoundedSquareIcon className="w-6 h-6" />
          </button>
        </div>
        <button className="dh-btn">Create</button>
      </div>
      <div className="dh-box p-4 mt-4">
        <h2 className="font-semibold">Join Team</h2>
        <p>
          <i>
            This is a 4 character code anyone on the team can view and share
            with you.
          </i>
        </p>
        <input
          type="text"
          className="dh-input w-full my-2"
          placeholder="Join code..."
        />
        <button className="dh-btn">Join</button>
      </div>
    </div>
  );
}
