"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowRight, Lock } from "lucide-react"
import { useAccount } from "wagmi"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCreateCommitment } from "@/hooks/useCreateCommitment"
import { COMMITMENT_VAULT_ADDRESS } from "@/lib/contracts"

const ZERO = "0x0000000000000000000000000000000000000000" as `0x${string}`

export function CommitmentForm() {
  const router = useRouter()
  const { isConnected } = useAccount()
  const {
    approve,
    create,
    isApprovePending,
    isApproveSuccess,
    isCreatePending,
    isCreateSuccess,
    error,
  } = useCreateCommitment()

  const pendingCreate = useRef<{ amount: string; deadline: string; verifier: string; penaltyReceiver: string } | null>(null)
  const createSent = useRef(false)

  const [form, setForm] = useState({
    title: "",
    description: "",
    amount: "",
    deadline: "",
    verifier: "",
    penaltyReceiver: "",
  })

  useEffect(() => {
    if (!isApproveSuccess || !pendingCreate.current || createSent.current) return
    createSent.current = true
    const { amount, deadline, verifier, penaltyReceiver } = pendingCreate.current
    const deadlineTs = Math.floor(new Date(deadline).getTime() / 1000)
    const verifierAddr = verifier.trim() && /^0x[a-fA-F0-9]{40}$/.test(verifier.trim())
      ? (verifier.trim() as `0x${string}`)
      : ZERO
    const penaltyAddr = penaltyReceiver.trim() as `0x${string}`
    create(amount, deadlineTs, verifierAddr, penaltyAddr)
    pendingCreate.current = null
  }, [isApproveSuccess, create])

  useEffect(() => {
    if (isCreateSuccess) {
      toast.success("Commitment created", {
        description: `Locked ${form.amount} USDC onchain.`,
      })
      router.push("/dashboard")
    }
  }, [isCreateSuccess, form.amount, router])

  useEffect(() => {
    if (error) toast.error(error.message)
  }, [error])

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!isConnected) {
      toast.error("Connect your wallet first")
      return
    }
    const penaltyReceiver = form.penaltyReceiver.trim()
    if (!/^0x[a-fA-F0-9]{40}$/.test(penaltyReceiver)) {
      toast.error("Invalid penalty receiver address")
      return
    }
    createSent.current = false
    pendingCreate.current = {
      amount: form.amount,
      deadline: form.deadline,
      verifier: form.verifier,
      penaltyReceiver,
    }
    approve(form.amount)
  }

  const hasVault = COMMITMENT_VAULT_ADDRESS !== "0x0000000000000000000000000000000000000000"
  const isSubmitting = isApprovePending || isCreatePending

  const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      {/* Commitment details */}
      <fieldset className="flex flex-col gap-5">
        <legend className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <span className="h-px w-4 bg-border" />
          Commitment
        </legend>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title" className="text-sm text-foreground">Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="Ship MVP by end of Q1"
            value={form.title}
            onChange={handleChange}
            required
            className="rounded-sm border-border bg-card text-foreground placeholder:text-muted-foreground/50"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description" className="text-sm text-foreground">
            Description
            <span className="ml-1 text-muted-foreground">(optional)</span>
          </Label>
          <Textarea
            id="description"
            name="description"
            placeholder="What does success look like?"
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="resize-none rounded-sm border-border bg-card text-foreground placeholder:text-muted-foreground/50"
          />
        </div>
      </fieldset>

      {/* Financial */}
      <fieldset className="flex flex-col gap-5">
        <legend className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <span className="h-px w-4 bg-border" />
          Capital
        </legend>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="amount" className="text-sm text-foreground">Amount</Label>
          <div className="relative">
            <Input
              id="amount"
              name="amount"
              type="number"
              min="1"
              step="0.01"
              placeholder="1000"
              value={form.amount}
              onChange={handleChange}
              required
              className="rounded-sm border-border bg-card pr-16 text-foreground placeholder:text-muted-foreground/50"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-muted-foreground">
              USDC
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Transferred from your wallet to the vault contract on creation.
          </p>
        </div>
      </fieldset>

      {/* Timeline */}
      <fieldset className="flex flex-col gap-5">
        <legend className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <span className="h-px w-4 bg-border" />
          Deadline
        </legend>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="deadline" className="text-sm text-foreground">Resolve by</Label>
          <Input
            id="deadline"
            name="deadline"
            type="date"
            min={minDate}
            value={form.deadline}
            onChange={handleChange}
            required
            className="rounded-sm border-border bg-card text-foreground"
          />
        </div>
      </fieldset>

      {/* Parties */}
      <fieldset className="flex flex-col gap-5">
        <legend className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <span className="h-px w-4 bg-border" />
          Parties
        </legend>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="verifier" className="text-sm text-foreground">
            Verifier
            <span className="ml-1 text-muted-foreground">(optional)</span>
          </Label>
          <Input
            id="verifier"
            name="verifier"
            placeholder="0x..."
            value={form.verifier}
            onChange={handleChange}
            className="rounded-sm border-border bg-card font-mono text-sm text-foreground placeholder:text-muted-foreground/50"
          />
          <p className="text-xs text-muted-foreground">
            Address that can resolve alongside the creator. Leave empty to self-verify.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="penaltyReceiver" className="text-sm text-foreground">Penalty Receiver</Label>
          <Input
            id="penaltyReceiver"
            name="penaltyReceiver"
            placeholder="0x..."
            value={form.penaltyReceiver}
            onChange={handleChange}
            required
            className="rounded-sm border-border bg-card font-mono text-sm text-foreground placeholder:text-muted-foreground/50"
          />
          <p className="text-xs text-muted-foreground">
            Gets the locked USDC if you fail.
          </p>
        </div>
      </fieldset>

      {/* Warning + Submit */}
      <div className="flex flex-col gap-5 border-t border-border pt-6">
        {!isConnected && (
          <p className="rounded-sm border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
            Connect your wallet (Arc Testnet) to create a commitment.
          </p>
        )}
        {isConnected && !hasVault && (
          <p className="rounded-sm border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
            Vault not deployed. Set NEXT_PUBLIC_COMMITMENT_VAULT_ADDRESS after deploying the contract to Arc Testnet.
          </p>
        )}
        <div className="rounded-sm border border-primary/20 bg-primary/5 px-4 py-3">
          <p className="text-xs leading-relaxed text-primary">
            By submitting you authorize the transfer of USDC from your wallet to the vault contract. This action is irreversible until resolved.
          </p>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting || !isConnected || !hasVault}
          className="h-11 w-full gap-2 rounded-sm bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary/90"
        >
          {isSubmitting ? (
            <>
              <Lock className="h-4 w-4 animate-pulse" />
              {isApprovePending ? "Approve USDC..." : "Creating commitment..."}
            </>
          ) : (
            <>
              Lock & Create
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </form>
  )
}
