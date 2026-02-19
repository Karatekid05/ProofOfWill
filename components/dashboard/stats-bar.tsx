import { type Commitment, getStatusLabel } from "@/lib/commitments"

interface StatsBarProps {
  commitments: Commitment[]
}

export function StatsBar({ commitments }: StatsBarProps) {
  const totalLocked = commitments.reduce((sum, c) => sum + c.amount, 0)
  const active = commitments.filter((c) => getStatusLabel(c) === "active").length
  const succeeded = commitments.filter((c) => getStatusLabel(c) === "succeeded").length
  const failed = commitments.filter((c) => getStatusLabel(c) === "failed").length

  const stats = [
    { label: "Total Locked", value: `$${totalLocked.toLocaleString()}` },
    { label: "Active", value: String(active) },
    { label: "Succeeded", value: String(succeeded) },
    { label: "Failed", value: String(failed) },
  ]

  return (
    <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-0.5 bg-card px-4 py-3.5">
          <span className="font-mono text-lg font-bold text-foreground">{stat.value}</span>
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">{stat.label}</span>
        </div>
      ))}
    </div>
  )
}
