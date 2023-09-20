"use client";

import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import useUser from "@/app/lib/useUser";
import { redirect } from "next/navigation";

export default function Challenges() {
  const { user, isLoading } = useUser({ redirectTo: "/volunteer" });
  if (isLoading) return <></>;
  if (user?.role !== "admin") return redirect("/");

  const [animationParent] = useAutoAnimate();

  const [challenges, setChallenges] = useState([
    {
      name: "Attend Amazon Workshop",
      points: 10,
      position: 1,
      id: 1,
    },
    {
      name: "Attend THG Workshop",
      points: 10,
      position: 2,
      id: 2,
    },
    {
      name: "Attend Netcraft Workshop",
      points: 10,
      position: 3,
      id: 3,
    },
    {
      name: "Attend Waterstons Workshop",
      points: 10,
      position: 4,
      id: 4,
    },
  ]);

  function updatePosition(oldPos: number, newPos: number) {
    let newList = [...challenges];
    if (newPos > oldPos) {
      for (let challenge of newList) {
        if (challenge.position === oldPos) {
          challenge.position = newPos;
        } else if (
          challenge.position > oldPos &&
          challenge.position <= newPos
        ) {
          challenge.position--;
        }
      }
    }
    if (newPos < oldPos) {
      for (let challenge of newList) {
        if (challenge.position === oldPos) {
          challenge.position = newPos;
        } else if (
          challenge.position >= newPos &&
          challenge.position < oldPos
        ) {
          challenge.position++;
        }
      }
    }
    newList.sort((a, b) => a.position - b.position);
    setChallenges(newList);
  }

  return (
    <div className="flex flex-col h-full">
      <p className="font-bold text-center mb-4">Manage Challenge List</p>
      <ul ref={animationParent}>
        {challenges.map(({ name, points, position, id }) => (
          <li className="dh-box p-4 mb-4" key={id} draggable>
            <p className="mb-2">{name}</p>
            <p className="mb-2">{points} points</p>
            <div className="flex items-center">
              <p>Position: </p>
              <select
                value={position}
                onChange={(e) =>
                  updatePosition(position, parseInt(e.target.value))
                }
                className="ml-2 dh-input"
              >
                {challenges.map(({ position }) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
              <button className="ml-4 dh-btn">
                Unpublicise
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
