import dynamic from "next/dynamic";

const TeamsPage = dynamic(() => import("./TeamsPage"), {
  ssr: false,
});

export default function Teams() {
  return <TeamsPage />;
}
