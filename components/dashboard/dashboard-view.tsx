"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CommitmentCard } from "@/components/dashboard/commitment-card"
import { AgreementCard } from "@/components/dashboard/agreement-card"
import { StatsBar } from "@/components/dashboard/stats-bar"
import { type Commitment, getStatusLabel } from "@/lib/commitments"
import { useAllCommitments } from "@/hooks/useCommitments"
import { useAllAgreements } from "@/hooks/useAgreements"
import { useResolveCommitment } from "@/hooks/useResolveCommitment"
import { useAccount } from "wagmi"
import { toast } from "sonner"
import { arcTestnet } from "@/lib/arc-chain"
import { isAwaitingMyAction } from "@/lib/agreements"
import { HAS_DUAL_VAULT } from "@/lib/contracts"

const commitmentTabs = ["all", "active", "pending", "resolved"] as const
type CommitmentTab = (typeof commitmentTabs)[number]

type Section = "commitments" | "agreements"

export function DashboardView() {
  const { address } = useAccount()
  const [section, setSection] = useState<Section>("agreements")

  const { commitments, isLoading, refetch, hasVault } = useAllCommitments()
  const { agreements, isLoading: agreementsLoading, refetch: refetchAgreements, hasVault: hasDualVault } = useAllAgreements()
  const { resolve, isPending: isResolving, isSuccess: resolveSuccess, hash: resolveHash } = useResolveCommitment()
  const [activeTab, setActiveTab] = useState<CommitmentTab>("all")

  useEffect(() => {
    if (resolveSuccess && hasVault && resolveHash) {
      toast.success("Commitment resolved onchain.", {
        action: { label: "View", onClick: () => window.open(`${arcTestnet.blockExplorers.default.url}/tx/${resolveHash}`, "_blank") },
      })
      refetch()
    }
  }, [resolveSuccess, hasVault, refetch, resolveHash])

  function handleResolve(id: number, success: boolean) {
    if (!hasVault) return
    resolve(id, success)
  }

  const filteredCommitments = commitments.filter((c) => {
    if (activeTab === "all") return true
    if (activeTab === "active") return getStatusLabel(c) === "active"
    if (activeTab === "pending") return getStatusLabel(c) === "pending"
    return getStatusLabel(c) === "succeeded" || getStatusLabel(c) === "failed"
  })

  const awaitingAgreements = agreements.filter((a) => isAwaitingMyAction(a, address ?? ""))
  const otherAgreements = agreements.filter((a) => !isAwaitingMyAction(a, address ?? ""))

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1 rounded-sm border border-border bg-card p-0.5">
          <button
            onClick={() => setSection("agreements")}
            className={`rounded-sm px-3 py-1.5 text-[12px] font-medium transition-colors ${
              section === "agreements" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Agreements
          </button>
          <button
            onClick={() => setSection("commitments")}
            className={`rounded-sm px-3 py-1.5 text-[12px] font-medium transition-colors ${
              section === "commitments" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Commitments
          </button>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" className="h-8 gap-1.5 rounded-sm bg-primary px-4 text-xs font-medium text-primary-foreground hover:bg-primary/90">
            <Link href="/create/agreement">
              <Plus className="h-3.5 w-3.5" />
              New agreement
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="h-8 gap-1.5 rounded-sm border-border px-4 text-xs font-medium text-foreground">
            <Link href="/create">
              <Plus className="h-3.5 w-3.5" />
              New commitment
            </Link>
          </Button>
        </div>
      </div>

      {section === "agreements" && (
        <>
          {!hasDualVault && (
            <div className="rounded-sm border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
              Set NEXT_PUBLIC_DUAL_CONSENSUS_VAULT_ADDRESS to use two-party agreements.
            </div>
          )}
          {hasDualVault && (
            <>
              {agreementsLoading ? (
                <div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-border py-14">
                  <p className="text-sm text-muted-foreground">Loading agreements...</p>
                </div>
              ) : agreements.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-border py-14">
                  <p className="text-sm text-muted-foreground">No agreements yet</p>
                  <Button asChild variant="outline" size="sm" className="h-7 rounded-sm border-border text-xs text-foreground">
                    <Link href="/create/agreement">Create agreement</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {awaitingAgreements.length > 0 && (
                    <div className="flex flex-col gap-2">
                      <h3 className="text-sm font-medium text-foreground">Awaiting your action</h3>
                      <div className="flex flex-col gap-3">
                        {awaitingAgreements.map((a) => (
                          <AgreementCard key={a.id} agreement={a} refetch={refetchAgreements} />
                        ))}
                      </div>
                    </div>
                  )}
                  {otherAgreements.length > 0 && (
                    <div className="flex flex-col gap-2">
                      {awaitingAgreements.length > 0 && <h3 className="text-sm font-medium text-foreground">All agreements</h3>}
                      <div className="flex flex-col gap-3">
                        {otherAgreements.map((a) => (
                          <AgreementCard key={a.id} agreement={a} refetch={refetchAgreements} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}

      {section === "commitments" && (
        <>
          {!hasVault && (
            <div className="rounded-sm border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
              Deploy the vault and set NEXT_PUBLIC_COMMITMENT_VAULT_ADDRESS for commitments.
            </div>
          )}
          {hasVault && (
            <>
              <StatsBar commitments={commitments} />
              <div className="flex gap-1 rounded-sm border border-border bg-card p-0.5">
                {commitmentTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`rounded-sm px-3 py-1.5 text-[12px] font-medium capitalize transition-colors ${
                      activeTab === tab ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              {isLoading ? (
                <div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-border py-14">
                  <p className="text-sm text-muted-foreground">Loading commitments...</p>
                </div>
              ) : filteredCommitments.length === 0 ? (
                <div className="flex flex-col items-center gap-3 rounded-sm border border-dashed border-border py-14">
                  <p className="text-sm text-muted-foreground">No commitments found</p>
                  <Button asChild variant="outline" size="sm" className="h-7 rounded-sm border-border text-xs text-foreground">
                    <Link href="/create">Create one</Link>
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {filteredCommitments.map((c) => (
                    <CommitmentCard
                      key={c.id}
                      commitment={c}
                      onResolve={handleResolve}
                      refetch={refetch}
                      isResolving={isResolving}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  )
}
