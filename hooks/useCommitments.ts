"use client"

import { useReadContract, useReadContracts } from "wagmi"
import { useMemo } from "react"
import {
  COMMITMENT_VAULT_ADDRESS,
  commitmentVaultAbi,
  USDC_DECIMALS,
} from "@/lib/contracts"
import type { Commitment } from "@/lib/commitments"

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000"

export function useNextId() {
  return useReadContract({
    address: COMMITMENT_VAULT_ADDRESS,
    abi: commitmentVaultAbi,
    functionName: "nextId",
  })
}

export function useCommitment(id: number) {
  return useReadContract({
    address: COMMITMENT_VAULT_ADDRESS,
    abi: commitmentVaultAbi,
    functionName: "getCommitment",
    args: [BigInt(id)],
  })
}

function parseCommitment(id: number, data: readonly [string, bigint, bigint, string, string, boolean, boolean] | undefined): Commitment | null {
  if (!data) return null
  const [creator, amount, deadline, verifier, penaltyReceiver, resolved, success] = data
  return {
    id,
    title: `Commitment #${id}`,
    description: "",
    creator,
    amount: Number(amount) / 10 ** USDC_DECIMALS,
    deadline: new Date(Number(deadline) * 1000),
    verifier: verifier === ZERO_ADDRESS ? "" : verifier,
    penaltyReceiver,
    resolved,
    success,
    createdAt: new Date(Number(deadline) * 1000 - 30 * 24 * 60 * 60 * 1000),
  }
}

export function useAllCommitments(): {
  commitments: Commitment[]
  isLoading: boolean
  refetch: () => void
  hasVault: boolean
} {
  const { data: nextId, isLoading: loadingCount, refetch: refetchCount } = useNextId()
  const count = nextId !== undefined ? Number(nextId) : 0

  const contracts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        address: COMMITMENT_VAULT_ADDRESS,
        abi: commitmentVaultAbi,
        functionName: "getCommitment" as const,
        args: [BigInt(i)] as const,
      })),
    [count]
  )

  const { data: results, isLoading: loadingList, refetch: refetchList } = useReadContracts({
    contracts: count > 0 ? contracts : [],
  })

  const commitments = useMemo(() => {
    if (!results || results.length === 0) return []
    return results
      .map((r, i) => (r.status === "success" && r.result ? parseCommitment(i, r.result as readonly [string, bigint, bigint, string, string, boolean, boolean]) : null))
      .filter((c): c is Commitment => c !== null)
  }, [results])

  const refetch = () => {
    refetchCount()
    refetchList()
  }

  const hasVault = COMMITMENT_VAULT_ADDRESS !== ZERO_ADDRESS

  return {
    commitments,
    isLoading: loadingCount || (count > 0 && loadingList),
    refetch,
    hasVault,
  }
}
