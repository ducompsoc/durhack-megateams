import { useEffect } from "react";
import { redirect } from "next/navigation";
import useSWR from "swr";

import { makeMegateamsApiRequest } from "./api";


async function userFetcher(url: string) {
  const request = await makeMegateamsApiRequest(url);
  const response = await fetch(request);

  if (response.status === 401) return null;
  if (!response.ok) throw new Error("Couldn't fetch user!");

  return (await response.json()).data;
}

export default function useUser({redirectTo = "", redirectIfFound = false} = {}) {
  const {
    data: user,
    error,
    mutate: mutateUser,
    isLoading,
  } = useSWR("/user", userFetcher);

  useEffect(() => {
    // if no redirect needed, just return (example: already on /hacker)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if ((!redirectTo && !redirectIfFound) || !user) return;

    // If redirectTo is set, redirect if the user was not found.
    if (redirectTo && !user) {
      redirect(redirectTo);
    }
    // If redirectIfFound is set, redirect if the user was found
    if (redirectIfFound && user) {
      if (user.role !== "hacker") {
        return redirect("/volunteer");
      }
      return redirect("/hacker");
    }
  }, [user, redirectIfFound, redirectTo]);

  return { user: user, mutateUser, error, isLoading };
}
