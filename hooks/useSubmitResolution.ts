"use client"

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { DUAL_CONSENSUS_VAULT_ADDRESS, dualConsensusVaultAbi } from "@/lib/contracts"
import type { Outcome } from "@/lib/agreements"

export function useSubmitResolution() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  function submit(id: number, outcome: Outcome) {
    writeContract({
      address: DUAL_CONSENSUS_VAULT_ADDRESS,
      abi: dualConsensusVaultAbi,
      functionName: "submitResolution",
      args: [BigInt(id), outcome],
    })
  }

  return {
    submit,
    hash,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    reset,
  }
}
