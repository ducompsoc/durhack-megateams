"use client";

import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

import { useUser } from "@/lib/useUser";
import { isVolunteer } from "@/lib/is-role";

const TeamsPage = dynamic(
  () => import("./teams-page").then(mod => mod.TeamsPage),
  { ssr: false, }
);

export default function Teams() {
  const { user, isLoading } = useUser();
  if (isLoading) return <></>;
  if (user == null || !isVolunteer(user)) return redirect("/");

  return <TeamsPage />;
}
