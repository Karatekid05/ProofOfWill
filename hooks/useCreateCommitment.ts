"use client"

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseUnits } from "viem"
import {
  COMMITMENT_VAULT_ADDRESS,
  USDC_ADDRESS,
  commitmentVaultAbi,
  erc20Abi,
  USDC_DECIMALS,
} from "@/lib/contracts"

export function useCreateCommitment() {
  const approveWrite = useWriteContract()
  const createWrite = useWriteContract()

  const approveReceipt = useWaitForTransactionReceipt({ hash: approveWrite.data })
  const createReceipt = useWaitForTransactionReceipt({ hash: createWrite.data })

  function approve(amountUsdc: string) {
    const amountWei = parseUnits(amountUsdc, USDC_DECIMALS)
    approveWrite.writeContract({
      address: USDC_ADDRESS,
      abi: erc20Abi,
      functionName: "approve",
      args: [COMMITMENT_VAULT_ADDRESS, amountWei],
    })
  }

  function create(
    amountUsdc: string,
    deadlineTimestamp: number,
    verifier: `0x${string}`,
    penaltyReceiver: `0x${string}`
  ) {
    const amountWei = parseUnits(amountUsdc, USDC_DECIMALS)
    createWrite.writeContract({
      address: COMMITMENT_VAULT_ADDRESS,
      abi: commitmentVaultAbi,
      functionName: "createCommitment",
      args: [amountWei, BigInt(deadlineTimestamp), verifier, penaltyReceiver],
    })
  }

  return {
    approve,
    create,
    approveWrite,
    createWrite,
    approveReceipt,
    createReceipt,
    isApprovePending: approveWrite.isPending || approveReceipt.isLoading,
    isApproveSuccess: approveReceipt.isSuccess,
    isCreatePending: createWrite.isPending || createReceipt.isLoading,
    isCreateSuccess: createReceipt.isSuccess,
    error: approveWrite.error || createWrite.error,
  }
}
