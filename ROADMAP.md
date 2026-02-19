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

### 1. Today (MVP)

- **Single verifier**: one party locks capital; creator or verifier can resolve (success / fail).
- Contracts: `CommitmentVault`, `CommitmentFactory` on Arc Testnet.
- Frontend: create agreement, dashboard (All / Active / Pending / Resolved), resolve onchain.
- Useful for commitments where a third party confirms the result.

### 2. Next: Dual consensus + two types

- **New contract** (or extension) with two parties: e.g. `partyA` and `partyB`.
- Each submits a decision onchain: `done`, `cancel`, or (for bets) `A_wins` / `B_wins`.
- Funds only release when **both submissions match**.
  - Both «done» → payment to worker (or bet winner).
  - Both «cancel» → refund to depositor(s) (each gets own stake in both-deposit mode).
  - Mismatch → dispute; funds stay locked.
- Support both modes: one-deposits-one-receives and both-deposit-one-receives (e.g. freelancer guarantee).
- Re-vote flow until consensus (or timeout / dispute in phase 3).

### 3. Later: Disputes and timeouts

- If one says done and the other cancel: **deadline** for the other party to respond (e.g. 7 days).
- Rules set at creation: what happens if no response (e.g. refund to depositor, or open dispute).
- Optional: **arbitration** (third party decides on deadlock); cost and process defined in the contract.

### 4. Sustainability: Protocol fee

- **Fee on resolution**: e.g. 0.5–1% of released amount, or fixed fee per agreement.
- Charged in-contract (on release) or via frontend; TBD.
- Part of the fee can fund incentives (e.g. tips, rewards) to encourage usage.

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

1. Design and implement **dual-consensus contract** (two parties, dual submission, release only on match); support one-deposits and both-deposit modes.
2. Update frontend: create two-party agreement, UI for each party to submit decision, consensus vs dispute indicator.
3. Add **timeout** and dispute rules in contract and UI.
4. Implement **protocol fee** (amount and where it’s taken) and reflect in UI.
5. Keep docs and copy in English; README and metadata aligned with the vision.
