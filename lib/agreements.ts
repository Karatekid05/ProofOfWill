import { USDC_DECIMALS } from "./contracts"

export type AgreementMode = 0 | 1 // OneDeposit | BothDeposit
export type AgreementStatus = 0 | 1 | 2 // Created | Active | Resolved
export type Outcome = 0 | 1 | 2 | 3 // None | Done | Cancel | RefundA

export interface Agreement {
  id: number
  partyA: string
  partyB: string
  amountA: number
  amountB: number
  deadline: Date
  mode: AgreementMode
  status: AgreementStatus
  resolutionA: Outcome
  resolutionB: Outcome
}

export const MODE_ONE_DEPOSIT = 0
export const MODE_BOTH_DEPOSIT = 1

export const OUTCOME_NONE = 0
export const OUTCOME_DONE = 1
export const OUTCOME_CANCEL = 2
export const OUTCOME_REFUND_A = 3

export const STATUS_CREATED = 0
export const STATUS_ACTIVE = 1
export const STATUS_RESOLVED = 2

export function parseAgreement(
  id: number,
  raw: readonly [string, string, bigint, bigint, bigint, number, number, number, number]
): Agreement {
  const [partyA, partyB, amountA, amountB, deadline, mode, status, resolutionA, resolutionB] = raw
  return {
    id,
    partyA,
    partyB,
    amountA: Number(amountA) / 10 ** USDC_DECIMALS,
    amountB: Number(amountB) / 10 ** USDC_DECIMALS,
    deadline: new Date(Number(deadline) * 1000),
    mode: mode as AgreementMode,
    status: status as AgreementStatus,
    resolutionA: resolutionA as Outcome,
    resolutionB: resolutionB as Outcome,
  }
}

export function agreementStatusLabel(status: AgreementStatus): string {
  if (status === STATUS_CREATED) return "Awaiting acceptance"
  if (status === STATUS_ACTIVE) return "Active"
  return "Resolved"
}

export function outcomeLabel(outcome: Outcome, mode: AgreementMode): string {
  if (outcome === OUTCOME_DONE) return "Done"
  if (outcome === OUTCOME_CANCEL) return "Cancel"
  if (outcome === OUTCOME_REFUND_A) return mode === MODE_BOTH_DEPOSIT ? "Refund client" : "—"
  return "—"
}

export function isAwaitingMyAction(agreement: Agreement, myAddress: string): boolean {
  if (!myAddress) return false
  const addr = myAddress.toLowerCase()
  if (agreement.status === STATUS_CREATED && agreement.partyB.toLowerCase() === addr) return true
  if (agreement.status === STATUS_ACTIVE) {
    const isPartyA = agreement.partyA.toLowerCase() === addr
    const isPartyB = agreement.partyB.toLowerCase() === addr
    const myResolution = isPartyA ? agreement.resolutionA : isPartyB ? agreement.resolutionB : OUTCOME_NONE
    if ((isPartyA || isPartyB) && myResolution === OUTCOME_NONE) return true
  }
  return false
}

export function myRole(agreement: Agreement, myAddress: string): "partyA" | "partyB" | null {
  if (!myAddress) return null
  const addr = myAddress.toLowerCase()
  if (agreement.partyA.toLowerCase() === addr) return "partyA"
  if (agreement.partyB.toLowerCase() === addr) return "partyB"
  return null
}
