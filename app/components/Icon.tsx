const icons: Record<string, string> = {
  dashboard: "▦", projects: "▰", people: "♙", contractors: "♧", tasks: "✓", dpr: "▤",
  attendance: "◷", photos: "▧", inventory: "▥", movement: "⇄", expenses: "₹", reports: "⌁",
  grid: "▦", calendar: "□", clock: "◷", warning: "!", trend: "↗", box: "◇"
};
export function AppIcon({ name }: { name: string }) { return <span className="app-icon" aria-hidden="true">{icons[name] || "•"}</span>; }
