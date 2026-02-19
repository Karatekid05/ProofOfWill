# DualAgree

**Money only moves when both agree.**

DualAgree is a web app for two-party agreements with on-chain escrow: freelancers and clients, bets between friends, or any deal where both sides must agree before funds are released. No middleman holds the money—smart contracts and your wallet do. You stay in control.

---

## What it does

- **Two-party agreements** — One person creates an agreement (amount, deadline, optional title/description), locks USDC, and shares a link. The other connects their wallet and accepts (and can lock their own stake in “both deposit” mode). Funds are released **only when both parties submit the same resolution** (Done, Cancel, or Refund client). No single party can move the money.
- **Dashboard** — See all your agreements and commitments, with “Awaiting your action” when it’s your turn. Your USDC balance is shown in the header when your wallet is connected.
- **Optional title & description** — You can attach a title and description to an agreement; a hash is stored on-chain for audit while the app shows the text from local storage.
- **Legacy commitments** — Single-verifier commitments: lock USDC, set a verifier and penalty receiver; after the deadline, creator or verifier resolves (success → refund, fail → penalty).

**Use cases:** Freelance escrow (client locks pay; freelancer can add a stake as guarantee), bets (both lock; both agree on the winner), founder milestones, personal accountability.

---

## How it works

1. **Create** — Party A enters Party B’s wallet address, amounts, deadline, and mode (one deposit or both deposit). Party A locks USDC in the contract.
2. **Accept** — Party B opens the shared link, connects their wallet, and accepts. In “both deposit” mode, Party B also locks their stake here.
3. **Resolve** — When both are ready, each submits an outcome (Done / Cancel / Refund client). The contract releases funds only when both choices match. Until then, funds stay locked.

The app is a **frontend only**: it talks to the blockchain and your wallet. It does not custody funds, store private keys, or run a backend that holds your data. See [Privacy & security](#privacy--security) below.

---

## Quick start

1. **Install and run**
   ```bash
   pnpm install
   cp .env.example .env.local
   # Edit .env.local with your contract addresses (see Env vars below)
   pnpm dev
   ```

2. **Deploy contracts (once)**  
   Using [Foundry](https://book.getfoundry.sh):
   ```bash
   forge install foundry-rs/forge-std
   export PRIVATE_KEY=0x...   # Never commit or share this
   export OWNER=0x...         # Optional: for V2 emergency recovery
   forge script scripts/Deploy.s.sol --rpc-url https://rpc.testnet.arc.network --broadcast -vvv
   ```
   Copy the printed contract addresses into `.env.local` (see **Env vars**). Use the V2 vault address if you set `OWNER` (recommended for recovery and optional fee).

3. **Testnet USDC**  
   [Circle Faucet](https://faucet.circle.com) → choose **Arc Testnet** and request USDC.

---

## Env vars

All app env vars are **public** (no secrets in the frontend). Use `.env.local` locally and your host’s env in production; never commit `.env` or `.env.local`.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_COMMITMENT_FACTORY_ADDRESS` | Deployed CommitmentFactory (for legacy commitments). |
| `NEXT_PUBLIC_COMMITMENT_VAULT_ADDRESS` | Deployed CommitmentVault (fallback if not using factory). |
| `NEXT_PUBLIC_DUAL_CONSENSUS_VAULT_ADDRESS` | Deployed DualConsensusVault or V2 (two-party agreements). |

Deploy script only: `PRIVATE_KEY` and optional `OWNER` (see script comments). Keep `PRIVATE_KEY` off the repo and off any shared env.

---

## Privacy & security

- **Your keys never leave your device.** The app never sees or stores your private key. Signing and custody stay in your wallet (e.g. MetaMask, Rainbow).
- **No backend, no user database.** The app is static + client-side. Contract addresses in env are public; no API keys or user data are sent to our servers (there are none).
- **Funds are on-chain.** Escrow is held by the smart contracts. We don’t custody; we don’t move funds without the contract logic and your signatures.
- **Terms of Service.** Use of the app requires accepting the [Terms of Service](/terms); they describe limitations, testnet use, and that we don’t provide financial or legal advice.
- **Security details.** For a concise overview of contracts (access control, recovery, fee, no backdoors), see [docs/SECURITY.md](docs/SECURITY.md). For mainnet or high value, an external audit is recommended.

Do not commit `.env`, `.env.local`, or any file containing `PRIVATE_KEY` or other secrets. Use testnet for experimentation; treat mainnet and real funds with appropriate caution and, if needed, legal/audit review.

---

## Contracts (overview)

- **DualConsensusVault** — Two-party flow: create, accept (or acceptAndLock), submitResolution. Funds move only when both outcomes match. Modes: one deposit, both deposit.
- **DualConsensusVaultV2** — Same as above, plus: (1) **Emergency recovery** — after agreement deadline + 30 days, an owner can refund each party their own stake only (no diversion of funds); a justification hash is emitted for audit. (2) **Protocol fee** — owner can set `feeRecipient` and `feeBps`; fee is taken only on release.
- **CommitmentVault / CommitmentFactory** — Legacy: lock USDC, resolve by creator or verifier after deadline.

Agreements can store an optional **meta hash** (e.g. title/description) on-chain via `createAgreementWithMeta` for auditability.

---

## Arc Testnet

- Chain ID: `5042002`
- RPC: `https://rpc.testnet.arc.network`
- Explorer: https://testnet.arcscan.app

USDC is the configured ERC-20; contract address and decimals are in the codebase and public on-chain.

---

## Deploy frontend (e.g. Vercel)

1. Push the repo to GitHub.
2. In Vercel (or similar), import the project and set the same **env vars** as in **Env vars** (only `NEXT_PUBLIC_*`; no secrets).
3. Deploy. The app is static and client-driven; each push can trigger a new deployment.

---

## Status & roadmap

**Current:** Two-party agreements (create → share link → accept → both resolve), optional title/description, USDC balance in header when connected, Terms of Service with acceptance gate, legacy commitments. V2: emergency recovery (30 days past deadline, with justification) and protocol fee. **Arc Testnet only.**

Next steps (timeouts, disputes, arbitration) and vision: [ROADMAP.md](ROADMAP.md).
