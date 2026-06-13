export function Arrow({ direction = "up-right" }) {
  return <span aria-hidden="true">{direction === "down" ? "↓" : "↗"}</span>;
}
