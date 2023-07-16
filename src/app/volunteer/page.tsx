"use client";

import { Fragment, useState } from "react";

export default function Volunteer() {
  const [current, setCurrent] = useState("Preset");

  function getClasses(name: string) {
    let classes =
      "font-semibold pb-4 px-4 inline-flex items-center border-b-[3px] text-sm";
    if (name === current) {
      classes += " border-accent text-accent";
    } else {
      classes +=
        " border-gray-200 text-gray-500 hover:text-accent hover:border-accent";
    }
    return classes;
  }

  const tabs = [
    { name: "Preset", content: <p>Placeholder for preset...</p> },
    { name: "Custom", content: <p>Placeholder for custom...</p> },
  ];

  return (
    <>
      <div className="flex flex-col h-full">
        <nav className="flex justify-center">
          {tabs.map((tab) => (
            <button
              onClick={() => setCurrent(tab.name)}
              className={getClasses(tab.name)}
              key={tab.name}
            >
              {tab.name}
            </button>
          ))}
        </nav>
        <div className="mt-4">
          {tabs.map(
            (tab) =>
              tab.name === current && (
                <Fragment key={tab.name}>{tab.content}</Fragment>
              )
          )}
        </div>
      </div>
    </>
  );
}
