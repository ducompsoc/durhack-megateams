export default function TeamName(props: { className?: string, teamName: string }) {
  const capitals = props.teamName.match(/([A-Z])/g) ?? [];
  const split = props.teamName.split(/[A-Z]/);
  split?.shift();

  return (
    <div className={"flex flex-wrap " + props.className || ""}>
      {split?.map((text: string, i: number) => (
        <p>{capitals[i] + text}</p>
      ))}
    </div>
  );
}