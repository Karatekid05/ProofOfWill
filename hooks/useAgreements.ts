"use client"

import { useReadContract, useReadContracts } from "wagmi"
import { useMemo } from "react"
import {
  DUAL_CONSENSUS_VAULT_ADDRESS,
  HAS_DUAL_VAULT,
  dualConsensusVaultAbi,
} from "@/lib/contracts"
import { parseAgreement } from "@/lib/agreements"
import type { Agreement } from "@/lib/agreements"

export function useAgreement(id: number) {
  return useReadContract({
    address: DUAL_CONSENSUS_VAULT_ADDRESS,
    abi: dualConsensusVaultAbi,
    functionName: "getAgreement",
    args: [BigInt(id)],
  })
}

export function useAllAgreements(): {
  agreements: Agreement[]
  isLoading: boolean
  refetch: () => void
  hasVault: boolean
} {
  const { data: total, isLoading: loadingCount, refetch: refetchCount } = useReadContract({
    address: DUAL_CONSENSUS_VAULT_ADDRESS,
    abi: dualConsensusVaultAbi,
    functionName: "totalAgreements",
  })

  const count = total !== undefined ? Number(total) : 0

  const contracts = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        address: DUAL_CONSENSUS_VAULT_ADDRESS,
        abi: dualConsensusVaultAbi,
        functionName: "getAgreement" as const,
        args: [BigInt(i)] as const,
      })),
    [count]
  )

  const { data: results, isLoading: loadingList, refetch: refetchList } = useReadContracts({
    contracts: count > 0 ? contracts : [],
  })

  const agreements = useMemo(() => {
    if (!results || results.length === 0) return []
    return results
      .map((r, i) => {
        if (r.status !== "success" || !r.result) return null
        const raw = r.result as readonly [string, string, bigint, bigint, bigint, number, number, number, number]
        return parseAgreement(i, raw)
      })
      .filter((a): a is Agreement => a !== null)
  }, [results])

  const refetch = () => {
    refetchCount()
    refetchList()
  }

  return {
    agreements,
    isLoading: !HAS_DUAL_VAULT ? false : loadingCount || (count > 0 && loadingList),
    refetch,
    hasVault: HAS_DUAL_VAULT,
  }
}
