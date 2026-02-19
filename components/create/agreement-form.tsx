"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { ArrowRight, Loader2, ExternalLink, Copy } from "lucide-react"
import { useAccount, useChainId, usePublicClient } from "wagmi"
import { arcTestnet } from "@/lib/arc-chain"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCreateAgreement } from "@/hooks/useCreateAgreement"
import { HAS_DUAL_VAULT, DUAL_CONSENSUS_VAULT_ADDRESS, dualConsensusVaultAbi } from "@/lib/contracts"
import { setAgreementMeta } from "@/lib/agreement-meta"
import { MODE_ONE_DEPOSIT, MODE_BOTH_DEPOSIT } from "@/lib/agreements"

export function AgreementForm() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const {
    approve,
    create,
    isApprovePending,
    isApproveSuccess,
    isCreatePending,
    isCreateSuccess,
    createWrite,
    error,
  } = useCreateAgreement()

  const pendingCreate = useRef<{ partyB: string; amountA: string; amountB: string; deadline: string; mode: 0 | 1; title: string; description: string } | null>(null)
  const createdMetaRef = useRef<{ title: string; description: string } | null>(null)
  const createSent = useRef(false)
  const publicClient = usePublicClient()

  const [mode, setMode] = useState<0 | 1>(MODE_ONE_DEPOSIT)
  const [form, setForm] = useState({
    partyB: "",
    amountA: "",
    amountB: "",
    deadline: "",
    title: "",
    description: "",
  })

  useEffect(() => {
    if (!isApproveSuccess || !pendingCreate.current || createSent.current) return
    createSent.current = true
    const { partyB, amountA, amountB, deadline, title, description } = pendingCreate.current
    createdMetaRef.current = title.trim() || description.trim() ? { title, description } : null
    const deadlineTs = Math.floor(new Date(deadline).getTime() / 1000)
    const partyBAddr = partyB.trim() as `0x${string}`
    const meta = createdMetaRef.current ?? undefined
    create(partyBAddr, amountA, amountB, deadlineTs, mode, meta)
    pendingCreate.current = null
  }, [isApproveSuccess, create, mode])

  useEffect(() => {
    if (!isCreateSuccess || !createWrite.data) return
    ;(async () => {
      if (createdMetaRef.current && publicClient) {
        try {
          const total = await publicClient.readContract({
            address: DUAL_CONSENSUS_VAULT_ADDRESS,
            abi: dualConsensusVaultAbi,
            functionName: "totalAgreements",
          })
          const newId = Number(total) - 1
          setAgreementMeta(newId, createdMetaRef.current)
        } catch {
          // ignore
        }
        createdMetaRef.current = null
      }
    })()
    toast.success("Agreement created", {
      description: "Share the link with the other party so they can accept.",
      action: {
        label: "View tx",
        onClick: () => window.open(`${arcTestnet.blockExplorers.default.url}/tx/${createWrite.data}`, "_blank"),
      },
    })
    setTimeout(() => router.push("/dashboard"), 2500)
  }, [isCreateSuccess, createWrite.data, publicClient, router])

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
    const partyB = form.partyB.trim()
    if (!/^0x[a-fA-F0-9]{40}$/.test(partyB)) {
      toast.error("Invalid counter-party address (0x...)")
      return
    }
    if (Number(form.amountA) <= 0) {
      toast.error("Amount must be positive")
      return
    }
    if (mode === MODE_BOTH_DEPOSIT && Number(form.amountB) <= 0) {
      toast.error("Counter-party stake must be positive for Both deposit")
      return
    }
    createSent.current = false
    pendingCreate.current = {
      partyB,
      amountA: form.amountA,
      amountB: mode === MODE_BOTH_DEPOSIT ? form.amountB : "0",
      deadline: form.deadline,
      title: form.title,
      description: form.description,
    }
    approve(form.amountA)
  }

  const isSubmitting = isApprovePending || isCreatePending
  const isWrongChain = chainId !== arcTestnet.id
  const minDate = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0]

  if (!HAS_DUAL_VAULT) {
    return (
      <div className="rounded-sm border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-600 dark:text-amber-400">
        Dual consensus vault not configured. Deploy contracts and set NEXT_PUBLIC_DUAL_CONSENSUS_VAULT_ADDRESS.
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-10">
      <fieldset className="flex flex-col gap-5">
        <legend className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <span className="h-px w-4 bg-border" />
          Type
        </legend>
        <div className="flex flex-col gap-3">
          <label className="flex cursor-pointer items-start gap-2">
            <input
              type="radio"
              name="mode"
              checked={mode === MODE_ONE_DEPOSIT}
              onChange={() => setMode(MODE_ONE_DEPOSIT)}
              className="mt-1 rounded-full border-border"
            />
            <span className="text-sm">One deposits — you lock; they receive when both agree.</span>
          </label>
          <label className="flex cursor-pointer items-start gap-2">
            <input
              type="radio"
              name="mode"
              checked={mode === MODE_BOTH_DEPOSIT}
              onChange={() => setMode(MODE_BOTH_DEPOSIT)}
              className="mt-1 rounded-full border-border"
            />
            <span className="text-sm">Both deposit — guarantee: both lock; one receives (e.g. freelancer stake).</span>
          </label>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <span className="h-px w-4 bg-border" />
          Counter-party
        </legend>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="partyB">Counter-party wallet address</Label>
          <Input
            id="partyB"
            name="partyB"
            placeholder="0x..."
            value={form.partyB}
            onChange={handleChange}
            required
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            They will need to connect this wallet to accept the agreement (and lock their stake if both deposit).
          </p>
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <span className="h-px w-4 bg-border" />
          Title & description (optional)
        </legend>
        <p className="text-xs text-muted-foreground">
          Stored on-chain as a hash for audit (e.g. scope of work). The other party will see this when they open the link.
        </p>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            name="title"
            placeholder="e.g. Website delivery – Homepage + CMS"
            value={form.title}
            onChange={handleChange}
            className="text-sm"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            placeholder="e.g. Deliver responsive homepage and admin panel by deadline. Payment on both marking Done."
            value={form.description}
            onChange={handleChange}
            rows={3}
            className="resize-none text-sm"
          />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <span className="h-px w-4 bg-border" />
          Amounts (USDC)
        </legend>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="amountA">Your amount (to lock)</Label>
          <div className="relative">
            <Input
              id="amountA"
              name="amountA"
              type="number"
              min="0.000001"
              step="any"
              placeholder="100"
              value={form.amountA}
              onChange={handleChange}
              required
              className="pr-12"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">USDC</span>
          </div>
        </div>
        {mode === MODE_BOTH_DEPOSIT && (
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="amountB">Counter-party stake (they lock on accept)</Label>
            <div className="relative">
              <Input
                id="amountB"
                name="amountB"
                type="number"
                min="0.000001"
                step="any"
                placeholder="50"
                value={form.amountB}
                onChange={handleChange}
                required
                className="pr-12"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">USDC</span>
            </div>
          </div>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-5">
        <legend className="mb-1 flex items-center gap-2 text-xs font-medium uppercase tracking-widest text-muted-foreground">
          <span className="h-px w-4 bg-border" />
          Deadline
        </legend>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="deadline">Resolve by (date)</Label>
          <Input
            id="deadline"
            name="deadline"
            type="date"
            min={minDate}
            value={form.deadline}
            onChange={handleChange}
            required
          />
        </div>
      </fieldset>

      {isWrongChain && (
        <p className="text-sm text-amber-600 dark:text-amber-400">Switch to Arc Testnet to create an agreement.</p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting || isWrongChain}
        className="gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {isApprovePending ? "Approve USDC…" : "Creating…"}
          </>
        ) : (
          <>
            Create agreement
            <ArrowRight className="h-4 w-4" />
          </>
        )}
      </Button>
    </form>
  )
}
