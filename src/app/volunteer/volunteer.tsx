"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { exportComponentAsJPEG } from "react-component-export-image";
import { ClockIcon } from "@heroicons/react/24/outline";
import presets from "./QR_presets.json";

export default function Volunteer() {
  const [current, setCurrent] = useState("Preset");
  const [open, setOpen] = useState(false);
  const [qr, setQR] = useState({
    name: "",
    uuid: "",
    category: "",
    preset: false,
  });
  const renderedQR = useRef(null);

  const isAdmin = true;

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

  async function downloadQR() {
    const date = new Date();
    const [year, month, day, hour, minutes, seconds] = [
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    ].map((num) => num.toString().padStart(2, "0"));
    const datetimeString = `${year}${month}${day}_${hour}${minutes}${seconds}`;

    await exportComponentAsJPEG(renderedQR, {
      fileName: qr.preset
        ? `${qr.name}_PRESET_${datetimeString}.jpg`
        : `${qr.name}_${qr.category}_${datetimeString}.jpg`,
    });
  }

  function generate(name: string, uuid: string) {
    setQR({ name, uuid, category: "", preset: true });
    setOpen(true);
  }

  function resetDate() {
    let now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  }

  const [selected, setSelected] = useState(presets[0]);

  const qrTypes = ["Workshop", "Hacker", "Volunteer", "Sponsor"];

  const tabs = [
    {
      name: "Preset",
      content: (
        <div className="bg-gray-200 drop-shadow-lg p-4 rounded">
          <select
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
            onChange={(e) =>
              setSelected(
                presets.filter(({ name }) => name === e.target.value)[0]
              )
            }
            value={selected.name}
          >
            {presets.map((preset) => (
              <option key={preset.name} value={preset.name}>
                {preset.name}
              </option>
            ))}
          </select>
          <p className="my-2">{selected.description}</p>
          <button
            className="rounded px-2 py-1 bg-accent text-white"
            onClick={() => generate(selected.name, selected.uuid)}
          >
            Generate
          </button>
        </div>
      ),
    },
    {
      name: "Custom",
      content: (
        <div className="bg-gray-200 drop-shadow-lg p-4 rounded">
          <p className="font-semibold mb-2">Generate Custom QR</p>
          <input
            type="text"
            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
            placeholder="Name..."
          />
          <select className="my-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6">
            {qrTypes.map((qrType) => (
              <option key={qrType} value={qrType}>
                {qrType}
              </option>
            ))}
          </select>
          <div className="flex items-center">
            <input
              type="number"
              className="my-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
            />
            <p className="ml-1 mr-2">points</p>
            <input
              type="number"
              className="my-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
            />
            <p className="ml-1 mr-2">uses</p>
          </div>
          <p className="pt-2">Start time</p>
          <div className="flex items-center">
            <input
              type="datetime-local"
              className="my-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
            />
            <button className="ml-2">
              <ClockIcon className="w-6 h-6" />
            </button>
          </div>
          <p className="pt-2">End time</p>
          <div className="flex items-center">
            <input
              type="datetime-local"
              className="my-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-accent sm:text-sm sm:leading-6"
            />
            <button className="ml-2">
              <ClockIcon className="w-6 h-6" />
            </button>
          </div>
          <button className="rounded px-2 py-1 bg-accent text-white mt-2">
            Generate
          </button>
        </div>
      ),
    },
    ...(isAdmin ? [{ name: "Manage", content: <p>Placeholder...</p> }] : []),
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
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
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
                  <div className="bg-white px-4 py-5 sm:p-6 text-center flex flex-col items-center justify-center">
                    <div ref={renderedQR} className="p-4">
                      <QRCode value={qr.uuid} fgColor="#7d6399" />
                    </div>
                    <p>{qr.name}</p>
                  </div>
                  <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                    <button
                      type="button"
                      className="inline-flex w-full justify-center rounded-md px-3 py-2 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-gray-300 bg-accent hover:bg-gray-50 sm:mt-0 sm:w-auto hover:text-gray-900"
                      onClick={downloadQR}
                    >
                      Download
                    </button>
                    <button
                      type="button"
                      className="mt-2 sm:mr-2 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                      onClick={() => setOpen(false)}
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
