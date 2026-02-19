# Roadmap — DualAgree

## Vision

Escrow where **money only moves when both agree**: freelance (client + worker), bets between friends (both lock, both decide the winner), or any two-party agreement. No consensus means funds stay locked. That forces the client to pay and the worker to deliver — or both agree to cancel.

---

## Two consensus types

1. **One deposits, one receives**  
   One party locks the funds (e.g. client locks the fee). The other receives when both submit the same resolution (e.g. both «done» → payment to worker; both «cancel» → refund to client). Classic freelance escrow.

2. **Both deposit, one receives**  
   Both parties lock funds (e.g. client locks the fee, freelancer locks a guarantee). When both agree «completed», the freelancer gets both amounts. When both agree «refund client» (work not delivered), the client gets both — so the freelancer’s stake acts as a guarantee and the client is not scammed. Same structure for bets: both lock the same amount; one wins the pot when both agree on the outcome.

---

## Phases

### 1. Live now

- **Dual consensus**: `DualConsensusVault` on Arc Testnet. Two parties; create → other accepts (and optionally locks) → both submit same outcome to release. Modes: one-deposits-one-receives, both-deposit-one-receives (e.g. freelancer guarantee, bets).
- **V2**: Emergency recovery (deadline + 30 days; owner refunds each party only; justification hash for audit). Protocol fee on release (`setFee(feeRecipient, feeBps)`). Optional title/description hash via `createAgreementWithMeta`.
- **Legacy commitments**: `CommitmentVault` + `CommitmentFactory` — single verifier can resolve (success / fail).
- Frontend: create agreement (optional title/description), dashboard (Agreements + Commitments), share link, accept, submit resolution.

### 2. Next: Disputes and timeouts

- When one says done and the other cancel: **deadline** for the other party to respond (e.g. 7 days).
- Rules at creation: what happens if no response (e.g. refund to depositor, or open dispute).
- Re-vote until consensus stays; timeout adds a way to unblock.

### 3. Later: Arbitration

- **Protocol fee**: Implemented in V2 (owner sets `feeRecipient` and `feeBps`; fee on release only).
- Optional: **arbitration** (third party decides on deadlock); cost and process defined in the contract.

---

## Anti-scam

- **Dual consensus**: no one can move funds alone; both signatures required.
- **Transparency**: everything onchain; history of decisions and funds.
- **Timeouts and disputes**: deadlines and consequences defined in the agreement reduce abuse (e.g. one party never responding).
- **Freelancer guarantee (both deposit)**: client can recover both stakes if both agree work wasn’t delivered — strong incentive for the worker to deliver.

---

## Current stack

- **Chain**: Arc Testnet.
- **Contracts**: Solidity, Foundry; USDC (or equivalent) in vault.
- **Frontend**: Next.js, Rainbow Kit (injected wallets), wagmi.
- **Deploy**: Foundry script; frontend on Vercel with env vars for contract addresses.

---

## Next technical steps

1. Add **timeout** and dispute rules in contract and UI (deadline to respond, default outcome).
2. Implement **protocol fee** (amount and where it’s taken) and reflect in UI.
3. Optional: arbitration flow for permanent deadlock.
