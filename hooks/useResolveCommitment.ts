"use client"

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { COMMITMENT_VAULT_ADDRESS, commitmentVaultAbi } from "@/lib/contracts"

export function useResolveCommitment() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  function resolve(id: number, success: boolean) {
    writeContract({
      address: COMMITMENT_VAULT_ADDRESS,
      abi: commitmentVaultAbi,
      functionName: "resolveCommitment",
      args: [BigInt(id), success],
    })
  }

  return {
    resolve,
    hash,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    reset,
  }
}
