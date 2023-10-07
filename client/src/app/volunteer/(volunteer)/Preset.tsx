import { ClockIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function Preset({
  displayQR,
}: {
  displayQR: (
    name: string,
    uuid: string,
    category: string,
    preset: boolean
  ) => void;
}) {
  const { data: { presets } = { presets: {} }, isLoading } =
    useSWR("/qr_codes/presets");
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    const keys = Object.keys(presets);
    keys.sort();
    if (keys.length && !selected) setSelected(presets[keys[0]]);
  }, [presets]);

  let presetsList: any[] = Object.entries(presets).map(([_, preset]) => preset);
  presetsList.sort((a, b) => a.name.localeCompare(b.name));

  function getExpiryDate(minutesValid: number) {
    let now = new Date();
    now.setMinutes(now.getMinutes() + minutesValid);
    return now.toLocaleString("en-GB", {
      timeStyle: "short",
      dateStyle: "short",
    });
  }

  if (isLoading || !selected) return <></>;

  return (
    <div className="dh-box p-4">
      <input
        type="text"
        className="mb-2 dh-input w-full"
        placeholder="Name/Description"
      />
      <select
        className="dh-input w-full"
        onChange={(e) =>
          setSelected(
            presetsList.filter(({ name }) => name === e.target.value)[0]
          )
        }
        value={selected.name}
      >
        {presetsList.map((preset) => (
          <option key={preset.name} value={preset.name}>
            {preset.name}
          </option>
        ))}
      </select>
      <p className="my-2">{selected.description}</p>
      <div className="flex items-center my-2" title="Expiry time">
        <ClockIcon className="w-6 h-6 mr-2" />
        <p>{getExpiryDate(selected.minutesValid)}</p>
      </div>
      <div className="flex items-center my-2">
        <InformationCircleIcon className="w-6 h-6 mr-2" />
        <p>
          <b>{selected.points}</b> point{selected.points !== 1 ? "s" : ""}
          ,&nbsp;
          <b>{selected.uses}</b> use{selected.uses !== 1 ? "s" : ""}
        </p>
      </div>
      <div className="flex items-center">
        <p>Publicised:</p>
        <input type="checkbox" className="ml-2 dh-check" />
        <button
          className="dh-btn ml-4"
          onClick={() => displayQR("Test QR", "abc-123", "", true)}
        >
          Generate
        </button>
      </div>
    </div>
  );
}
