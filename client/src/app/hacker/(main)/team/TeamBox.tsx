import { fetchMegateamsApi } from "@/app/lib/api";
import { ShareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import useSWR from "swr";

export default function TeamBox({ grow = true }: { grow?: boolean }) {
  const [showTeamCode, setShowTeamCode] = useState(false);
  const { data: { team } = { team: null } } = useSWR("/user/team");

  return (
    <div
      className={`dh-box p-2 text-center md:min-w-[50%] min-w-[40%] ${
        grow ? "grow" : ""
      }`}
    >
      <h2 className="font-semibold mb-2">Team</h2>
      {!showTeamCode ? (
        <>
          <p>{team?.name}</p>
          <div className="flex items-center">
            <span className="grow"></span>
            <ShareIcon
              onClick={() => setShowTeamCode(true)}
              className="w-6 h-6"
            />
          </div>
        </>
      ) : (
        <>
          <p>{team?.join_code}</p>
          <div className="flex items-center">
            <span className="grow"></span>
            <XMarkIcon
              onClick={() => setShowTeamCode(false)}
              className="w-6 h-6"
            />
          </div>
        </>
      )}
    </div>
  );
}
