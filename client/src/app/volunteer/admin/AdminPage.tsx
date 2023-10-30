"use client";

import ButtonModal from "@/app/components/ButtonModal";
import { fetchMegateamsApi } from "@/app/lib/api";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { useFormState } from "react-hooks-use-form-state";
import ReactPaginate from "react-paginate";
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
  const [message, setMessage] = useState("");
  const [messageOpen, setMessageOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchTextActive, setSearchTextActive] = useState("");
  const [itemOffset, setItemOffset] = useState(0);
  const [pageNumber, setPageNumber] = useState(0);

  const lowerSearch = searchTextActive.toLowerCase();
  const filteredUsers = users.filter((users) => {
    if (users.preferred_name.toLowerCase().includes(lowerSearch)) return true;
    if (users.email.toLowerCase().includes(lowerSearch)) return true;
    return false;
  });

  const itemsPerPage = 50;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = filteredUsers.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(filteredUsers.length / itemsPerPage);

  function handlePageClick(event: { selected: number }) {
    const newOffset = (event.selected * itemsPerPage) % filteredUsers.length;
    setItemOffset(newOffset);
    setPageNumber(event.selected);
  }

  function handleSearchText(text: string) {
    setSearchText(text);
    if (!text) {
      setSearchTextActive(text);
      setItemOffset(0);
      setPageNumber(0);
    }
  }

  function search() {
    setSearchTextActive(searchText);
    setItemOffset(0);
    setPageNumber(0);
  }

  async function alterPoints(id: number) {
    const points = (
      document.getElementById("add_points_" + id) as HTMLInputElement
    )?.value;
    if (points && !Number.isNaN(points)) {
      try {
        await fetchMegateamsApi("/points", {
          method: "POST",
          body: JSON.stringify({ value: parseInt(points), redeemer_id: id }),
          headers: { "Content-Type": "application/json" },
        });
        await mutateUsers();
        resetForm();
        setMessage("Successfully updated user points!");
      } catch {
        setMessage("Failed to update user points!");
      }
    } else {
      setMessage("Please provide a positive or negative points value!");
    }
    setMessageOpen(true);
  }

  async function changeTeam(id: number, team_id: number) {
    try {
      await fetchMegateamsApi("/users/" + id, {
        method: "PATCH",
        body: JSON.stringify({ team_id }),
        headers: { "Content-Type": "application/json" },
      });
      await mutateUsers();
      resetForm();
      setMessage("Successfully updated user's team!");
    } catch {
      setMessage("Failed to update user's team!");
    }
    setMessageOpen(true);
  }

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="dh-box p-4">
          <div className="flex flex-row items-center">
            <input
              type="text"
              className="dh-input w-full pl-10"
              placeholder="Search for users..."
              value={searchText}
              onChange={(e) => handleSearchText(e.target.value)}
            />
            <MagnifyingGlassIcon className="w-6 h-6 absolute ml-2" />
            <button className="dh-btn ml-2" onClick={search}>
              Search
            </button>
          </div>
        </div>
        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageClick}
          pageCount={pageCount}
          previousLabel="<"
          renderOnZeroPageCount={null}
          marginPagesDisplayed={2}
          pageRangeDisplayed={1}
          forcePage={pageNumber}
          className="dh-paginate my-6"
        />
        {currentItems.map(
          (
            {
              preferred_name,
              email,
              points,
              megateam_name,
              team_name,
              id,
              team_id,
            },
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
                options={teams.map(({ name, team_id }) => ({
                  label: name,
                  value: team_id,
                }))}
                classNamePrefix="dh-select"
                menuPortalTarget={document.body}
                styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                value={{ label: team_name, value: team_id }}
                onChange={(val) => changeTeam(id, val?.value)}
              />
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
            </div>
          )
        )}
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
