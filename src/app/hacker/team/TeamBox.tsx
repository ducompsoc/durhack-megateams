import { ShareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function TeamBox({ grow=true }: { grow?: boolean }) {
  const [showTeamCode, setShowTeamCode] = useState(false);

  return (
    <div
      className={`bg-gray-200 drop-shadow-lg p-2 text-center rounded md:min-w-[50%] min-w-[40%] ${
        grow ? "grow" : ""
      }`}
    >
      <h2 className="font-semibold mb-2">Team</h2>
      {!showTeamCode ? (
        <>
          <p>Team 1</p>
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
          <p>1234</p>
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
