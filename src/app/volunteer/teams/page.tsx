"use client";

import useUser from "@/app/lib/useUser";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const TeamsPage = dynamic(() => import("./TeamsPage"), {
  ssr: false,
});

export default function Teams() {
  const { user, isLoading } = useUser({ redirectTo: "/" });
  if (isLoading) return <></>;
  if (!["volunteer", "admin"].includes(user?.role)) return redirect("/volunteer");

  return <TeamsPage />;
}
