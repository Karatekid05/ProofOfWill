"use client"

import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { useAgreement } from "@/hooks/useAgreements"
import { useAcceptAgreement } from "@/hooks/useAcceptAgreement"
import { useSubmitResolution } from "@/hooks/useSubmitResolution"
import { useAccount } from "wagmi"
import { toast } from "sonner"
import { arcTestnet } from "@/lib/arc-chain"
import {
  parseAgreement,
  agreementStatusLabel,
  myRole,
  isAwaitingMyAction,
  MODE_ONE_DEPOSIT,
  STATUS_CREATED,
  STATUS_ACTIVE,
  STATUS_RESOLVED,
  OUTCOME_DONE,
  OUTCOME_CANCEL,
  OUTCOME_REFUND_A,
  outcomeLabel,
} from "@/lib/agreements"
import { HAS_DUAL_VAULT } from "@/lib/contracts"
import { getAgreementMeta } from "@/lib/agreement-meta"
import { Loader2, Copy, ArrowLeft } from "lucide-react"

export default function AgreementDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = typeof params.id === "string" ? parseInt(params.id, 10) : NaN
  const { address } = useAccount()
  const { data: raw, isLoading, refetch } = useAgreement(isNaN(id) ? -1 : id)
  const { accept, isPending: isAcceptPending, isSuccess: acceptSuccess, hash: acceptHash } = useAcceptAgreement()
  const { submit, isPending: isSubmitPending, isSuccess: submitSuccess, hash: submitHash } = useSubmitResolution()

  const agreement = raw && Array.isArray(raw) && raw.length >= 9 ? parseAgreement(id, raw as readonly [string, string, bigint, bigint, bigint, number, number, number, number]) : null
  const role = agreement ? myRole(agreement, address ?? "") : null
  const awaiting = agreement ? isAwaitingMyAction(agreement, address ?? "") : false
  const [meta, setMeta] = useState<{ title: string; description: string } | null>(null)
  useEffect(() => {
    if (!isNaN(id)) setMeta(getAgreementMeta(id))
  }, [id])

  useEffect(() => {
    if (acceptSuccess && acceptHash) {
      toast.success("Agreement accepted", {
        action: { label: "View tx", onClick: () => window.open(`${arcTestnet.blockExplorers.default.url}/tx/${acceptHash}`, "_blank") },
      })
      refetch()
    }
  }, [acceptSuccess, acceptHash, refetch])

  useEffect(() => {
    if (submitSuccess && submitHash) {
      toast.success("Resolution submitted", { action: { label: "View tx", onClick: () => window.open(`${arcTestnet.blockExplorers.default.url}/tx/${submitHash}`, "_blank") } })
      refetch()
    }
  }, [submitSuccess, submitHash, refetch])

  function copyLink() {
    const url = typeof window !== "undefined" ? `${window.location.origin}/agreements/${id}` : ""
    navigator.clipboard.writeText(url)
    toast.success("Link copied")
  }

  const [resolution, setResolution] = useState<1 | 2 | 3>(1)
  const needsAccept = agreement?.status === STATUS_CREATED && role === "partyB"
  const needsResolution = agreement?.status === STATUS_ACTIVE && role && (role === "partyA" ? agreement.resolutionA === 0 : agreement.resolutionB === 0)

  if (!HAS_DUAL_VAULT) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 px-6 py-14">
          <p className="text-sm text-muted-foreground">Dual consensus vault not configured.</p>
          <Button asChild variant="link" className="mt-2">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  if (isNaN(id) || id < 0) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex-1 px-6 py-14">
          <p className="text-sm text-muted-foreground">Invalid agreement ID.</p>
          <Button asChild variant="link" className="mt-2">
            <Link href="/dashboard">Back to dashboard</Link>
          </Button>
        </main>
        <Footer />
      </div>
    )
  }

  if (isLoading || !agreement) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <Header />
        <main className="flex flex-1 items-center justify-center px-6 py-14">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    )
  }

  const isOneDeposit = agreement.mode === MODE_ONE_DEPOSIT

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="mx-auto max-w-2xl px-6 py-14 md:py-20">
          <div className="mb-6 flex items-center justify-between">
            <Button variant="ghost" size="sm" className="gap-1.5" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
                Dashboard
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={copyLink} className="gap-1.5">
              <Copy className="h-3.5 w-3.5" />
              Copy link
            </Button>
          </div>

          <div className="flex flex-col gap-4 rounded-sm border border-border bg-card p-6">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                {agreementStatusLabel(agreement.status)}
              </span>
              <span className="text-[11px] text-muted-foreground/60">#{String(agreement.id).padStart(4, "0")}</span>
              {role && <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] text-muted-foreground">You: {role === "partyA" ? "Party A" : "Party B"}</span>}
            </div>
            <h1 className="text-xl font-bold text-foreground">
              {meta?.title?.trim() || (isOneDeposit ? "One deposit" : "Both deposit") + ` · ${agreement.amountA} USDC` + (!isOneDeposit ? ` + ${agreement.amountB} USDC` : "")}
            </h1>
            {meta?.title?.trim() && (
              <p className="text-sm text-muted-foreground">
                {isOneDeposit ? "One deposit" : "Both deposit"} · {agreement.amountA} USDC
                {!isOneDeposit ? ` + ${agreement.amountB} USDC` : ""}
              </p>
            )}
            {meta?.description?.trim() && <p className="whitespace-pre-wrap text-sm text-muted-foreground">{meta.description}</p>}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <span className="text-[10px] uppercase text-muted-foreground">Party A</span>
                <p className="truncate font-mono text-xs text-foreground">{agreement.partyA}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-muted-foreground">Party B</span>
                <p className="truncate font-mono text-xs text-foreground">{agreement.partyB}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-muted-foreground">Deadline</span>
                <p className="text-xs text-foreground">{agreement.deadline.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase text-muted-foreground">Mode</span>
                <p className="text-xs text-foreground">{isOneDeposit ? "One deposit" : "Both deposit"}</p>
              </div>
            </div>

            {needsAccept && (
              <div className="flex flex-col gap-2 border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">
                  {agreement.mode === MODE_ONE_DEPOSIT ? "Accept to activate the agreement." : `Accept and lock ${agreement.amountB} USDC to activate.`}
                </p>
                <Button disabled={isAcceptPending} onClick={() => accept(agreement.id, agreement)} className="w-fit gap-2">
                  {isAcceptPending && <Loader2 className="h-4 w-4 animate-spin" />}
                  {agreement.mode === MODE_ONE_DEPOSIT ? "Accept agreement" : `Accept & lock ${agreement.amountB} USDC`}
                </Button>
              </div>
            )}

            {needsResolution && (
              <div className="flex flex-col gap-2 border-t border-border pt-4">
                <p className="text-sm text-muted-foreground">Submit your resolution. Funds move only when both match.</p>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={resolution}
                    onChange={(e) => setResolution(Number(e.target.value) as 1 | 2 | 3)}
                    className="rounded-sm border border-border bg-background px-3 py-2 text-sm"
                  >
                    <option value={1}>{outcomeLabel(OUTCOME_DONE, agreement.mode)}</option>
                    <option value={2}>{outcomeLabel(OUTCOME_CANCEL, agreement.mode)}</option>
                    {agreement.mode !== MODE_ONE_DEPOSIT && <option value={3}>{outcomeLabel(OUTCOME_REFUND_A, agreement.mode)}</option>}
                  </select>
                  <Button disabled={isSubmitPending} onClick={() => submit(agreement.id, resolution)} className="gap-2">
                    {isSubmitPending && <Loader2 className="h-4 w-4 animate-spin" />}
                    Submit
                  </Button>
                </div>
              </div>
            )}

            {agreement.status === STATUS_RESOLVED && (
              <p className="border-t border-border pt-4 text-sm text-muted-foreground">
                Resolved: {outcomeLabel(agreement.resolutionA, agreement.mode)}
              </p>
            )}

            {agreement.status === STATUS_ACTIVE && agreement.resolutionA !== 0 && agreement.resolutionB !== 0 && agreement.resolutionA !== agreement.resolutionB && (
              <p className="border-t border-border pt-4 text-sm text-amber-600 dark:text-amber-400">Mismatch. Re-submit until both match.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

