import { ARC_TESTNET_USDC } from "./arc-chain"

/**
 * CommitmentFactory contract address on Arc Testnet (preferred).
 * Falls back to vault address if factory not set (backward compatibility).
 */
export const COMMITMENT_FACTORY_ADDRESS =
  (process.env.NEXT_PUBLIC_COMMITMENT_FACTORY_ADDRESS as `0x${string}`) ||
  ("0x0000000000000000000000000000000000000000" as `0x${string}`)

/**
 * CommitmentVault contract address on Arc Testnet (fallback if factory not used).
 */
export const COMMITMENT_VAULT_ADDRESS =
  (process.env.NEXT_PUBLIC_COMMITMENT_VAULT_ADDRESS as `0x${string}`) ||
  ("0x0000000000000000000000000000000000000000" as `0x${string}`)

// Use factory if available, otherwise fall back to vault
export const COMMITMENT_CONTRACT_ADDRESS = 
  COMMITMENT_FACTORY_ADDRESS !== "0x0000000000000000000000000000000000000000"
    ? COMMITMENT_FACTORY_ADDRESS
    : COMMITMENT_VAULT_ADDRESS

export const USE_FACTORY = COMMITMENT_FACTORY_ADDRESS !== "0x0000000000000000000000000000000000000000"

/**
 * DualConsensusVault (or V2): two-party agreements. Prefer V2 when set (recovery + fee).
 */
const _VAULT = (process.env.NEXT_PUBLIC_DUAL_CONSENSUS_VAULT_ADDRESS as `0x${string}`) || ("0x0000000000000000000000000000000000000000" as `0x${string}`)
const _VAULT_V2 = (process.env.NEXT_PUBLIC_DUAL_CONSENSUS_VAULT_ADDRESS_V2 as `0x${string}`) || ("0x0000000000000000000000000000000000000000" as `0x${string}`)
export const DUAL_CONSENSUS_VAULT_ADDRESS =
  _VAULT_V2 !== "0x0000000000000000000000000000000000000000" ? _VAULT_V2 : _VAULT

export const HAS_DUAL_VAULT = DUAL_CONSENSUS_VAULT_ADDRESS !== "0x0000000000000000000000000000000000000000"

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

export const commitmentFactoryAbi = [
  {
    inputs: [
      { name: "_vault", type: "address" },
      { name: "_usdc", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "vault", type: "address" },
      { indexed: true, name: "usdc", type: "address" },
    ],
    name: "FactoryInitialized",
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
    outputs: [{ name: "commitmentId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "id", type: "uint256" }],
    name: "commitmentExists",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalCommitments",
    outputs: [{ name: "", type: "uint256" }],
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
    inputs: [],
    name: "vault",
    outputs: [{ name: "", type: "address" }],
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

export const dualConsensusVaultAbi = [
  { inputs: [{ name: "_usdc", type: "address" }], stateMutability: "nonpayable", type: "constructor" },
  {
    inputs: [
      { name: "partyB", type: "address" },
      { name: "amountA", type: "uint256" },
      { name: "amountB", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "mode", type: "uint8" },
    ],
    name: "createAgreement",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { name: "partyB", type: "address" },
      { name: "amountA", type: "uint256" },
      { name: "amountB", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "mode", type: "uint8" },
      { name: "metaHash", type: "bytes32" },
    ],
    name: "createAgreementWithMeta",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  { inputs: [{ name: "id", type: "uint256" }], name: "agreementMetaHash", outputs: [{ name: "", type: "bytes32" }], stateMutability: "view", type: "function" },
  { inputs: [{ name: "id", type: "uint256" }], name: "accept", outputs: [], stateMutability: "nonpayable", type: "function" },
  { inputs: [{ name: "id", type: "uint256" }], name: "acceptAndLock", outputs: [], stateMutability: "nonpayable", type: "function" },
  {
    inputs: [{ name: "id", type: "uint256" }, { name: "outcome", type: "uint8" }],
    name: "submitResolution",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ name: "id", type: "uint256" }],
    name: "getAgreement",
    outputs: [
      { name: "partyA", type: "address" },
      { name: "partyB", type: "address" },
      { name: "amountA", type: "uint256" },
      { name: "amountB", type: "uint256" },
      { name: "deadline", type: "uint256" },
      { name: "mode", type: "uint8" },
      { name: "status", type: "uint8" },
      { name: "resolutionA", type: "uint8" },
      { name: "resolutionB", type: "uint8" },
    ],
    stateMutability: "view",
    type: "function",
  },
  { inputs: [{ name: "id", type: "uint256" }], name: "agreementExists", outputs: [{ name: "", type: "bool" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "totalAgreements", outputs: [{ name: "", type: "uint256" }], stateMutability: "view", type: "function" },
  { inputs: [], name: "usdc", outputs: [{ name: "", type: "address" }], stateMutability: "view", type: "function" },
] as const
