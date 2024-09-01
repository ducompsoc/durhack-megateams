"use client";

import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

import { useUser } from "@/lib/useUser";
import { isAdmin } from "@/lib/is-role";

const Admin = dynamic(
  () => import("./admin-page").then(mod => mod.AdminPage),
  { ssr: false }
);

export default function AdminPage() {
  const { user, isLoading } = useUser();

  if (isLoading) return <></>;
  if (user == null) return redirect("/")
  if (!isAdmin(user)) return redirect("/volunteer");

  return <Admin />;
}
