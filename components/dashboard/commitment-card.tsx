"use client"

import { useState } from "react"
import { toast } from "sonner"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { type Commitment, getStatusLabel, getTimeRemaining } from "@/lib/commitments"

interface CommitmentCardProps {
  commitment: Commitment
  onResolve?: (id: number, success: boolean) => void
  refetch?: () => void
  isResolving?: boolean
}

const statusStyles: Record<string, { dot: string; label: string }> = {
  active: { dot: "bg-primary", label: "Active" },
  pending: { dot: "bg-primary animate-pulse", label: "Pending" },
  succeeded: { dot: "bg-success", label: "Succeeded" },
  failed: { dot: "bg-destructive", label: "Failed" },
}

export function CommitmentCard({ commitment, onResolve, refetch, isResolving: isResolvingProp }: CommitmentCardProps) {
  const [localResolving, setLocalResolving] = useState(false)
  const status = getStatusLabel(commitment)
  const style = statusStyles[status]
  const isOnchain = typeof onResolve === "function"
  const isResolving = isOnchain ? (isResolvingProp ?? false) : localResolving

  async function handleResolve(success: boolean) {
    if (isOnchain) {
      onResolve?.(commitment.id, success)
      return
    }
    setLocalResolving(true)
    await new Promise((r) => setTimeout(r, 1500))
    onResolve?.(commitment.id, success)
    toast.success(
      success
        ? "Resolved as success. USDC refunded."
        : "Resolved as failed. USDC sent to penalty receiver."
    )
    setLocalResolving(false)
  }

  return (
    <div className="flex flex-col gap-4 rounded-sm border border-border bg-card p-5 transition-colors hover:border-border/80">
      {/* Top row: status + id + amount */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              {style.label}
            </span>
            <span className="text-[11px] text-muted-foreground/60">
              #{String(commitment.id).padStart(4, "0")}
            </span>
          </div>
          <h3 className="text-base font-semibold text-foreground">{commitment.title}</h3>
          {commitment.description && (
            <p className="text-sm leading-relaxed text-muted-foreground">{commitment.description}</p>
          )}
        </div>
        <div className="shrink-0 text-right">
          <span className="font-mono text-lg font-bold text-foreground">
            ${commitment.amount.toLocaleString()}
          </span>
          <span className="block text-[11px] text-muted-foreground">USDC</span>
        </div>
      </div>

      {/* Address grid */}
      <div className="grid grid-cols-2 gap-3 rounded-sm border border-border bg-secondary/30 p-3 sm:grid-cols-4">
        {[
          { label: "Creator", value: commitment.creator },
          { label: "Verifier", value: commitment.verifier || "Self" },
          { label: "Penalty to", value: commitment.penaltyReceiver },
          {
            label: "Deadline",
            value: commitment.deadline.toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric",
            }),
            mono: false,
          },
        ].map((field) => (
          <div key={field.label} className="flex flex-col gap-0.5 overflow-hidden">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{field.label}</span>
            <span className={`truncate text-xs text-foreground ${field.mono !== false ? "font-mono" : ""}`}>
              {field.value}
            </span>
          </div>
        ))}
      </div>

      {/* Bottom row: time remaining + actions */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {status === "active" && getTimeRemaining(commitment.deadline)}
          {status === "pending" && "Awaiting resolution"}
          {status === "succeeded" && "USDC refunded"}
          {status === "failed" && "USDC penalized"}
        </span>

        {status === "pending" && (
          <div className="flex items-center gap-2">
            {isResolving && (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Resolving...
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              disabled={isResolving}
              onClick={() => handleResolve(false)}
              className="h-7 rounded-sm border-destructive/30 px-3 text-xs text-destructive hover:bg-destructive/10 disabled:opacity-50"
            >
              {isResolving ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <XCircle className="mr-1 h-3 w-3" />
              )}
              Fail
            </Button>
            <Button
              size="sm"
              disabled={isResolving}
              onClick={() => handleResolve(true)}
              className="h-7 rounded-sm bg-primary px-3 text-xs text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {isResolving ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <CheckCircle className="mr-1 h-3 w-3" />
              )}
              Succeed
            </Button>
          </div>
        )}

        {status === "active" && (
          <span className="font-mono text-[11px] text-primary">IN PROGRESS</span>
        )}
      </div>
    </div>
  )
}
