"use client";

import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function Challenges() {
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
          <li
            className="bg-gray-200 drop-shadow-lg p-4 rounded mb-4"
            key={id}
            draggable
          >
            <p className="mb-2">{name}</p>
            <p className="mb-2">{points} points</p>
            <div className="flex items-center">
              <p>Position: </p>
              <select
                value={position}
                onChange={(e) =>
                  updatePosition(position, parseInt(e.target.value))
                }
                className="ml-2 block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
              >
                {challenges.map(({ position }) => (
                  <option key={position} value={position}>
                    {position}
                  </option>
                ))}
              </select>
              <button className="ml-4 rounded px-2 py-1 bg-accent text-white">
                Unpublicise
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
