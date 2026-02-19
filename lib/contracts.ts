import { ARC_TESTNET_USDC } from "./arc-chain"

/**
 * CommitmentVault contract address on Arc Testnet.
 * Set after deploy: npx hardhat run scripts/deploy.js --network arcTestnet
 * Or with Foundry: forge script ... --rpc-url https://rpc.testnet.arc.network
 */
export const COMMITMENT_VAULT_ADDRESS =
  (process.env.NEXT_PUBLIC_COMMITMENT_VAULT_ADDRESS as `0x${string}`) ||
  ("0x0000000000000000000000000000000000000000" as `0x${string}`)

export const USDC_ADDRESS = ARC_TESTNET_USDC as `0x${string}`

/** USDC uses 6 decimals on Arc (ERC-20 interface) */
export const USDC_DECIMALS = 6

export const commitmentVaultAbi = [
  {
    inputs: [{ name: "_usdc", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "id", type: "uint256" },
      { indexed: false, name: "creator", type: "address" },
      { indexed: false, name: "amount", type: "uint256" },
      { indexed: false, name: "deadline", type: "uint256" },
      { indexed: false, name: "verifier", type: "address" },
      { indexed: false, name: "penaltyReceiver", type: "address" },
    ],
    name: "CommitmentCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "id", type: "uint256" },
      { indexed: false, name: "success", type: "bool" },
    ],
    name: "CommitmentResolved",
    type: "event",
  },
  {
    inputs: [
      { name: "amount", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "verifier", type: "address" },
      { name: "penaltyReceiver", type: "address" },
    ],
    name: "createCommitment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "id", type: "uint256" }],
    name: "commitments",
    outputs: [
      { name: "creator", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "verifier", type: "address" },
      { name: "penaltyReceiver", type: "address" },
      { name: "resolved", type: "bool" },
      { name: "success", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "nextId",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { name: "id", type: "uint256" },
      { name: "success", type: "bool" },
    ],
    name: "resolveCommitment",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "usdc",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "id", type: "uint256" }],
    name: "getCommitment",
    outputs: [
      { name: "creator", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "verifier", type: "address" },
      { name: "penaltyReceiver", type: "address" },
      { name: "resolved", type: "bool" },
      { name: "success", type: "bool" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "id", type: "uint256" }],
    name: "commitmentExists",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
] as const

export const erc20Abi = [
  {
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
] as const
