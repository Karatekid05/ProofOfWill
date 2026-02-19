"use client"

import { useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { parseUnits } from "viem"
import {
  DUAL_CONSENSUS_VAULT_ADDRESS,
  USDC_ADDRESS,
  dualConsensusVaultAbi,
  erc20Abi,
  USDC_DECIMALS,
} from "@/lib/contracts"
import { MODE_ONE_DEPOSIT, MODE_BOTH_DEPOSIT } from "@/lib/agreements"

export function useCreateAgreement() {
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
      args: [DUAL_CONSENSUS_VAULT_ADDRESS, amountWei],
    })
  }

  function create(
    partyB: `0x${string}`,
    amountA: string,
    amountB: string,
    deadlineTimestamp: number,
    mode: 0 | 1
  ) {
    const amountAWei = parseUnits(amountA, USDC_DECIMALS)
    const amountBWei = mode === MODE_BOTH_DEPOSIT ? parseUnits(amountB, USDC_DECIMALS) : 0n
    createWrite.writeContract({
      address: DUAL_CONSENSUS_VAULT_ADDRESS,
      abi: dualConsensusVaultAbi,
      functionName: "createAgreement",
      args: [partyB, amountAWei, amountBWei, BigInt(deadlineTimestamp), mode],
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
