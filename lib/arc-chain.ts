import { defineChain } from "viem"

/**
 * Arc Testnet — Circle's L1 for stablecoin finance.
 * Chain ID: 5042002
 * USDC is native gas token; ERC-20 USDC for transfers: 0x3600000000000000000000000000000000000000 (6 decimals)
 * RPC: https://rpc.testnet.arc.network
 * Explorer: https://testnet.arcscan.app
 * Faucet: https://faucet.circle.com (select Arc Testnet)
 */
export const arcTestnet = defineChain({
  id: 5042002,
  name: "Arc Testnet",
  nativeCurrency: {
    decimals: 18,
    name: "USDC",
    symbol: "USDC",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.testnet.arc.network"],
    },
    public: {
      http: ["https://rpc.testnet.arc.network"],
    },
  },
  blockExplorers: {
    default: {
      name: "Arcscan",
      url: "https://testnet.arcscan.app",
    },
  },
  contracts: {
    multicall3: {
      address: "0xcA11bde05977b3631167028862bE2a173976CA11",
      blockCreated: 1,
    },
  },
})

/** USDC on Arc Testnet — ERC-20 interface for native USDC (6 decimals for transfers) */
export const ARC_TESTNET_USDC = "0x3600000000000000000000000000000000000000" as const
