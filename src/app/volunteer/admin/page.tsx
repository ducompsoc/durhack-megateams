import dynamic from "next/dynamic";

const Admin = dynamic(() => import("./admin"), {
  ssr: false,
});

export default function AdminPage() {
  return <Admin />;
}
