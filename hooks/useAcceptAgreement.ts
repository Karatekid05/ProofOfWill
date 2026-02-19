"use client"

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { DUAL_CONSENSUS_VAULT_ADDRESS, dualConsensusVaultAbi } from "@/lib/contracts"
import { MODE_ONE_DEPOSIT } from "@/lib/agreements"
import type { Agreement } from "@/lib/agreements"

export function useAcceptAgreement() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  function accept(id: number, agreement: Agreement) {
    if (agreement.mode === MODE_ONE_DEPOSIT) {
      writeContract({
        address: DUAL_CONSENSUS_VAULT_ADDRESS,
        abi: dualConsensusVaultAbi,
        functionName: "accept",
        args: [BigInt(id)],
      })
    } else {
      writeContract({
        address: DUAL_CONSENSUS_VAULT_ADDRESS,
        abi: dualConsensusVaultAbi,
        functionName: "acceptAndLock",
        args: [BigInt(id)],
      })
    }
  }

  return {
    accept,
    hash,
    isPending: isPending || isConfirming,
    isSuccess,
    error,
    reset,
  }
}
