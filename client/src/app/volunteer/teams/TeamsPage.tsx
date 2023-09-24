"use client";

import ButtonModal from "@/app/components/ButtonModal";
import { fetchMegateamsApi } from "@/app/lib/api";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useFormState } from "react-hooks-use-form-state";
import Select from "react-select";
import useSWR from "swr";

export default function TeamsPage() {
  const { mutate: mutateTeams, data: teamsData = { teams: [] } } = useSWR<{
    teams: any[];
  }>("/teams");
  const [teams, setTeams, resetForm] = useFormState(teamsData.teams);
  const { data: { megateams } = { megateams: [] } } = useSWR<{
    megateams: any[];
  }>("/areas");
  const [message, setMessage] = useState("");
  const [messageOpen, setMessageOpen] = useState(false);

  const filteredTeams = teams.filter((team) => !team.hidden);

  function changeMegateam(team: any, name: string) {
    const newTeams = [...teams];
    team.area = { megateam: { megateam_name: name } };
    setTeams(newTeams);
  }

  function changeArea(team: any, area: any) {
    const newTeams = [...teams];
    team.area.area_id = area.id;
    setTeams(newTeams);
  }

  function getMegateam(megateam_name: string) {
    const filteredMegateams = megateams.filter(
      ({ name }) => name === megateam_name
    );
    return filteredMegateams.length ? filteredMegateams[0] : null;
  }

  function getArea(megateam: any, area_id: number) {
    const filteredAreas =
      megateam?.areas?.filter((area: any) => area.id === area_id) ?? [];
    return filteredAreas.length ? filteredAreas[0] : null;
  }

  function filterTeams(searchText: string) {
    const lowerSearch = searchText.toLowerCase();
    setTeams(
      teams.map((team) => {
        team.hidden = true;
        if (team.name.toLowerCase().includes(lowerSearch)) team.hidden = false;
        return team;
      })
    );
  }

  async function saveTeam(team: any) {
    if (Number.isInteger(team?.area?.area_id)) {
      try {
        await fetchMegateamsApi("/teams/" + team.team_id, {
          method: "PATCH",
          body: JSON.stringify({ area_code: team.area.area_id }),
          headers: { "Content-Type": "application/json" },
        });
        setMessage("Successfully updated team!");
        mutateTeams();
        resetForm();
      } catch {
        setMessage("Failed to update team!");
      }
    } else {
      setMessage("Please select a Megateam and Area!");
    }
    setMessageOpen(true);
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="dh-box p-4 mb-6">
          <div className="flex flex-row items-center">
            <input
              type="text"
              className="dh-input w-full pl-10"
              placeholder="Search for teams..."
              onChange={(e) => filterTeams(e.target.value)}
            />
            <MagnifyingGlassIcon className="w-6 h-6 absolute ml-2" />
          </div>
        </div>
        {filteredTeams.map((team) => {
          const megateam = getMegateam(team.area?.megateam?.megateam_name);
          const area = getArea(megateam, team.area?.area_id);
          return (
            <div className="dh-box p-4 mb-4" key={team.join_code}>
              <div className="flex mb-2">
                <p>{team.name}</p>
                <p className="ml-2 text-gray-600 dark:text-neutral-400">
                  Join code: {team.join_code}
                </p>
              </div>
              <select
                className="by-2 dh-input w-full"
                value={megateam?.name ?? ""}
                onChange={(e) => changeMegateam(team, e.target.value)}
              >
                <option disabled value="">
                  Assign a megateam!
                </option>
                {megateams.map(({ name }) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <Select
                options={megateam?.areas ?? []}
                className="mt-2 dh-select"
                classNamePrefix="dh-select"
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                getOptionLabel={(option: any) => option.name}
                getOptionValue={(option: any) => option.id}
                value={area}
                onChange={(area) => changeArea(team, area)}
              />
              <div className="md:flex md:justify-end">
                <button
                  className="w-full dh-btn mt-2 md:w-fit"
                  onClick={() => saveTeam(team)}
                >
                  Save
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <ButtonModal
        show={messageOpen}
        onClose={(bool) => setMessageOpen(bool)}
        content={<p className="dark:text-neutral-200">{message}</p>}
        itemsClass="items-center"
        buttons={
          <button
            type="button"
            className="inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto dark:text-neutral-200 dark:bg-neutral-500"
            onClick={() => setMessageOpen(false)}
          >
            Close
          </button>
        }
      />
    </>
  );
}
