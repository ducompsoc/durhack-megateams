"use client";

import {
  QrCodeIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";
import React, { Fragment, useState } from "react";
import dynamic from "next/dynamic";
import { Dialog, Transition } from "@headlessui/react";
import { positionMedals } from "@/app/constants";
import TeamBox from "./team/TeamBox";
import TeamSetup from "./TeamSetup";
import { useRouter } from "next/navigation";
const Scanner = dynamic(() => import("qrcode-scanner-react"), {
  ssr: false,
});

export default function HackerHome() {
  const [scanning, setScanning] = useState(false);
  const router = useRouter();

  function scanSuccess(result: string) {
    let qr_id;
    try {
      const url = new URL(result);
      qr_id =
        window.location.origin === url.origin
          ? url.searchParams.get("qr_id") ?? "invalid"
          : "invalid";
    } catch {
      qr_id = "invalid";
    }
    router.push("/hacker/redeem?" + new URLSearchParams({ qr_id }).toString());
  }

  const challenges = [
    { details: "Details of challenge 1", points: 2 },
    { details: "Details of challenge 2", points: 2 },
    { details: "Details of challenge 3", points: 4 },
  ];

  const hasMegateam = true;
  const hasTeam = true;

  return (
    <>
      {hasTeam ? (
        <div className="flex flex-col h-full">
          <p>Hello Hacker_name,</p>
          <div className="flex mt-4">
            <TeamBox />
            {hasMegateam && (
              <div className="dh-box p-2 text-center grow ml-4">
                <h2 className="font-semibold mb-2">Megateam</h2>
                <div className="flex items-center justify-center">
                  <p className="text-[#0000a5] font-bold">Megateam 1</p>
                  <Image
                    src="/1.png"
                    alt="Megateam 1 Logo"
                    width={50}
                    height={50}
                  />
                </div>
              </div>
            )}
          </div>
          {hasMegateam ? (
            <>
              <div className="dh-box p-2 text-center flex mt-4">
                <div className="grow">
                  <h2 className="font-semibold mb-2">My Points</h2>
                  <p>14 {positionMedals[2]}</p>
                </div>
                <div className="grow px-4">
                  <h2 className="font-semibold mb-2">Team Points</h2>
                  <div className="flex justify-center items-center">
                    <p>8 (#5)</p>
                  </div>
                </div>
                <div className="grow">
                  <h2 className="font-semibold mb-2">Megateam Points</h2>
                  <p>6 {positionMedals[1]}</p>
                </div>
              </div>
              <div className="dh-box p-2 text-center mt-4">
                <h2 className="font-semibold mb-2">Challenges</h2>
                <div className="grid grid-cols-[min-content_1fr_auto] mx-2 gap-y-2">
                  {challenges.map((challenge, i) => (
                    <React.Fragment key={i}>
                      <p className="mr-2">{i + 1}.</p>
                      <p>{challenge.details}</p>
                      <p>{challenge.points} points</p>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="dh-box p-4 text-center flex flex-col items-center mt-4">
              <p className="flex items-center font-semibold mb-2">
                <ExclamationTriangleIcon className="w-6 h-6 mr-2" />
                No Megateam Assigned
              </p>
              <p>
                Please speak to a volunteer to ensure your team&apos;s points
                are recorded!
              </p>
            </div>
          )}
        </div>
      ) : (
        <TeamSetup />
      )}
      <button
        onClick={() => setScanning(true)}
        className="fixed bottom-14 right-6 bg-accent p-3 rounded-full"
      >
        <QrCodeIcon className="w-10 h-10" />
      </button>
      <Transition.Root show={scanning} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setScanning}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex min-h-full justify-center p-4 text-center items-center sm:p-0">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                  <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                    <Scanner
                      scanning={scanning}
                      scanSuccess={scanSuccess}
                      className="h-96"
                    />
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setScanning(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
}