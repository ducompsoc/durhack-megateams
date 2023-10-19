"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useFormState } from "react-hooks-use-form-state";
import Select from "react-select";
import useSWR from "swr";

export default function Admin() {
  const { mutate: mutateUsers, data: usersData = { users: [] } } = useSWR<{
    users: any[];
  }>("/users");
  const [users, setUsers, resetForm] = useFormState(usersData.users);
  const { data: { teams } = { teams: [] } } = useSWR<{
    teams: any[];
  }>("/teams");

  const isAdmin = true;

  function alterPoints(id: number) {
    const points = (
      document.getElementById("add_points_" + id) as HTMLInputElement
    )?.value;
    if (points) {
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="dh-box p-4 mb-6">
        <div className="flex flex-row items-center">
          <input
            type="text"
            className="dh-input w-full pl-10"
            placeholder="Search for users..."
          />
          <MagnifyingGlassIcon className="w-6 h-6 absolute ml-2" />
        </div>
      </div>
      {users.map(
        (
          { preferred_name, email, points, megateam_name, team_name, id },
          i
        ) => (
          <div className="dh-box p-4 mb-4" key={i}>
            <p className="mb-2">
              {preferred_name} - {email}
            </p>
            <p className="mb-2">
              {points} points | {megateam_name || "No megateam assigned!"}
            </p>
            <Select
              className="mb-4 dh-select"
              options={teams.map(({ name }) => ({
                label: name,
                value: name,
              }))}
              classNamePrefix="dh-select"
              menuPortalTarget={document.body}
              styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
              value={{ label: team_name, value: team_name }}
            />
            {isAdmin && (
              <div className="flex items-center">
                <input
                  type="number"
                  className="dh-input w-20"
                  defaultValue={5}
                  id={"add_points_" + id}
                />
                <p className="ml-2">points</p>
                <button className="ml-4 dh-btn" onClick={() => alterPoints(id)}>
                  Adjust Points
                </button>
              </div>
            )}
          </div>
        )
      )}
    </div>
  );
}
