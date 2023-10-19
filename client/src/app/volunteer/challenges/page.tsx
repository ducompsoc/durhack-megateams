"use client";

import { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import useUser from "@/app/lib/useUser";
import { redirect } from "next/navigation";
import useSWR from "swr";
import { useFormState } from "react-hooks-use-form-state";

export default function Challenges() {
  const { user, isLoading } = useUser({ redirectTo: "/volunteer" });
  const { data = { challenges: [] } } = useSWR<{ challenges: any[] }>(
    "/qr_codes/challenges"
  );

  const [animationParent] = useAutoAnimate();

  const [challenges, setChallenges] = useFormState(data.challenges);

  if (isLoading) return <></>;
  if (user?.role !== "admin") return redirect("/");

  function updatePosition(oldPos: number, newPos: number) {
    let newList = [...challenges];
    if (newPos > oldPos) {
      for (let challenge of newList) {
        if (challenge.rank === oldPos) {
          challenge.rank = newPos;
        } else if (
          challenge.rank > oldPos &&
          challenge.rank <= newPos
        ) {
          challenge.rank--;
        }
      }
    }
    if (newPos < oldPos) {
      for (let challenge of newList) {
        if (challenge.rank === oldPos) {
          challenge.rank = newPos;
        } else if (
          challenge.rank >= newPos &&
          challenge.rank < oldPos
        ) {
          challenge.rank++;
        }
      }
    }
    newList.sort((a, b) => a.rank - b.rank);
    setChallenges(newList);
  }

  return (
    <div className="flex flex-col h-full">
      <p className="font-bold text-center mb-4">Manage Challenge List</p>
      <ul ref={animationParent}>
        {challenges.map(({ title, points, rank, id }) => (
          <li className="dh-box p-4 mb-4" key={id} draggable>
            <p className="mb-2">{title}</p>
            <p className="mb-2">{points} points</p>
            <div className="flex items-center">
              <p>Position: </p>
              <select
                value={rank}
                onChange={(e) =>
                  updatePosition(rank, parseInt(e.target.value))
                }
                className="ml-2 dh-input"
              >
                {challenges.map(({ rank }) => (
                  <option key={rank} value={rank}>
                    {rank}
                  </option>
                ))}
              </select>
              <button className="ml-4 dh-btn">Unpublicise</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
