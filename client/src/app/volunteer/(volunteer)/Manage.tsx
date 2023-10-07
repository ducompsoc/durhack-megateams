import {
  ClockIcon,
  MagnifyingGlassIcon,
  TagIcon,
  GiftIcon,
  CameraIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import dateFormat from "dateformat";

export default function Manage({
  displayQR,
}: {
  displayQR: (
    name: string,
    url: string,
    category: string,
    preset: boolean
  ) => void;
}) {
  function getQRState(
    start: Date,
    end: Date,
    enabled: boolean
  ): { checked: boolean; disabled: boolean; preStart: boolean } {
    let state = { checked: enabled, disabled: false, preStart: false };
    let now = new Date();
    if (now > end) {
      state.checked = false;
      state.disabled = true;
    } else if (now < start) {
      state.disabled = true;
      state.preStart = true;
    }
    return state;
  }

  function qrClasses(state: {
    checked: boolean;
    disabled: boolean;
    preStart: boolean;
  }) {
    const { checked, disabled, preStart } = state;
    let bgClass = "dark:bg-neutral-700 bg-gray-200";
    if (preStart || (!disabled && !checked)) {
      bgClass =
        "pattern-diagonal-lines pattern-transparent pattern-bg-gray-200 dark:pattern-bg-neutral-700 pattern-size-16 pattern-opacity-100";
    } else if (disabled) {
      bgClass = "bg-red-100 opacity-100 dark:bg-red-400/50";
    }
    return `${bgClass} drop-shadow-lg p-4 rounded mb-4`;
  }

  const qrs = [
    {
      creator: "Luca",
      points: 10,
      scans: 25,
      type: "Sponsor",
      limit: 30,
      startDate: new Date("10/10/23 06:30"),
      endDate: new Date("10/10/23 07:30"),
      name: "Amazon Workshop",
      uuid: "abc-123",
      enabled: true,
      publicised: true,
    },
    {
      creator: "Luca",
      points: 10,
      scans: 25,
      type: "Sponsor",
      limit: 30,
      startDate: new Date("02/08/23 06:30"),
      endDate: new Date("10/10/23 07:30"),
      name: "Netcraft Workshop",
      uuid: "def-456",
      enabled: true,
      publicised: true,
    },
    {
      creator: "Luca",
      points: 10,
      scans: 25,
      type: "Sponsor",
      limit: 30,
      startDate: new Date("02/08/23 06:30"),
      endDate: new Date("02/08/23 07:30"),
      name: "Waterstons Workshop",
      uuid: "ghi-789",
      enabled: true,
      publicised: true,
    },
  ];

  return (
    <>
      <div className="dh-box p-4 mb-6">
        <div className="flex flex-row items-center">
          <input
            type="text"
            className="dh-input w-full pl-10"
            placeholder="Search for QRs..."
          />
          <MagnifyingGlassIcon className="w-6 h-6 absolute ml-2" />
        </div>
      </div>
      {qrs.map(
        (
          {
            creator,
            points,
            scans,
            type,
            limit,
            startDate,
            endDate,
            name,
            enabled,
            publicised,
            uuid,
          },
          i
        ) => {
          const qrState = getQRState(startDate, endDate, enabled);
          return (
            <div className={qrClasses(qrState)} key={i}>
              <p className="mb-2">{name}</p>
              <div className="mb-4 grid grid-cols-2 gap-x-2 gap-y-2">
                <div className="col-span-1">
                  <p className="flex items-center" title="QR Category/Type">
                    <TagIcon className="w-4 h-4 mr-2" />
                    {type}
                  </p>
                </div>
                <div className="col-span-1">
                  <p
                    className="flex items-center"
                    title="Current Scans/Use Limit"
                  >
                    <CameraIcon className="w-4 h-4 mr-2" />
                    {scans}/{limit} scans
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="flex items-center" title="Creator">
                    <UserIcon className="w-4 h-4 mr-2" />
                    {creator}
                  </p>
                </div>
                <div className="col-span-1">
                  <p className="flex items-center" title="Point Value">
                    <GiftIcon className="w-4 h-4 mr-2" />
                    {points} points
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="flex items-center" title="Valid From - Until">
                    <ClockIcon className="w-4 h-4 mr-2" />
                    {dateFormat(startDate, "hh:MM dd/mm")} -{" "}
                    {dateFormat(endDate, "hh:MM dd/mm")}
                  </p>
                </div>
              </div>
              <div className="flex items-center">
                <button
                  className="dh-btn disabled:bg-gray-300 dark:disabled:bg-neutral-500"
                  disabled={qrState.disabled}
                >
                  View
                </button>
                <p className="ml-4" title="Can be scanned for points?">
                  Enabled:
                </p>
                <input
                  type="checkbox"
                  checked={qrState.checked}
                  disabled={qrState.disabled}
                  className="ml-2 dh-check"
                />
                <p className="ml-4" title="Shown on Challenge list?">
                  Publicised:
                </p>
                <input
                  type="checkbox"
                  checked={
                    (!qrState.disabled || qrState.preStart) && publicised
                  }
                  disabled={qrState.disabled}
                  className="ml-2 dh-check"
                />
              </div>
            </div>
          );
        }
      )}
    </>
  );
}
