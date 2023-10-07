import { ClockIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function Custom({
  displayQR,
}: {
  displayQR: (
    name: string,
    url: string,
    category: string,
    preset: boolean
  ) => void;
}) {
  const now = currentDate();
  const nowPlusFive = currentDate(5);
  const [startDate, setStartDate] = useState(now);
  const [endDate, setEndDate] = useState(nowPlusFive);

  const qrTypes = ["Workshop", "Challenge", "Volunteer", "Sponsor", "Personal"];

  function currentDate(addMinutes?: number) {
    let now = new Date();
    now.setMinutes(
      now.getMinutes() - now.getTimezoneOffset() + (addMinutes ?? 0)
    );
    return now.toISOString().slice(0, 16);
  }

  return (
    <div className="dh-box p-4">
      <p className="font-semibold mb-2">Generate Custom QR</p>
      <input
        type="text"
        className="dh-input w-full"
        placeholder="Name/Description"
      />
      <select className="my-2 dh-input w-full">
        {qrTypes.map((qrType) => (
          <option key={qrType} value={qrType}>
            {qrType}
          </option>
        ))}
      </select>
      <div className="flex items-center">
        <input type="number" className="my-2 dh-input w-full md:w-fit" />
        <p className="ml-1 mr-2">points</p>
        <input type="number" className="my-2 dh-input w-full md:w-fit" />
        <p className="ml-1 mr-2">uses</p>
      </div>
      <p className="pt-2">Start time</p>
      <div className="flex items-center">
        <input
          type="datetime-local"
          className="my-2 dh-input w-full"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <button className="ml-2" onClick={() => setStartDate(currentDate())}>
          <ClockIcon className="w-6 h-6" />
        </button>
      </div>
      <p className="pt-2">End time</p>
      <div className="flex items-center">
        <input
          type="datetime-local"
          className="my-2 dh-input w-full"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <button className="ml-2" onClick={() => setEndDate(currentDate(5))}>
          <ClockIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="flex items-center mt-2">
        <p>Publicised:</p>
        <input type="checkbox" className="ml-2 dh-check" />
        <button className="dh-btn ml-4">Generate</button>
      </div>
    </div>
  );
}
