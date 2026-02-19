"use client"

import { createConfig, http } from "wagmi"
import { injected } from "wagmi/connectors"
import { arcTestnet } from "./arc-chain"

export const config = createConfig({
  chains: [arcTestnet],
  connectors: [
    injected(), // Auto-detects all injected wallets (MetaMask, Coinbase, etc)
  ],
  transports: {
    [arcTestnet.id]: http(),
  },
  ssr: true,
})
