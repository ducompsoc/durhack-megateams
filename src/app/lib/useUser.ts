import { useEffect } from "react";
import { redirect } from "next/navigation";
import useSWR from "swr";
import { makeMegateamsApiRequest } from "./api";

export default function useUser({
  redirectTo = "",
  redirectIfFound = false,
} = {}) {
  const {
    data: user,
    mutate: mutateUser,
    isLoading,
  } = useSWR("/auth/user", makeMegateamsApiRequest);

  useEffect(() => {
    // if no redirect needed, just return (example: already on /hacker)
    // if user data not yet there (fetch in progress, logged in or not) then don't do anything yet
    if ((!redirectTo && !redirectIfFound) || !user) return;

    // If redirectTo is set, redirect if the user was not found.
    if (redirectTo && !redirectIfFound && !user?.user?.loggedIn) {
      redirect(redirectTo);
    }
    // If redirectIfFound is set, redirect if the user was found
    if (redirectIfFound && user?.user?.loggedIn) {
      if (user?.user?.role === "hacker") {
        return redirect("/hacker");
      }
      return redirect("/volunteer");
    }
  }, [user, redirectIfFound, redirectTo]);

  return { user: user?.user, mutateUser, isLoading };
}
