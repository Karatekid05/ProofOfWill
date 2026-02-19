"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CommitmentCard } from "@/components/dashboard/commitment-card"
import { StatsBar } from "@/components/dashboard/stats-bar"
import { type Commitment, getStatusLabel } from "@/lib/commitments"
import { useAllCommitments } from "@/hooks/useCommitments"
import { useResolveCommitment } from "@/hooks/useResolveCommitment"
import { toast } from "sonner"
import { arcTestnet } from "@/lib/arc-chain"

const tabs = ["all", "active", "pending", "resolved"] as const
type Tab = (typeof tabs)[number]

export function DashboardView() {
  const { commitments: onchainCommitments, isLoading, refetch, hasVault } = useAllCommitments()
  const { resolve, isPending: isResolving, isSuccess: resolveSuccess, hash: resolveHash } = useResolveCommitment()
  const [activeTab, setActiveTab] = useState<Tab>("all")

  const commitments = onchainCommitments

  useEffect(() => {
    if (resolveSuccess && hasVault && resolveHash) {
      toast.success("Commitment resolved onchain.", {
        action: {
          label: "View",
          onClick: () => window.open(`${arcTestnet.blockExplorers.default.url}/tx/${resolveHash}`, "_blank"),
        },
      })
      refetch()
    }
  }, [resolveSuccess, hasVault, refetch, resolveHash])

  function handleResolve(id: number, success: boolean) {
    if (!hasVault) return
    resolve(id, success)
  }

  const filtered = commitments.filter((c) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return getStatusLabel(c) === "active"
    if (activeTab === "pending") return getStatusLabel(c) === "pending"
    return getStatusLabel(c) === "succeeded" || getStatusLabel(c) === "failed"
  })

  return (
    <div className="flex flex-col gap-8">
      {!hasVault && (
        <div className="rounded-sm border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
          No vault configured. Deploy the contract and set NEXT_PUBLIC_COMMITMENT_VAULT_ADDRESS to use the app.
        </div>
      )}
      <StatsBar commitments={commitments} />

      <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-1 rounded-sm border border-border bg-card p-0.5">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`rounded-sm px-3 py-1.5 text-[12px] font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <Button asChild size="sm" className="h-8 gap-1.5 rounded-sm bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90">
          <Link href="/create">
            <Plus className="h-3.5 w-3.5" />
            New
          </Link>
        </Button>
      </div>

      {!hasVault ? (
        <div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-border py-14">
          <p className="text-sm text-muted-foreground">Deploy the vault contract to start creating commitments.</p>
          <Button asChild variant="outline" size="sm" className="h-7 rounded-sm border-border text-xs text-foreground">
            <Link href="/create">Create one</Link>
          </Button>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-border py-14">
          <p className="text-sm text-muted-foreground">Loading commitments...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-border py-14">
          <p className="text-sm text-muted-foreground">No commitments found</p>
          <Button asChild variant="outline" size="sm" className="h-7 rounded-sm border-border text-xs text-foreground">
            <Link href="/create">Create one</Link>
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((commitment) => (
            <CommitmentCard
              key={commitment.id}
              commitment={commitment}
              onResolve={handleResolve}
              refetch={refetch}
              isResolving={isResolving}
            />
          ))}
        </div>
      )}
    </div>
  )
}
