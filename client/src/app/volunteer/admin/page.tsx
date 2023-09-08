"use client";

import useUser from "@/app/lib/useUser";
import dynamic from "next/dynamic";
import { redirect } from "next/navigation";

const Admin = dynamic(() => import("./admin"), {
  ssr: false,
});

export default function AdminPage() {
  const { user, isLoading } = useUser({ redirectTo: "/volunteer" });
  if (isLoading) return <></>;
  if (user?.role !== "admin") return redirect("/");

  return <Admin />;
}
