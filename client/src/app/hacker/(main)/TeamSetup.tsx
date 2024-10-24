import { fetchMegateamsApi } from "@/app/lib/api";
import useUser from "@/app/lib/useUser";
import { ArrowPathRoundedSquareIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import { mutate } from "swr";

export default function TeamSetup() {
  const { user } = useUser();
  const [name, setName] = useState("");
  const [createError, setCreateError] = useState("");
  const [joinError, setJoinError] = useState("");
  const [joinCode, setJoinCode] = useState("");

  async function generateTeamName() {
    try {
      const { name } = await fetchMegateamsApi("/teams/generate-name");
      setName(name);
      setCreateError("");
    } catch {
      setCreateError("Failed to generate team name!");
    }
  }

  async function joinTeam() {
    try {
      await fetchMegateamsApi("/user/team", {
        method: "POST",
        body: JSON.stringify({ join_code: joinCode }),
        headers: { "Content-Type": "application/json" },
      });
      setJoinError("");
      mutate("/user/team", { team: true });
    } catch {
      setJoinError("Failed to join team!");
    }
  }

  async function createTeam() {
    try {
      await fetchMegateamsApi("/teams", { method: "POST" });
      setCreateError("");
      mutate("/user/team", { team: true });
    } catch {
      setCreateError("Failed to create team!");
    }
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
        <button className="dh-btn" onClick={createTeam}>
          Create
        </button>
        {createError && <p className="dh-err">{createError}</p>}
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
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
        />
        <button className="dh-btn" onClick={joinTeam}>
          Join
        </button>
        {joinError && <p className="dh-err">{joinError}</p>}
      </div>
    </div>
  );
}
