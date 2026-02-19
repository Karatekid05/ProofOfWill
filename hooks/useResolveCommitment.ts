"use client"

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import {
  COMMITMENT_CONTRACT_ADDRESS,
  USE_FACTORY,
  commitmentVaultAbi,
  commitmentFactoryAbi,
} from "@/lib/contracts"

export function useResolveCommitment() {
  const { writeContract, data: hash, isPending, error, reset } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const contractAbi = USE_FACTORY ? commitmentFactoryAbi : commitmentVaultAbi

  function resolve(id: number, success: boolean) {
    writeContract({
      address: COMMITMENT_CONTRACT_ADDRESS,
      abi: contractAbi,
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
