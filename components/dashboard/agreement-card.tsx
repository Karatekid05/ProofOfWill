"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { toast } from "sonner"
import { Loader2, Copy, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  type Agreement,
  agreementStatusLabel,
  isAwaitingMyAction,
  myRole,
  MODE_ONE_DEPOSIT,
  MODE_BOTH_DEPOSIT,
  STATUS_CREATED,
  STATUS_ACTIVE,
  STATUS_RESOLVED,
  OUTCOME_DONE,
  OUTCOME_CANCEL,
  OUTCOME_REFUND_A,
  outcomeLabel,
} from "@/lib/agreements"
import { useAcceptAgreement } from "@/hooks/useAcceptAgreement"
import { useSubmitResolution } from "@/hooks/useSubmitResolution"
import { useAccount } from "wagmi"
import { arcTestnet } from "@/lib/arc-chain"
import { getAgreementMeta } from "@/lib/agreement-meta"

interface AgreementCardProps {
  agreement: Agreement
  refetch: () => void
}

export function AgreementCard({ agreement, refetch }: AgreementCardProps) {
  const { address } = useAccount()
  const role = myRole(agreement, address ?? "")
  const awaiting = isAwaitingMyAction(agreement, address ?? "")
  const { accept, isPending: isAcceptPending, isSuccess: acceptSuccess, hash: acceptHash } = useAcceptAgreement()
  const { submit, isPending: isSubmitPending, isSuccess: submitSuccess, hash: submitHash } = useSubmitResolution()
  const [resolution, setResolution] = useState<1 | 2 | 3>(1)
  const [meta, setMeta] = useState<{ title: string; description: string } | null>(null)
  useEffect(() => {
    setMeta(getAgreementMeta(agreement.id))
  }, [agreement.id])

  useEffect(() => {
    if (acceptSuccess && acceptHash) {
      toast.success("Agreement accepted", {
        action: { label: "View", onClick: () => window.open(`${arcTestnet.blockExplorers.default.url}/tx/${acceptHash}`, "_blank") },
      })
      refetch()
    }
  }, [acceptSuccess, acceptHash, refetch])

  useEffect(() => {
    if (submitSuccess && submitHash) {
      toast.success("Resolution submitted", {
        action: { label: "View", onClick: () => window.open(`${arcTestnet.blockExplorers.default.url}/tx/${submitHash}`, "_blank") },
      })
      refetch()
    }
  }, [submitSuccess, submitHash, refetch])

  function copyLink() {
    const url = typeof window !== "undefined" ? `${window.location.origin}/agreements/${agreement.id}` : ""
    navigator.clipboard.writeText(url)
    toast.success("Link copied. Share it with the other party.")
  }

  const isOneDeposit = agreement.mode === MODE_ONE_DEPOSIT
  const statusStr = agreementStatusLabel(agreement.status)
  const needsAccept = agreement.status === STATUS_CREATED && role === "partyB"
  const needsResolution = agreement.status === STATUS_ACTIVE && role && (role === "partyA" ? agreement.resolutionA === 0 : agreement.resolutionB === 0)
  const resolvedOutcome = agreement.status === STATUS_RESOLVED && agreement.resolutionA

  return (
    <div className="flex flex-col gap-4 rounded-sm border border-border bg-card p-5 transition-colors hover:border-border/80">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className={`h-1.5 w-1.5 rounded-full ${agreement.status === STATUS_RESOLVED ? "bg-muted-foreground" : awaiting ? "bg-primary animate-pulse" : "bg-primary"}`} />
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{statusStr}</span>
            <span className="text-[11px] text-muted-foreground/60">#{String(agreement.id).padStart(4, "0")}</span>
            {role && <span className="text-[10px] rounded bg-secondary px-1.5 py-0.5 text-muted-foreground">You: {role === "partyA" ? "Party A" : "Party B"}</span>}
          </div>
          <h3 className="text-base font-semibold text-foreground">
            {meta?.title?.trim() || (isOneDeposit ? "One deposit" : "Both deposit") + ` · ${agreement.amountA} USDC` + (!isOneDeposit ? ` + ${agreement.amountB} USDC` : "")}
          </h3>
          {meta?.title?.trim() && (
            <p className="text-xs text-muted-foreground">
              {isOneDeposit ? "One deposit" : "Both deposit"} · {agreement.amountA} USDC{!isOneDeposit ? ` + ${agreement.amountB} USDC` : ""}
            </p>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" onClick={copyLink} title="Copy share link">
            <Copy className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 w-7 p-0" asChild>
            <Link href={`/agreements/${agreement.id}`}>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 rounded-sm border border-border bg-secondary/30 p-3 sm:grid-cols-4">
        {[
          { label: "Party A", value: agreement.partyA },
          { label: "Party B", value: agreement.partyB },
          {
            label: "Deadline",
            value: agreement.deadline.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
            mono: false,
          },
          { label: "Mode", value: isOneDeposit ? "One deposit" : "Both deposit", mono: false },
        ].map((field) => (
          <div key={field.label} className="flex flex-col gap-0.5 overflow-hidden">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{field.label}</span>
            <span className={`truncate text-xs text-foreground ${field.mono !== false ? "font-mono" : ""}`}>{field.value}</span>
          </div>
        ))}
      </div>

      {needsAccept && (
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            disabled={isAcceptPending}
            onClick={() => accept(agreement.id, agreement)}
            className="gap-1.5"
          >
            {isAcceptPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            {agreement.mode === MODE_BOTH_DEPOSIT ? `Accept & lock ${agreement.amountB} USDC` : "Accept agreement"}
          </Button>
        </div>
      )}

      {needsResolution && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted-foreground">Submit resolution:</span>
          <select
            value={resolution}
            onChange={(e) => setResolution(Number(e.target.value) as 1 | 2 | 3)}
            className="rounded-sm border border-border bg-background px-2 py-1 text-xs"
          >
            <option value={1}>{outcomeLabel(OUTCOME_DONE, agreement.mode)}</option>
            <option value={2}>{outcomeLabel(OUTCOME_CANCEL, agreement.mode)}</option>
            {agreement.mode === MODE_BOTH_DEPOSIT && <option value={3}>{outcomeLabel(OUTCOME_REFUND_A, agreement.mode)}</option>}
          </select>
          <Button
            size="sm"
            disabled={isSubmitPending}
            onClick={() => submit(agreement.id, resolution)}
            className="gap-1.5"
          >
            {isSubmitPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
            Submit
          </Button>
        </div>
      )}

      {agreement.status === STATUS_ACTIVE && agreement.resolutionA !== 0 && agreement.resolutionB !== 0 && agreement.resolutionA !== agreement.resolutionB && (
        <p className="text-xs text-amber-600 dark:text-amber-400">Mismatch: re-submit until both match.</p>
      )}

      {agreement.status === STATUS_RESOLVED && (
        <p className="text-xs text-muted-foreground">
          Resolved: {outcomeLabel(resolvedOutcome, agreement.mode)}
        </p>
      )}
    </div>
  )
}
