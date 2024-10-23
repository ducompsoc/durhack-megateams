"use client";

import useSWR from "swr";
import * as React from "react";

export function QuestList() {
  const { data: { quests } = { quests: [] } } = useSWR("/quests");

  return (
    <div className="grow overflow-y-auto flex flex-col gap-2 px-2">
      {quests.length === 0 ? (
        <p className="text-center dh-box p-2">No quests have been published yet. Check back soon!</p>
      ) : (
        // TODO: add quests list
        "Quests go here..."
      )}
    </div>
  );
}
