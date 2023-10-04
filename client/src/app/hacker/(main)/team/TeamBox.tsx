import { ShareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import useSWR from "swr";

export default function TeamBox({ grow = true }: { grow?: boolean }) {
  const [showTeamCode, setShowTeamCode] = useState(false);
  const { data: { team } = { team: null } } = useSWR("/user/team");

  function TeamName(props: { className: string }) {
    const capitals = team?.name.match(/([A-Z])/g);
    const split = team?.name.split(/[A-Z]/);
    split?.shift();

    return (
      <div className={"flex flex-wrap justify-center pb-2 " + props.className}>
        {split?.map((text: string, i: number) => (
          <p>{capitals[i] + text}</p>
        ))}
      </div>
    );
  }

  function toggleTeamCode() {
    setShowTeamCode(!showTeamCode);
  }

  return (
    <div
      className={`dh-box p-2 text-center md:min-w-[50%] min-w-[40%] ${
        grow ? "grow basis-0" : ""
      }`}
    >
      <h2 className="font-semibold mb-2">Team</h2>
      <div className="relative">
        <TeamName className={showTeamCode ? "invisible" : "visible"} />
        <p
          className={
            (showTeamCode ? "visible" : "invisible") +
            " absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:top-0 md:translate-y-0"
          }
        >
          {team?.join_code}
        </p>
      </div>
      <div className="flex items-center">
        <span className="grow"></span>
        {showTeamCode ? (
          <XMarkIcon onClick={toggleTeamCode} className="w-6 h-6" />
        ) : (
          <ShareIcon onClick={toggleTeamCode} className="w-6 h-6" />
        )}
      </div>
    </div>
  );
}
