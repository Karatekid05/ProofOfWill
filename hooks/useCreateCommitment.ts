"use client"

import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi"
import { parseUnits } from "viem"
import {
  COMMITMENT_CONTRACT_ADDRESS,
  COMMITMENT_VAULT_ADDRESS,
  USE_FACTORY,
  USDC_ADDRESS,
  commitmentVaultAbi,
  commitmentFactoryAbi,
  erc20Abi,
  USDC_DECIMALS,
} from "@/lib/contracts"

export function useCreateCommitment() {
  const approveWrite = useWriteContract()
  const createWrite = useWriteContract()

  const approveReceipt = useWaitForTransactionReceipt({ hash: approveWrite.data })
  const createReceipt = useWaitForTransactionReceipt({ hash: createWrite.data })

  // If using factory, we need to approve the vault (not the factory)
  // Read vault address from factory if needed
  const { data: vaultAddress } = useReadContract({
    address: USE_FACTORY ? COMMITMENT_CONTRACT_ADDRESS : undefined,
    abi: commitmentFactoryAbi,
    functionName: "vault",
    query: { enabled: USE_FACTORY },
  })

  const approveTarget = USE_FACTORY && vaultAddress 
    ? (vaultAddress as `0x${string}`)
    : COMMITMENT_VAULT_ADDRESS

  const contractAbi = USE_FACTORY ? commitmentFactoryAbi : commitmentVaultAbi

  function approve(amountUsdc: string) {
    const amountWei = parseUnits(amountUsdc, USDC_DECIMALS)
    approveWrite.writeContract({
      address: USDC_ADDRESS,
      abi: erc20Abi,
      functionName: "approve",
      args: [approveTarget, amountWei],
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
      address: COMMITMENT_CONTRACT_ADDRESS,
      abi: contractAbi,
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
