export default function getPositionMedal(rank: number) {
    if (rank === 0) return "🥇";
    if (rank === 1) return "🥈";
    if (rank === 2) return "🥉";
    return `(#${rank + 1})`;
}
